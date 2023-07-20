const Router = require("koa-router");
const { dbClient } = require("@paratica/common/prisma");
const Joi = require("joi");
const { omit } = require("lodash");

const { setError } = require("@backend/common/utils");
const { normalize } = require("@backend/common/functions/tradeSettings");

const rateLimit = require("@backend/common/middlewares/rateLimit");

const FOLLOW_STATUS = {
	ON: "ON",
	OFF: "OFF",
	STANDBY: "STANDBY",
	UNFOLLOWED: "UNFOLLOWED",
};

const STATUS_TYPES = {
	OPEN: "OPEN",
	CLOSED: "CLOSED",
};

async function followedStrategies(ctx, next) {
	const userId = ctx.request.auth.userId;
	const { strategyId } = ctx.request.query;

	let followedStrategies = await dbClient.strategyFollower.findMany({
		where: {
			follower: { id: userId },
			status: { not: FOLLOW_STATUS.UNFOLLOWED },
			...(strategyId && { strategy: { id: parseInt(strategyId) } }),
		},
		select: {
			strategy: {
				select: {
					id: true,
					name: true,
					tradeSettings: true,
					executionType: true,
					labels: true,
					createdAt: true,
					strategyTypeId: true,
					public: true,
					platform: {
						select: {
							id: true,
							name: true,
							info: true,
							exchange: true,
						},
					},
					user: {
						select: {
							id: true,
							name: true,
						},
					},
					strategyStatistics: true,
					strategyStatistics1m: true,
					strategyStatistics3m: true,
					strategyStatistics6m: true,
					strategyStatistics1y: true,
					parities: true,
					marketStrategy: {
						select: {
							id: true,
							name: true,
							merchant: {
								select: {
									id: true,
									name: true,
									nickname: true,
								},
							},
						},
					},
				},
			},
			strategyFollowerStatistics: true,
			status: true,
			blacklist: true,
			virtual: true,
			reflect: true,
			budgetSettings: true,
			positionSettings: true,
			createdAt: true,
			updatedAt: true,
		},
		orderBy: {
			updatedAt: "desc",
		},
	});

	ctx.body.data = { followedStrategies };
	ctx.status = 200;

	return next();
}

async function unfollowedStrategies(ctx, next) {
	const userId = ctx.request.auth.userId;
	const { strategyId } = ctx.request.query;

	let followedStrategies = await dbClient.strategyFollower.findMany({
		where: {
			deletedAt: null,
			follower: { id: userId },
			status: FOLLOW_STATUS.UNFOLLOWED,
			...(strategyId && { strategy: { id: parseInt(strategyId) } }),
		},
		select: {
			strategy: {
				select: {
					id: true,
					name: true,
					tradeSettings: true,
					executionType: true,
					labels: true,
					createdAt: true,
					platform: {
						select: {
							name: true,
							info: true,
							exchange: true,
						},
					},
					user: {
						select: {
							name: true,
						},
					},
					strategyStatistics: true,
					parities: true,
					marketStrategy: {
						select: {
							name: true,
							merchant: {
								select: {
									id: true,
									name: true,
									nickname: true,
								},
							},
						},
					},
				},
			},
			strategyFollowerStatistics: true,
			status: true,
			blacklist: true,
			virtual: true,
			budgetSettings: true,
			positionSettings: true,
			createdAt: true,
			updatedAt: true,
		},
		orderBy: {
			updatedAt: "desc",
		},
	});

	ctx.body.data = { followedStrategies };
	ctx.status = 200;

	return next();
}

const followedStrategyStatusSchema = Joi.object({
	strategyId: Joi.string().required(),
	status: Joi.string()
		.required()
		.allow(...Object.values(FOLLOW_STATUS)),
}).error(new Joi.ValidationError(`followedStrategyStatusSchema type error`));

async function followedStrategyStatus(ctx, next) {
	const body = Joi.attempt(Object.assign(ctx.request.body, ctx.request.params), followedStrategyStatusSchema);
	const userId = ctx.request.auth.userId;

	const followedStrategy = await dbClient.strategyFollower.update({
		where: {
			strategyId_followerId: {
				strategyId: BigInt(body.strategyId),
				followerId: userId,
			},
		},
		data: {
			status: body.status,
		},
	});

	if (!followedStrategy) {
		setError(ctx, 404, "FOLLOWED_STRATEGY_NOT_FOUND");
		return;
	}

	if (body.status === FOLLOW_STATUS.UNFOLLOWED) {
		const marketStrategyFollowerCount = await dbClient.marketStrategy.update({
			where: {
				strategyId: BigInt(body.strategyId),
			},
			data: {
				followerCount: { increment: -1 },
			},
		});
	}

	await dbClient.strategy.updateMany({
		where: {
			id: BigInt(body.strategyId),
			public: 0,
		},
		data: {
			status: body.status,
		},
	});

	ctx.body.data = { status: body.status };
	ctx.status = 200;

	return next();
}

