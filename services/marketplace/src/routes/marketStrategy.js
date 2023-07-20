const Router = require("koa-router");
const router = Router();
const Joi = require("joi");
const dayjs = require("dayjs");
const { omit } = require("lodash");

const { dbClient } = require("@paratica/common/prisma");
const { createStrategyFollower } = require("@backend/common/functions/strategyFollower");
const { removeByPrefix } = require("@backend/common/services/redis");

const { getFunnelById } = require("../services/funnel");
const {
	_orderBy,
	TIME_RANGE_MAP,
	getMarketStrategyById,
	preparePricingInfo,
	getFollowerLimitControlResult,
	_getMarketStrategyWhere,
	getMarketStrategiesCountService,
} = require("../services/marketStrategy");
const { STATUS_TYPES } = require("../constants");
const { MarketStrategy, MarketStrategyStatus } = require("../models/marketStrategy");
const { setError } = require("@backend/common/utils");
const { getPaginationQuery } = require("@backend/common/utils");

const { _sendNotifications, NOTIFICATION_TITLES } = require("@backend/common/functions/notificationControls");
const rateLimit = require("@backend/common/middlewares/rateLimit");

const BITMEX_PLATFORM_ID = 1;

const getMarketStrategiesSchema = Joi.object({
	where: Joi.object({
		merchantId: Joi.number().optional(),
		funnelId: Joi.number().optional(),
		search: Joi.string().allow("").optional(),
		pageNumber: Joi.number().min(0).optional().default(0),
		pageSize: Joi.number().min(0).max(250).optional().default(250),
		platformId: Joi.number().optional(),
		timeRange: Joi.string()
			.optional()
			.valid(...Object.keys(TIME_RANGE_MAP)),
	})
		.optional()
		.allow(""),
	orderBy: Joi.object({
		profitPercent: Joi.string().valid("asc", "desc").optional(),
		successRate: Joi.string().valid("asc", "desc").optional(),
		averageProfit: Joi.string().valid("asc", "desc").optional(),
		followerCount: Joi.string().valid("asc", "desc").optional(),
		positionCount: Joi.string().valid("asc", "desc").optional(),
	})
		.optional()
		.allow(""),
}).error(new Joi.ValidationError(`getMarketStrategiesSchema type error`));

async function getMarketStrategies(ctx, next) {
	const body = Joi.attempt(ctx.request.body, getMarketStrategiesSchema);
	const { funnelId, pageNumber, pageSize, timeRange } = body.where;

	let funnel;

	if (funnelId) {
		funnel = await getFunnelById(funnelId);
	}

	const where = _getMarketStrategyWhere(body, funnel);

	let marketStrategies = await dbClient.marketStrategy.findMany({
		where,
		include: {
			merchant: true,
			strategy: {
				select: {
					id: true,
					executionType: true,
					platform: true,
					labels: true,
					strategyStatistics: true,
					strategyStatistics1m: true,
					strategyStatistics3m: true,
					strategyStatistics6m: true,
					strategyStatistics1y: true,
					strategyFollowers: {
						where: {
							createdAt: {
								...(timeRange && {
									gte: dayjs().subtract(TIME_RANGE_MAP[timeRange], "month").toDate(),
								}),
							},
						},
						select: { followerId: true, createdAt: true },
					},
				},
			},
			marketStrategyMetrics: {
				where: {
					timeRange: timeRange ?? "1M",
				},
				select: {
					livetestResults: true,
				},
				orderBy: [{ quoteOrder: "asc" }, { createdAt: "desc" }],
				take: 1,
			},
		},
	});

	marketStrategies = marketStrategies.map((marketStrategy) => {
		return {
			...marketStrategy,
			strategy: {
				...marketStrategy.strategy,
				_count: {
					strategyFollowers: marketStrategy.strategy.strategyFollowers.length,
				},
			},
			merchant: omit(marketStrategy.merchant, ["name", "surname", "email", "phoneNumber"]),
		};
	});

	const orderByKeys = Object.keys(body.orderBy ?? {});

	for (let i = 0; i < orderByKeys.length; i++) {
		const key = orderByKeys[i];
		marketStrategies = _orderBy(key, body.orderBy[key], timeRange, marketStrategies);
	}

	const { skip, take } = getPaginationQuery(pageNumber, pageSize);

	marketStrategies = await marketStrategies.slice(skip, skip + take);

	ctx.body.data = { marketStrategies };
	ctx.status = 200;

	return next();
}

async function getMarketStrategy(ctx, next) {
	const { id } = ctx.request.params;

	let marketStrategy = await getMarketStrategyById(id);

	if (!marketStrategy) {
		setError(ctx, 404, "MARKET_STRATEGY_NOT_FOUND");
		return;
	}

	marketStrategy = {
		...marketStrategy,
		merchant: omit(marketStrategy.merchant, ["name", "surname", "email", "phoneNumber"]),
	};

	ctx.body.data = { marketStrategy };
	ctx.status = 200;

	return next();
}

