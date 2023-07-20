const Router = require("koa-router");
const router = Router();
const Joi = require("joi");
const dayjs = require("dayjs");

const { dbClient } = require("@paratica/common/prisma");

const rateLimit = require("@backend/common/middlewares/rateLimit");

const getMarketStrategyMetricSchema = Joi.object({
	marketStrategyId: Joi.number().optional(),
	quote: Joi.string().optional(),
	timeRange: Joi.string().optional(),
	createdAtGte: Joi.date().optional(),
	createdAtlt: Joi.date().optional(),
});

async function getMarketStrategyMetric(ctx, next) {
	const body = Joi.attempt(ctx.request.query, getMarketStrategyMetricSchema);
	const { marketStrategyId, quote, timeRange, createdAtGte, createdAtlt } = body;

	const marketStrategyMetric = await dbClient.marketStrategyMetric.findFirst({
		where: {
			marketStrategyId,
			quote,
			timeRange,
			createdAt: {
				...(createdAtlt ? { lt: createdAtlt } : {}),
				...(createdAtGte ? { gte: createdAtGte } : {}),
			},
		},
		include: {
			marketStrategy: true,
		},
		orderBy: {
			createdAt: "desc",
		},
	});

	ctx.body.data = { marketStrategyMetric };
	ctx.status = 200;
	return next();
}

function generatePercent(curr, first) {
	const tmp = (curr / first) * 100;

	return tmp - 100;
}

async function getGeneralMarketMetrics(ctx, next) {
	const { title, startDate, endDate, rt } = ctx.query;

	const generalMarketMetrics = await dbClient.generalMarketMetrics.findMany({
		where: {
			title,
			ts: {
				gte: new Date(startDate),
				lte: new Date(endDate),
			},
		},
	});

	if (!generalMarketMetrics || !generalMarketMetrics?.length) {
		ctx.body.data = {
			series: {},
		};
		ctx.status = 200;
		return next();
	}

	const firstElement = generalMarketMetrics[0].closeValue * generalMarketMetrics[0].multiplier;

	let percentSeries = [
		{
			date: dayjs(generalMarketMetrics[0].ts).format("YYYY-MM-DD"),
			value: 0,
		},
	];

	for (let i = 1; i < generalMarketMetrics.length; i++) {
		percentSeries.push({
			date: dayjs(generalMarketMetrics[i].ts).format("YYYY-MM-DD"),
			value: Number(
				generatePercent(
					generalMarketMetrics[i].closeValue * generalMarketMetrics[i].multiplier,
					firstElement
				).toFixed(2)
			),
		});
	}

	ctx.body.data = {
		series: rt
			? percentSeries
			: percentSeries.reduce((acc, curr) => {
					acc[curr.date] = curr.value;
					return acc;
			  }, {}),
	};
	ctx.status = 200;
	return next();
}

router.get("/market-strategy-metric", rateLimit("/market-strategy-metric"), getMarketStrategyMetric);
router.get("/general-market-metrics", rateLimit("/general-market-metrics"), getGeneralMarketMetrics);

module.exports = router;
