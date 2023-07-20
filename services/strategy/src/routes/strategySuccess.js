const Router = require("koa-router");
const { dbClient } = require("@paratica/common/prisma");
const Joi = require("joi");
const { getPaginationQuery } = require("@backend/common/utils");

const rateLimit = require("@backend/common/middlewares/rateLimit");

const getStrategySuccessesSchema = Joi.object({
	strategyId: Joi.number().optional(),
	status: Joi.string().optional(),
	createdAtGte: Joi.date().optional(),
	createdAtlt: Joi.date().optional(),
	pageNumber: Joi.number().min(0).optional().default(0),
	pageSize: Joi.number().min(0).max(100).optional().default(100),
}).error(new Joi.ValidationError(`strategySuccessSchema type error`));

async function getStrategySuccesses(ctx, next) {
	const { strategyId, status, createdAtGte, createdAtlt, pageNumber, pageSize } = Joi.attempt(
		ctx.request.query,
		getStrategySuccessesSchema
	);

	const strategySuccesses = await dbClient.strategySuccess.findMany({
		...getPaginationQuery(pageNumber, pageSize),
		where: {
			deletedAt: null,
			status,
			strategyId,
			createdAt: {
				...(createdAtGte ? { gte: createdAtGte } : {}),
				...(createdAtlt ? { lt: createdAtlt } : {}),
			},
		},
	});

	ctx.body.data = { strategySuccesses };
	ctx.status = 200;

	return next();
}

async function getStrategySuccess(ctx, next) {
	const { id } = ctx.request.params;

	const strategySuccess = await dbClient.strategySuccess.findUnique({
		where: {
			id: parseInt(id),
		},
	});

	ctx.body.data = { strategySuccess };
	ctx.status = 200;

	return next();
}

const router = Router();

router.get("/strategy-successes", rateLimit("/strategy-successes"), getStrategySuccesses);
router.get("/strategy-success/:id", rateLimit("/strategy-success/id"), getStrategySuccess);
module.exports = router;
