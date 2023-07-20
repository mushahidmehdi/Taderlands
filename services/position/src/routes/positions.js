const Router = require("koa-router");
const Joi = require("joi");
const { uniqBy, orderBy } = require("lodash");
const CsvParser = require("json2csv").Parser;

const { dbClient } = require("@paratica/common/prisma");
const { sendManualExits } = require("@backend/common/functions/manualExit");
const { TRADE_TAGS, BINANCE_SPOT, BINANCE_FUTURES, BINANCE_TR, BITMEX } = require("@backend/common/enums/keys");
const { getPaginationQuery } = require("@backend/common/utils");
const rateLimit = require("@backend/common/middlewares/rateLimit");

const {
	getPositions: getPositionsService,
	getPositionsCount: getPositionsCountService,
} = require("../services/positions");

const getPositionSchema = Joi.object({
	where: {
		platformIds: Joi.array().allow("").optional(),
		strategyIds: Joi.array().allow("").optional(),
		quotes: Joi.array().optional(),
		symbols: Joi.array().optional(),
		enterDateGte: Joi.date().optional(),
		enterDatelt: Joi.date().optional(),
		status: Joi.string().optional(),
		skip: Joi.number().min(0).optional(),
		take: Joi.number().min(0).optional(),
		strategyPositions: Joi.boolean().optional().default(false),
		includeVirtual: Joi.boolean().optional(),
		pageNumber: Joi.number().min(0).optional().default(0),
		pageSize: Joi.number().min(0).max(100).optional().default(100),
	},
	orderBy: {
		pair: Joi.string().valid("asc", "desc").optional(),
		marketType: Joi.string().valid("asc", "desc").optional(),
		exchange: Joi.string().valid("asc", "desc").optional(),
		enterDate: Joi.string().valid("asc", "desc").optional(),
		exitDate: Joi.string().valid("asc", "desc").optional(),
	},
}).error(new Joi.ValidationError(`getPositionSchema type error`));

const positionInfoSchema = Joi.object({
	positionsInfo: Joi.array()
		.items(
			Joi.object({
				positionId: Joi.string().required(),
				exchange: Joi.string()
					.required()
					.valid(BINANCE_SPOT.name, BINANCE_FUTURES.name, BINANCE_TR.name, BITMEX.name),
			})
		)
		.required(),
	type: Joi.string().valid(TRADE_TAGS.appExit, TRADE_TAGS.exchangeExit).required(),
});

const _getQueryObject = (body) => {
	const { strategyIds, platformIds, quotes, symbols } = body.where;

	// https://github.com/prisma/prisma/issues/10117
	// IMPORTANT: Do not forget to parseInt
	return {
		...body,
		where: {
			...body.where,
			...(strategyIds ? { strategyIds: strategyIds.split(",").map((x) => BigInt(x)) } : {}),
			...(platformIds ? { platformIds: platformIds.split(",").map((x) => parseInt(x)) } : {}),
			...(quotes ? { quotes: quotes.split(",") } : {}),
			...(symbols ? { symbols: symbols.split(",") } : {}),
		},
	};
};

async function getPositions(ctx, next) {
	const req = Joi.attempt(_getQueryObject(ctx.request.body), getPositionSchema);
	const userId = ctx.request.auth.userId;

	const positions = await getPositionsService({ req, userId });

	ctx.body.data = { positions };
	ctx.status = 200;

	return next();
}

async function getPositionsCount(ctx, next) {
	const req = Joi.attempt(_getQueryObject(ctx.request.body), getPositionSchema);
	const userId = ctx.request.auth.userId;

	const positionsCount = await getPositionsCountService({ req, userId });

	ctx.body.data = { positionsCount };
	ctx.status = 200;

	return next();
}

const getPositionsFiltersSchema = Joi.object({
	pageNumber: Joi.number().min(0).optional().default(0),
	pageSize: Joi.number().min(0).max(100).optional().default(100),
}).error(new Joi.ValidationError(`getPositionsFiltersSchema type error`));

