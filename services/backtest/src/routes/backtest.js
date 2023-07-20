const Router = require("koa-router");
const router = Router();
const Joi = require("joi");

const dayjs = require("dayjs");
const { omit } = require("lodash");

const { dbClient } = require("@paratica/common/prisma");

const { setError } = require("@backend/common/utils");
const { mqConnectionEmitter, createChannelWrapper, publishMessage } = require("@backend/common/services/rabbitmq");
const { subscribe: subscribeCache, intervene: interveneWithCache } = require("@backend/common/middlewares/cache");
const rateLimit = require("@backend/common/middlewares/rateLimit");
const { getBacktestById } = require("../services/backtest");
const { getPaginationQuery } = require("@backend/common/utils");

mqConnectionEmitter.on("connected", () => {
	createChannelWrapper({
		name: "backtest",
		exchange: "backtest",
		queue: "backtest_queue_backtest",
		routingKey: "backtest.send",
	});
});

const Backtest = Joi.object({
	strategyId: Joi.number().required(),
	parityId: Joi.number().required(),
	enterRuleDesign: Joi.object().required(),
	exitRuleDesign: Joi.object().optional(),
	tradeSettings: Joi.object().optional(),
	executionType: Joi.string().required(),
	interval: Joi.string().required(),
	reason: Joi.string().optional(),
}).error(new Joi.ValidationError(`Backtest validation error`));

async function createBacktest(ctx, next) {
	const body = Joi.attempt(ctx.request.body, Backtest);
	const { userId } = ctx.request.auth;

	const strategy = await dbClient.strategy.findUnique({
		where: {
			id: body.strategyId,
		},
	});

	if (!strategy) {
		setError(ctx, 404, "STRATEGY_NOT_FOUND");
		return next();
	}

	const intervalMap = {
		"1 Week": [1, "w"],
		"1 Month": [1, "M"],
		"3 Months": [3, "M"],
		"6 Months": [6, "M"],
		"12 Months": [12, "M"],
	};

	const startDate = dayjs()
		.subtract(...intervalMap[body.interval])
		.format();

	const endDate = dayjs().format();

	let backtest;

	try {
		backtest = await dbClient.backtest.create({
			data: {
				...omit(body, ["strategyId", "parityId", "interval"]),
				startDate,
				endDate,
				status: "INITIAL",
				user: {
					connect: {
						id: userId,
					},
				},
				strategy: {
					connect: {
						id: body.strategyId,
					},
				},
				parity: {
					connect: {
						id: body.parityId,
					},
				},
			},
			include: {
				strategy: {
					select: {
						id: true,
						name: true,
						platform: true,
					},
				},
				parity: true,
			},
		});
	} catch (error) {
		ctx.status = 409;
		return;
	}

	await publishMessage("backtest", backtest);

	ctx.body = {
		data: {
			backtest,
		},
	};
	ctx.status = 200;

	return next();
}

const BacktestPosition = Joi.object({
	backtestId: Joi.number().required(),
	drawDownPrice: Joi.number().required(),
	drawUpPrice: Joi.number().required(),
	averageEnterPrice: Joi.number().required(),
	averageExitPrice: Joi.number().required(),
	drawDownPercent: Joi.number().required(),
	drawUpPercent: Joi.number().required(),
	enterDate: Joi.string().optional(),
	exitDate: Joi.string().optional(),
	exitSource: Joi.string().required(),
	profitPercent: Joi.number().required(),
	buyOrders: Joi.object().optional(),
	sellOrders: Joi.object().optional(),
}).error(new Joi.ValidationError(`Backtest position validation error`));