async function upsertMarketStrategy(ctx, next) {
	let body = Joi.attempt(ctx.request.body, MarketStrategy);

	const userId = ctx.request.auth.userId;
	const MIN_PRICE = 0;
	const MAX_PRICE = 0.07;

	const strategy = await dbClient.strategy.findFirst({
		where: {
			id: BigInt(body.strategyId),
		},
		select: {
			id: true,
			tradeSettings: true,
		},
	});

	if (!strategy) {
		setError(ctx, 403, "STRATEGY_NOT_FOUND");
		return next();
	}

	if (parseFloat(body.pricing?.price) <= MIN_PRICE || parseFloat(body.pricing?.price) > MAX_PRICE) {
		setError(ctx, 403, "PRICE_MUST_BE_IN_RANGE");
		return next();
	}

	body = {
		...body,
		pricing: {
			type: "profitShare",
			...body?.pricing,
		},
	};

	const merchant = await dbClient.merchant.findFirst({
		where: {
			userId,
		},
		select: {
			id: true,
		},
	});

	if (!merchant) {
		setError(ctx, 403, "MERCHANT_NOT_FOUND");
		return next();
	}

	const beforeUpdateMarketStrategy = await dbClient.marketStrategy.findUnique({
		where: {
			strategyId: BigInt(body.strategyId),
		},
	});

	body.merchantId = parseInt(merchant.id);
	body.strategyId = BigInt(body.strategyId);
	body.status =
		beforeUpdateMarketStrategy?.status === STATUS_TYPES.MAINTENANCE
			? STATUS_TYPES.MAINTENANCE
			: STATUS_TYPES.ACCEPTED;

	let marketStrategy;
	try {
		marketStrategy = await dbClient.marketStrategy.upsert({
			where: {
				strategyId: BigInt(body.strategyId),
			},
			update: body,
			create: {
				...body,
				createdBy: userId,
			},
		});
	} catch (error) {
		if (error.stack && error.stack.includes("Unique constraint failed")) {
			setError(ctx, 403, "MARKET_STRATEGY_NAME_ALREADY_EXISTS");
			return next();
		}

		setError(ctx, 403, "MARKET_STRATEGY_CREATION_FAILED");
		return next();
	}

	if (!beforeUpdateMarketStrategy) {
		const notificationData = {
			to: userId,
			content: {
				title: NOTIFICATION_TITLES.NEW_STRATEGY_MARKETPLACE,
				params: {},
			},
			info: {
				reason: "marketing",
				notificationType: "Marketing",
				triggeredBy: "System",
			},
			sendingType: "singleNotification",
			data: { status: "New" },
			expireAt: dayjs().add(7, "day").toDate(),
			saveToDatabase: true,
		};

		const responseData = await _sendNotifications(notificationData);
	}

	if (beforeUpdateMarketStrategy?.status !== STATUS_TYPES.MAINTENANCE) {
		await dbClient.strategy.update({
			where: { id: BigInt(body.strategyId) },
			data: {
				public: 1,
			},
		});

		const strategyFollowerSchema = {
			strategyId: marketStrategy.strategyId,
			followerId: process.env.ZERO_VALUE_USER_ID,
			positionSettings: strategy.tradeSettings,
			budgetSettings: [],
			blacklist: {},
			virtual: true,
			status: STATUS_TYPES.ON,
		};

		await createStrategyFollower(strategyFollowerSchema, userId);
	}

	await removeByPrefix("/market-strategies");
	await getMarketStrategyById.delete(marketStrategy?.id);

	ctx.body.data = { marketStrategy };
	ctx.status = 200;

	return next();
}

async function postMarketStrategyStatus(ctx, next) {
	const params = ctx.request.params;
	const body = Joi.attempt(ctx.request.body, MarketStrategyStatus);

	const marketStrategy = await dbClient.marketStrategy.update({
		where: {
			id: parseInt(params.id),
		},
		data: {
			...body,
		},
	});

	if (!marketStrategy) {
		setError(ctx, 404, "MARKET_STRATEGY_NOT_FOUND");
		return next();
	}

	if (marketStrategy.status === STATUS_TYPES.MAINTENANCE || marketStrategy.status === STATUS_TYPES.ACCEPTED) {
		const status = marketStrategy.status === STATUS_TYPES.MAINTENANCE ? STATUS_TYPES.STANDBY : STATUS_TYPES.ON;

		await dbClient.strategy.update({
			where: {
				id: BigInt(marketStrategy.strategyId),
			},
			data: {
				status,
			},
		});

		await dbClient.strategyFollower.updateMany({
			where: {
				strategyId: BigInt(marketStrategy.strategyId),
				followerId: process.env.ZERO_VALUE_USER_ID,
			},
			data: {
				status,
			},
		});
	}

	await removeByPrefix("/market-strategies");
	await getMarketStrategyById.delete(marketStrategy?.id);

	ctx.body.data = { marketStrategy };
	ctx.status = 200;
	return next();
}

