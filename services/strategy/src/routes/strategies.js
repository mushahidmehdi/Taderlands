const Prisma = require("@prisma/client");
const Router = require("koa-router");
const Joi = require("joi");
const { omit } = require("lodash");
const { v4: uuidv4 } = require("uuid");

const { dbClient } = require("@paratica/common/prisma");

const { setError } = require("@backend/common/utils");
const { normalize } = require("@backend/common/functions/tradeSettings");

const { LABEL_MAP } = require("../constants/labelMap");
const rateLimit = require("@backend/common/middlewares/rateLimit");

const STATUS_TYPES = ["ON", "OFF", "STAND_BY"];

// middleware to control parity count
async function controlParityCount(ctx, next) {
	const { userId } = ctx.request.auth;

	if (!ctx.request.body?.parities) {
		return next();
	}

	const { symbols } = ctx.request.body?.parities;

	if (!symbols?.length) {
		return next();
	}

	const user = await dbClient.user.findUnique({
		where: {
			id: userId,
		},
	});

	const maxParityConfig = await dbClient.config.findFirst({
		where: {
			title: "MAX_PARITY_COUNT",
		},
	});

	const maxParityCount = maxParityConfig.data?.[user.role ?? "common"];

	const ownedStrategies = await dbClient.strategy.findMany({
		where: {
			user: {
				id: userId,
			},
			...(ctx.request?.params?.id && { NOT: { id: BigInt(ctx.request.params?.id) } }),
		},
	});

	let allParities = symbols;

	ownedStrategies.forEach((x) => {
		allParities = [...allParities, ...(x.parities?.symbols ?? [])];
	});

	if (allParities.length > maxParityCount) {
		setError(ctx, 404, "MAX_PARITY_COUNT_REACHED");
		return;
	}

	await dbClient.user.update({
		where: {
			id: userId,
		},
		data: {
			paritiesCount: allParities.length,
		},
	});

	return await next();
}

async function resetUserParitiesCount(ctx, next) {
	const users = await dbClient.user.findMany({
		where: {
			deviceInfo: {
				path: ["lastLoginIp"],
				gt: 0,
			},
		},
	});

	users.forEach(async (user) => {
		const ownedStrategies = await dbClient.strategy.findMany({
			where: {
				user: {
					id: user.id,
				},
			},
		});

		let allParities = [];

		ownedStrategies.forEach((x) => {
			allParities = [...allParities, ...(x.parities?.symbols ?? [])];
		});

		if (allParities > 0) {
			await dbClient.user.update({
				where: {
					id: user.id,
				},
				data: {
					paritiesCount: allParities.length,
				},
			});
		}
	});

	ctx.status = 200;
	return next();
}

async function getStrategies(ctx, next) {
	const userId = ctx.request.auth.userId;

	let strategies = await dbClient.strategy.findMany({
		where: {
			deletedAt: null,
			ownerId: userId,
		},
		include: {
			platform: true,
			strategySuccesses: true,
			marketStrategy: true,
		},
	});

	ctx.body.data = { strategies };
	ctx.status = 200;

	return next();
}

async function getStrategy(ctx, next) {
	const { userId } = ctx.request.auth;
	const { id } = ctx.request.params;
	const { checkUser, openPositionsCount } = ctx.query;

	const strategies = await dbClient.strategy.findMany({
		where: {
			id: parseInt(id),
			...(checkUser
				? {
						user: {
							id: userId,
						},
				  }
				: {}),
		},
		include: {
			platform: true,
			ruleDesignEnter: true,
			ruleDesignExit: true,
		},
	});

	let count;

	if (openPositionsCount) {
		count = await dbClient.position.count({
			where: {
				signal: {
					is: {
						strategyId: parseInt(id),
					},
				},
				status: "OPEN",
			},
		});
	}

	ctx.body.data = {
		strategy: {
			...(strategies?.length ? strategies[0] : {}),
			...(openPositionsCount ? { openPositionsCount: count } : {}),
		},
	};
	ctx.status = 200;

	return next();
}