async function createBacktestPosition(ctx, next) {
	const body = Joi.attempt(ctx.request.body, BacktestPosition);

	const backtest = await getBacktestById(body?.backtestId);

	if (!backtest) {
		setError(ctx, 404, "BACKTEST_NOT_FOUND");
		return next();
	}

	let backtestPosition;

	try {
		backtestPosition = await dbClient.backtestPosition.create({
			data: {
				...omit(body, ["backtestId"]),
				enterDate: dayjs(body.enterDate).toDate(),
				exitDate: dayjs(body.exitDate).toDate(),
				backtest: {
					connect: {
						id: body.backtestId,
					},
				},
			},
		});
	} catch (error) {
		ctx.status = 409;
		return;
	}

	ctx.body = {
		data: {
			backtestPosition,
		},
	};
	ctx.status = 200;

	return next();
}

async function getBacktest(ctx, next) {
	const { id } = ctx.request.params;

	const backtest = await dbClient.backtest.findUnique({
		where: {
			id: parseInt(id),
		},
		include: {
			parity: true,
			strategy: true,
		},
	});

	ctx.body = {
		data: {
			backtest,
		},
	};
	ctx.status = 200;
	return next();
}

const BacktestQuery = Joi.object({
	strategyId: Joi.number().optional(),
	pageNumber: Joi.number().min(0).optional().default(0),
	pageSize: Joi.number().min(0).max(100).optional().default(100),
	reason: Joi.string().optional(),
}).error(new Joi.ValidationError(`Backtest query validation error`));

async function getBacktests(ctx, next) {
	const { userId } = ctx.request.auth;
	const { strategyId, reason, pageNumber, pageSize } = Joi.attempt(ctx.query, BacktestQuery);

	const backtests = await dbClient.backtest.findMany({
		where: {
			deletedAt: null,
			user: {
				id: userId,
			},
			...(strategyId && {
				strategy: {
					id: strategyId,
				},
			}),
			...(reason && {
				reason,
			}),
		},
		include: {
			parity: true,
			strategy: {
				select: {
					name: true,
					platform: true,
				},
			},
		},
		orderBy: {
			createdAt: "desc",
		},
		...getPaginationQuery(pageNumber, pageSize),
	});

	ctx.body = {
		data: {
			backtests,
		},
	};
	ctx.status = 200;
	return next();
}

async function getBacktestPositionsRoute(ctx, next) {
	const { id } = ctx.request.params;

	const backtest = await getBacktestById(id);

	if (!backtest) {
		setError(ctx, 404, "BACKTEST_NOT_FOUND");
		return next();
	}

	const backtestPositions = await dbClient.backtestPosition.findMany({
		where: {
			deletedAt: null,
			backtestId: parseInt(id),
		},
		orderBy: {
			exitDate: "desc",
		},
	});

	ctx.body = {
		data: {
			backtestPositions,
		},
	};
	ctx.status = 200;
	return next();
}

async function deleteBacktest(ctx, next) {
	const { id } = ctx.request.params;
	const { userId } = ctx.request.auth;

	const backtest = await dbClient.backtest.updateMany({
		where: {
			id: parseInt(id),
			userId,
		},
		data: {
			deletedAt: new Date(),
		},
	});

	let backtestPositions;

	if (backtest.count > 0) {
		backtestPositions = await dbClient.backtestPosition.updateMany({
			where: {
				backtestId: parseInt(id),
			},
			data: {
				deletedAt: new Date(),
			},
		});
	}

	ctx.body.data = { backtest, backtestPositions };
	ctx.status = 200;

	return next();
}

router.get("/backtest/:id", rateLimit("/backtest/id"), subscribeCache(5 * 60), interveneWithCache, getBacktest);
router.get(
	"/backtest/:id/positions",
	rateLimit("/backtest/id/positions"),
	subscribeCache(5 * 60),
	interveneWithCache,
	getBacktestPositionsRoute
);
router.get("/backtests", rateLimit("/backtests"), getBacktests);
router.post("/backtest", rateLimit("/backtest"), createBacktest);
router.post("/backtest-position", rateLimit("/backtest-position"), createBacktestPosition);
router.patch("/backtest/:id/delete", rateLimit("/backtest/id/delete"), deleteBacktest);
module.exports = router;