const StrategyFollowerUpdate = Joi.object({
	strategyId: Joi.string().required(),
	status: Joi.string()
		.optional()
		.allow(...Object.values(FOLLOW_STATUS)),
	virtual: Joi.boolean().optional(),
	budgetSettings: Joi.array()
		.items(
			Joi.object({
				quote: Joi.string().required(),
				amount: Joi.number().required(),
				maximumPositionCount: Joi.number().required(),
				positionBudget: Joi.number().required(),
				leverage: Joi.number().optional(),
			})
		)
		.optional(),
}).error(new Joi.ValidationError(`StrategyFollowerUpdate type error`));

async function updateStrategyFollowers(ctx, next) {
	const body = Joi.attempt({ ...ctx.request.body, ...ctx.request.params }, StrategyFollowerUpdate);

	const { userId } = ctx.request.auth;

	const strategyFollowers = await dbClient.strategyFollower.updateMany({
		where: {
			follower: { id: userId },
			strategy: { id: BigInt(body.strategyId) },
		},
		data: {
			...omit(body, "strategyId"),
		},
	});

	await dbClient.strategy.updateMany({
		where: {
			id: BigInt(body.strategyId),
			public: 0,
		},
		data: {
			status: body.status,
		},
	});

	ctx.body.data = { strategyFollowers };
	ctx.status = 200;

	return next();
}

const createStrategyFollowerSchema = Joi.object({
	strategyId: Joi.string().required(),
	positionSettings: Joi.object().optional(),
	budgetSettings: Joi.object().optional(),
	blacklist: Joi.object().optional(),
	virtual: Joi.boolean().optional(),
	status: Joi.string()
		.required()
		.allow(...Object.values(FOLLOW_STATUS)),
	reflect: Joi.boolean().optional(),
}).error((e) => {
	console.log(e);
	return new Joi.ValidationError(` Strategy follower create error`);
});

async function createStrategyFollower(ctx, next) {
	const body = Joi.attempt({ ...ctx.request.body, ...ctx.request.params }, createStrategyFollowerSchema);
	const { userId } = ctx.request.auth;

	const strategy = await dbClient.strategy.findUnique({
		where: {
			id: BigInt(body.strategyId),
		},
	});

	if (!strategy) {
		setError(ctx, 409, "STRATEGY_NOT_FOUND");
		return next();
	}

	const user = await dbClient.user.findUnique({
		where: {
			id: userId,
		},
	});

	//Case 1: Kendi Stratejisini Kullanan Bir Kullanıcı

	let pricingInfo;

	pricingInfo = {
		systemVolume: {
			to: "system",
			ratio: user.baseFees.volumeFee,
			onProfit: false,
			onBuy: true,
			onSell: true,
			amountType: "volume",
		},
	};

	const strategyFollower = await dbClient.strategyFollower.create({
		data: {
			...omit(body, "strategyId"),
			follower: {
				connect: {
					id: userId,
				},
			},
			strategy: {
				connect: {
					id: BigInt(body.strategyId),
				},
			},
			positionSettings: strategy?.tradeSettings,
			...(pricingInfo && { pricingInfo }),
			createdBy: userId,
		},
	});

	if (strategy.public) {
		await dbClient.marketStrategy.update({
			where: {
				strategyId: BigInt(body.strategyId),
			},
			data: {
				followerCount: { increment: 1 },
			},
		});
	}

	await dbClient.strategy.updateMany({
		where: {
			id: BigInt(strategy.id),
			public: 0,
		},
		data: {
			status: body.status,
		},
	});

	ctx.body.data = { strategyFollower };
	ctx.status = 200;
}

const strategyFollowerBudgetSchema = Joi.object({
	strategyId: Joi.string().required(),
	budget: Joi.array().items(
		Joi.object({
			quote: Joi.string().required(),
			amount: Joi.number().required(),
			maximumPositionCount: Joi.number().required(),
			positionBudget: Joi.number().required(),
			leverage: Joi.number().required(),
		})
	),
}).error(new Joi.ValidationError(`strategyFollowerBudgetSchema type error`)); //TODO need to better error message