const Strategy = Joi.object({
	id: Joi.number().optional(),
	name: Joi.string().optional(),
	platformId: Joi.number().required(),
	parities: Joi.object({
		quotes: Joi.array().items().optional(),
		symbols: Joi.array().items().optional(),
	}).optional(),
	strategyTypeId: Joi.number().required(),
	tradeTypeId: Joi.number().required(),
	tradeSettings: Joi.object(),
	executionType: Joi.string().optional(),
	ruleDesignEnterId: Joi.number().required(),
	ruleDesignExitId: Joi.number().optional(),
	status: Joi.string()
		.optional()
		.valid(...STATUS_TYPES),
	isControlling: Joi.boolean().optional(),
	commercialSettings: Joi.object().optional(),
	labels: Joi.array().items().optional(),
	public: Joi.number().required(),
}).error(new Joi.ValidationError(`Strategy schema type error`));

const StrategyUpdate = Joi.object({
	id: Joi.number().required(),
	name: Joi.string().optional(),
	platformId: Joi.number().optional(),
	parities: Joi.object({
		quotes: Joi.array().items().optional(),
		symbols: Joi.array().items().optional(),
	}).optional(),
	strategyTypeId: Joi.number().optional(),
	tradeTypeId: Joi.number().optional(),
	tradeSettings: Joi.object().optional(),
	executionType: Joi.string().optional(),
	ruleDesignEnterId: Joi.number().optional(),
	ruleDesignExitId: Joi.number().optional(),
	status: Joi.string()
		.optional()
		.valid(...STATUS_TYPES),
	isControlling: Joi.boolean().optional(),
	commercialSettings: Joi.object().optional(),
	labels: Joi.array().items().optional(),
	public: Joi.number().optional(),
}).error(new Joi.ValidationError(`Update strategy validation error.`));

async function updateStrategy(ctx, next) {
	const body = Joi.attempt({ ...ctx.request.params, ...ctx.request.body }, StrategyUpdate);

	const previousStrategy = await dbClient.strategy.findUnique({
		where: {
			id: BigInt(body.id),
		},
	});

	body.labels = previousStrategy.labels;

	if (body.id && body.tradeSettings) {
		body.labels = Object.keys(body.tradeSettings)
			.filter((key) => body.tradeSettings[key].enabled && LABEL_MAP[key])
			.map((x) => LABEL_MAP[x]);

		body.tradeSettings = normalize(body.tradeSettings);

		await dbClient.strategyFollower.updateMany({
			where: {
				reflect: true,
				strategyId: BigInt(body.id),
			},
			data: {
				positionSettings: body.tradeSettings,
			},
		});
	}

	if (body.executionType === "SPOT") {
		body = {
			...body,
			tradeSettings: {
				...body.tradeSettings,
				leverage: 1,
			},
		};
	}

	if (
		(body.ruleDesignExitId && body.ruleDesignExitId !== 2) ||
		(previousStrategy?.ruleDesignExitId && previousStrategy?.ruleDesignExitId !== 2n && body.ruleDesignExitId !== 2)
	) {
		if (!body.labels.includes(LABEL_MAP.strategyExit)) {
			body.labels = [...body.labels, LABEL_MAP.strategyExit];
		}
	} else {
		body.labels = (body?.labels ?? []).filter((x) => x !== LABEL_MAP.strategyExit);
	}

	const strategy = await dbClient.strategy.update({
		where: {
			id: BigInt(body.id),
		},
		data: body,
	});

	ctx.body.data = { strategy };
	ctx.status = 200;

	return next();
}

async function createStrategy(ctx, next) {
	let body = Joi.attempt(ctx.request.body, Strategy);

	const userId = ctx.request.auth.userId;

	if (body.tradeSettings) {
		body.labels = Object.keys(body.tradeSettings)
			.filter((key) => body.tradeSettings[key].enabled && LABEL_MAP[key])
			.map((x) => LABEL_MAP[x]);

		body.tradeSettings = normalize(body.tradeSettings);
	}

	if (body.executionType === "SPOT") {
		body = {
			...body,
			tradeSettings: {
				...body.tradeSettings,
				leverage: 1,
			},
		};
	}

	// if strategy is to be used using tradingview, then generate a uuid
	if (body?.strategyTypeId === 2) {
		body.webhookToken = uuidv4();
	}

	const strategy = await dbClient.strategy.create({
		data: {
			...omit(body, ["platformId", "tradeTypeId", "strategyTypeId", "ruleDesignEnterId"]),
			platform: {
				connect: {
					id: parseInt(body.platformId),
				},
			},
			tradeType: {
				connect: {
					id: parseInt(body.tradeTypeId),
				},
			},
			strategyType: {
				connect: {
					id: parseInt(body.strategyTypeId),
				},
			},
			ruleDesignEnter: {
				connect: {
					id: BigInt(body.ruleDesignEnterId),
				},
			},
			user: {
				connect: {
					id: userId,
				},
			},
			createdBy: userId,
		},
		include: {
			platform: true,
		},
	});

	ctx.body.data = { strategy };
	ctx.status = 200;

	return next();
}

