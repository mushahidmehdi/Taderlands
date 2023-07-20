const Router = require("koa-router");
const router = Router();
const Joi = require("joi");

const { dbClient } = require("@paratica/common/prisma");
const rateLimit = require("@backend/common/middlewares/rateLimit");

const getUserBalanceSummarySchema = Joi.object({
	transactionDateGte: Joi.date().optional(),
	transactionDatelt: Joi.date().optional(),
	platformId: Joi.number().optional(),
}).error(new Joi.ValidationError(`getUserBalanceSummarySchema type error`));

async function getUserBalanceSummary(ctx, next) {
	const userId = ctx.request.auth.userId;
	const body = Joi.attempt(ctx.request.query, getUserBalanceSummarySchema);
	const { transactionDateGte, transactionDatelt, platformId } = body;

	const historicalSummaries = await dbClient.userBalanceSummary.findMany({
		where: {
			userId,
			...(platformId && { platformId: parseInt(platformId) }),
			transactionDate: {
				...(transactionDateGte ? { gte: transactionDateGte } : {}),
				...(transactionDatelt ? { lt: transactionDatelt } : {}),
			},
		},
		select: {
			platformId: true,
			transactionDate: true,
			stableAmounts: true,
		},
		orderBy: {
			transactionDate: "desc",
		},
	});

	const historicalSummary = historicalSummaries.reduce((acc, curr) => {
		acc[curr.transactionDate] = {
			totalBtcAmount: (acc?.[curr.transactionDate]?.totalBtcAmount ?? 0) + curr.stableAmounts.totalBtcAmount,
			totalUsdtAmount: (acc?.[curr.transactionDate]?.totalUsdtAmount ?? 0) + curr.stableAmounts.totalUsdtAmount,
		};

		return acc;
	}, {});

	const amounts = [
		...Object.keys(historicalSummary).map((transactionDate) => ({
			transactionDate: new Date(transactionDate),
			...historicalSummary[transactionDate],
		})),
	];

	ctx.body.data = { amounts };

	ctx.status = 200;

	return next();
}

router.get("/historical-balance-summary", rateLimit("/historical-balance-summary"), getUserBalanceSummary);

module.exports = router;