async function postMarketStrategyFollow(ctx, next) {
	const params = ctx.request.params;

	const userId = ctx.request.auth.userId;

	const marketStrategy = await dbClient.marketStrategy.findUnique({
		where: {
			id: parseInt(params.id),
		},
		include: {
			strategy: true,
			merchant: true,
		},
	});

	if (!marketStrategy) {
		setError(ctx, 404, "MARKET_STRATEGY_NOT_FOUND");
		return;
	}

	const strategy = await dbClient.strategy.findUnique({
		where: {
			id: BigInt(marketStrategy.strategyId),
		},
	});

	const followerLimitControlData = await getFollowerLimitControlResult(marketStrategy, strategy, userId);

	if (followerLimitControlData) {
		setError(ctx, followerLimitControlData.code, followerLimitControlData.text);
		return;
	}

	let pricingInfo;
	const user = await dbClient.user.findUnique({
		where: { id: userId },
		include: {
			usedReferenceCode: true,
		},
	});

	if (!user.usedReferenceCodeId) {
		//Case4:  Market Strateji Takip Eden Bir Kullanıcı - reference yok

		const params = {
			user,
			marketStrategy,
			type: "Case4",
		};

		pricingInfo = preparePricingInfo(params);
	}

	if (user.usedReferenceCodeId) {
		const referenceCode = await dbClient.referenceCode.findUnique({
			where: { id: user.usedReferenceCodeId },
		});

		const inviterUser = await dbClient.user.findFirst({
			where: {
				id: referenceCode.ownerId,
			},
			include: {
				usedReferenceCode: true,
			},
		});

		if (!inviterUser.usedReferenceCodeId) {
			//Case5: Market Strateji Takip Eden + Referans ile Kaydolmuş Bir Kullanıcı  + refere eden kişi reference olmadan kaydolmuş
			const params = {
				user,
				marketStrategy,
				inviterUser,
				type: "Case5",
			};

			pricingInfo = preparePricingInfo(params);
		}

		if (inviterUser.usedReferenceCodeId) {
			//	Case6: Market Strateji Takip Eden + Referans ile Kaydolmuş Bir Kullanıcı + Referans Eden de Referans ile Kaydolmuş Bir Kullanıcı

			const inviterReferenceCode = await dbClient.referenceCode.findUnique({
				where: { id: inviterUser.usedReferenceCodeId },
			});

			const contractorUser = await dbClient.user.findUnique({
				where: {
					id: inviterReferenceCode.ownerId,
				},
				include: {
					usedReferenceCode: true,
				},
			});

			const params = {
				user,
				marketStrategy,
				contractorUser,
				inviterUser,
				type: "Case6",
			};

			pricingInfo = preparePricingInfo(params);
		}
	}

	if (strategy.platformId === BITMEX_PLATFORM_ID) {
		pricingInfo = omit(pricingInfo, ["systemProfit", "systemVolume"]);
	}

	const strategyFollower = await createStrategyFollower(
		{
			strategyId: marketStrategy.strategyId,
			followerId: userId,
			positionSettings: marketStrategy.strategy.tradeSettings,
			budgetSettings: [],
			pricingInfo,
			blacklist: {},
			virtual: false,
			status: STATUS_TYPES.ON,
		},
		userId
	);

	const marketStrategyFollowerCount = await dbClient.marketStrategy.update({
		where: {
			strategyId: marketStrategy.strategyId,
		},
		data: {
			followerCount: { increment: 1 },
		},
	});

	ctx.body.data = { strategyFollower };
	ctx.status = 200;
	return next();
}

async function getMarketStrategiesCount(ctx, next) {
	const body = Joi.attempt(ctx.request.body, getMarketStrategiesSchema);

	const { funnelId } = body.where;

	let funnel;

	if (funnelId) {
		funnel = await getFunnelById(funnelId);
	}

	const marketStrategiesCount = await getMarketStrategiesCountService({ body, funnel });

	ctx.body.data = { marketStrategiesCount };
	ctx.status = 200;

	return next();
}

router.post("/market-strategies", rateLimit("/market-strategies"), getMarketStrategies);
router.post("/market-strategies/count", rateLimit("/positions/count"), getMarketStrategiesCount);
router.get("/market-strategy/:id", rateLimit("/market-strategy/id"), getMarketStrategy);
router.post("/market-strategy/:id/follow", rateLimit("/market-strategy/id/follow"), postMarketStrategyFollow);
router.post("/market-strategy", rateLimit("/market-strategy"), upsertMarketStrategy);
router.post("/market-strategy/:id/status", rateLimit("/market-strategy/id/status"), postMarketStrategyStatus);

module.exports = router;