async function deleteStrategy(ctx, next) {
	const { id } = ctx.request.params;
	const ownerId = ctx.request.auth.userId;

	const strategy = await dbClient.strategy.updateMany({
		where: {
			ownerId,
			public: parseInt(0),
			id: BigInt(id),
		},
		data: {
			deletedAt: new Date(),
		},
	});

	let strategySuccesses;
	let strategyFollowers;
	let positions;
	let signals;

	if (strategy.count > 0) {
		strategySuccesses = await dbClient.strategySuccess.updateMany({
			where: {
				strategyId: BigInt(id),
			},
			data: {
				deletedAt: new Date(),
			},
		});

		strategyFollowers = await dbClient.strategyFollower.updateMany({
			where: {
				strategyId: BigInt(id),
			},
			data: {
				deletedAt: new Date(),
			},
		});

		positions = await dbClient.position.updateMany({
			where: {
				signal: {
					strategyId: BigInt(id),
				},
			},
			data: {
				deletedAt: new Date(),
			},
		});

		signals = await dbClient.signal.updateMany({
			where: {
				strategyId: BigInt(id),
			},
			data: {
				deletedAt: new Date(),
			},
		});
	}

	ctx.body.data = { strategy, strategySuccesses, strategyFollowers, positions, signals };
	ctx.status = 200;
	return next();
}

const StrategyDuplicate = Joi.object({
	id: Joi.number().required(),
	platformId: Joi.number().required(),
}).error(new Joi.ValidationError(`Duplicate strategy validation error.`));

async function duplicateStrategy(ctx, next) {
	const body = Joi.attempt({ ...ctx.request.params, ...ctx.request.body }, StrategyDuplicate);

	const { id, platformId } = body;
	const userId = ctx.request.auth.userId;

	const strategy = await dbClient.strategy.findFirst({
		where: {
			id: BigInt(id),
			ownerId: userId,
		},
	});

	if (!strategy) {
		setError(ctx, 404, "STRATEGY_NOT_FOUND");
		return next();
	}

	const newStrategyData = {
		name: `${strategy.name} (copy)`,
		labels: [],
		parities: {},
		commercialSettings: strategy.commercialSettings,
		executionType: strategy.executionType,
		tradeSettings: strategy.tradeSettings,
	};

	const newStrategy = await dbClient.strategy.create({
		data: {
			...newStrategyData,
			platform: {
				connect: {
					id: parseInt(platformId),
				},
			},
			tradeType: {
				connect: {
					id: strategy.tradeTypeId,
				},
			},
			strategyType: {
				connect: {
					id: strategy.strategyTypeId,
				},
			},
			...(strategy.ruleDesignEnterId && {
				ruleDesignEnter: {
					connect: {
						id: strategy.ruleDesignEnterId,
					},
				},
			}),
			...(strategy.ruleDesignExitId && {
				ruleDesignExit: {
					connect: {
						id: strategy.ruleDesignExitId,
					},
				},
			}),
			user: {
				connect: {
					id: userId,
				},
			},
			createdBy: userId,
		},
	});

	ctx.body.data = { newStrategy };
	ctx.status = 200;

	return next();
}

const router = Router();

router.get("/resetUserParitiesCount", resetUserParitiesCount);
router.get("/strategies", rateLimit("/strategies"), getStrategies);
router.get("/strategy/:id", rateLimit("/strategy/id/get"), getStrategy);
router.put("/strategy/:id", rateLimit("/strategy/id/put"), controlParityCount, updateStrategy);
router.post("/strategy", rateLimit("/strategy"), controlParityCount, createStrategy);
router.patch("/strategy/:id/delete", rateLimit("/strategy/id/delete"), deleteStrategy);
router.post("/strategy/:id/duplicate", rateLimit("/strategy/id/duplicate"), duplicateStrategy);

module.exports = router;