async function getPositionsFilters(ctx, next) {
	const userId = ctx.request.auth.userId;
	const body = Joi.attempt(ctx.request.query, getPositionsFiltersSchema);

	const strategies = await dbClient.strategyFollower.findMany({
		distinct: ["strategyId"],
		where: {
			deletedAt: null,
			followerId: userId,
		},
		include: {
			strategy: {
				select: {
					id: true,
					name: true,
					platform: {
						select: {
							id: true,
							name: true,
						},
					},
					marketStrategy: {
						select: {
							id: true,
							name: true,
						},
					},
				},
			},
		},
		...getPaginationQuery(body.pageNumber, body.pageSize),
	});

	ctx.body.data = {
		strategies: strategies.map((x) => ({
			id: x.strategy.id,
			name: x.strategy.name,
			platformId: x.strategy.platform.id,
			marketStrategyId: x.strategy.marketStrategy?.id,
			marketStrategyName: x.strategy.marketStrategy?.name,
		})),
		platforms: uniqBy(
			strategies.map((x) => x.strategy.platform),
			"name"
		),
	};

	ctx.status = 200;

	return next();
}

async function exportPositions(ctx, next) {
	const req = Joi.attempt(_getQueryObject(ctx.request.body), getPositionSchema);
	const userId = ctx.request.auth.userId;

	const positions = await getPositionsService({ req, userId });

	let positionReportData = [];
	let csvFields = [];

	positions.forEach((obj) => {
		let position = {};
		position.exitBy = obj.positionInfo.exitBy;
		position.exitDate = obj.positionInfo.exitDate;
		position.enterDate = obj.positionInfo.enterDate;
		position.enterPrice = obj.positionInfo.enterPrice;
		position.exitPrice = obj.positionInfo.exitPrice;
		position.profitInUSDT = obj.positionInfo?.profitInUSDT;
		position.amountExecuted = obj.positionInfo?.amountExecuted;
		position.positionPriceDiffPercent = obj.positionInfo.positionPriceDiffPercent;
		position.quote = obj.budgetSettings.quote;
		position.amount = obj.budgetSettings.amount;
		position.leverage = obj.budgetSettings.leverage;
		position.positionBudget = obj.budgetSettings.positionBudget;
		position.maximumPositionCount = obj.budgetSettings.maximumPositionCount;
		position.virtual = obj.virtual;
		position.status = obj.status;
		positionReportData.push(position);
	});
	if (!positionReportData?.length) {
		ctx.status = 204;
		return next();
	}

	csvFields = Object.keys(positionReportData[0]);

	const currentDate = new Date();
	const fileName =
		"positionExport-" +
		currentDate.getFullYear().toString() +
		"-" +
		currentDate.getMonth().toString() +
		"-" +
		currentDate.getDate().toString();

	const csvParser = new CsvParser({ csvFields });
	const csvData = csvParser.parse(positionReportData);

	ctx.set("Content-Type", "text/csv");
	ctx.set("Content-Disposition", "attachment; filename=" + fileName + ".csv");
	ctx.body = csvData;
	ctx.status = 200;

	return next();
}

async function manualExit(ctx, next) {
	const { type, positionsInfo } = Joi.attempt(ctx.request.body, positionInfoSchema);

	await sendManualExits(type, positionsInfo);

	ctx.status = 204;
	return next();
}

const router = Router();

router.post("/positions", rateLimit("/positions"), getPositions);
router.post("/positions/count", rateLimit("/positions/count"), getPositionsCount);
router.get("/positions/filter", rateLimit("/positions/filter"), getPositionsFilters);
router.post("/positions/export", rateLimit("/positions/export"), exportPositions);
router.post("/positions/manualExit", rateLimit("/positions/manualExit"), manualExit);

module.exports = router;