async function strategyFollowerBudget(ctx, next) {
	const body = Joi.attempt(Object.assign(ctx.request.body, ctx.request.params), strategyFollowerBudgetSchema);
	const userId = ctx.request.auth.userId;

	const followedStrategies = await dbClient.strategyFollower.updateMany({
		where: {
			follower: { id: userId },
			strategy: { id: BigInt(body.strategyId) },
		},
		data: {
			budgetSettings: body.budget,
		},
	});

	if (followedStrategies.count === 0) {
		setError(ctx, 404, "FOLLOWED_STRATEGY_NOT_FOUND");
		return;
	}

	ctx.body.data = { budget: body.budget };
	ctx.status = 200;

	return next();
}

const strategyFollowerblacklistSchema = Joi.object({
	strategyId: Joi.string().required(),
	blacklist: Joi.object({
		quotes: Joi.array().required(),
		symbols: Joi.array().required(),
	}),
}).error(new Joi.ValidationError(`strategyFollowerblacklistSchema type error`)); //TODO need to better error message

async function strategyFollowerblacklist(ctx, next) {
	const body = Joi.attempt(
		Object.assign({ blacklist: ctx.request.body }, ctx.request.params),
		strategyFollowerblacklistSchema
	);
	const userId = ctx.request.auth.userId;

	const followedStrategies = await dbClient.strategyFollower.updateMany({
		where: {
			follower: { id: userId },
			strategy: { id: BigInt(body.strategyId) },
		},
		data: {
			blacklist: body.blacklist,
		},
	});

	if (followedStrategies.count === 0) {
		setError(ctx, 404, "FOLLOWED_STRATEGY_NOT_FOUND");
		return;
	}

	ctx.body.data = body.blacklist;
	ctx.status = 200;

	return next();
}
const positionSettingsSchema = Joi.object({
	positionSettings: Joi.object({
		stopLoss: Joi.object().optional(),
		takeProfit: Joi.object().optional(),
		trailingStop: Joi.object().optional(),
		leverage: Joi.number().optional(),
		minTradeDuration: Joi.object().optional(),
		maxTradeDuration: Joi.object().optional(),
		newPositionDuration: Joi.object().optional(),
	}).required(),
	reflect: Joi.boolean().optional(),
}).error(new Joi.ValidationError(`positionSettingsSchema type error`)); //TODO need to better error message

async function updatePositionSettings(ctx, next) {
	const params = ctx.request.params;
	let body = Joi.attempt(ctx.request.body, positionSettingsSchema);
	const userId = ctx.request.auth.userId;

	const strategyFollower = await dbClient.strategyFollower.findUnique({
		where: {
			strategyId_followerId: {
				strategyId: BigInt(params.strategyId),
				followerId: userId,
			},
		},
	});

	try {
		body.positionSettings = {
			...strategyFollower?.positionSettings,
			...normalize(body.positionSettings),
		};

		await dbClient.strategyFollower.update({
			where: {
				strategyId_followerId: {
					strategyId: BigInt(params.strategyId),
					followerId: userId,
				},
			},
			data: {
				...body,
			},
		});

		ctx.body.data = body.positionSettings;
		ctx.status = 200;
	} catch (error) {
		console.log(error);

		ctx.status = 404;
	}

	return next();
}

async function getStrategyFollower(ctx, next) {
	const { userId } = ctx.request.auth;
	const { strategyId } = ctx.request.params;

	const strategyFollowers = await dbClient.strategyFollower.findMany({
		where: {
			deletedAt: null,
			follower: { id: userId },
			strategy: { id: BigInt(strategyId) },
		},
	});

	ctx.body.data = { strategyFollower: strategyFollowers?.length ? strategyFollowers[0] : null };
	ctx.status = 200;

	return next();
}

const router = Router();

router.get("/strategies/followed", rateLimit("/strategies/followed"), followedStrategies);
router.get("/strategies/unfollowed", rateLimit("/strategies/unfollowed"), unfollowedStrategies);
router.get("/strategy-follower/:strategyId", rateLimit("/strategy-follower/strategyId"), getStrategyFollower);
router.put("/strategy-followers/:strategyId", rateLimit("/strategy-followers/strategyId"), updateStrategyFollowers);
router.post("/strategy-follower", rateLimit("/strategy-follower"), createStrategyFollower);

router.put(
	"/strategy/:strategyId/followed/status",
	rateLimit("/strategy/strategyId/followed/status"),
	followedStrategyStatus
);
router.post(
	"/strategy/:strategyId/followed/budget",
	rateLimit("/strategy/strategyId/followed/budget"),
	strategyFollowerBudget
);
router.post(
	"/strategy/:strategyId/followed/blacklist",
	rateLimit("/strategy/strategyId/followed/blacklist"),
	strategyFollowerblacklist
);
router.patch(
	"/strategy/:strategyId/followed/position-settings",
	rateLimit("/strategy/strategyId/followed/position-settings"),
	updatePositionSettings
);

module.exports = router;
