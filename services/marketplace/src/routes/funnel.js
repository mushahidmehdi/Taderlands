const { omit } = require("lodash");
const Router = require("koa-router");
const router = Router();
const Joi = require("joi");
const memoize = require("memoizee");

const { dbClient } = require("@paratica/common/prisma");
const { removeByPrefix } = require("@backend/common/services/redis");
const { Funnel, FunnelUpdate } = require("../models/funnel");
const { getFunnelById } = require("../services/funnel");
const { getPaginationQuery } = require("@backend/common/utils");

const rateLimit = require("@backend/common/middlewares/rateLimit");

const getFunnelsSchema = Joi.object({
	status: Joi.string().optional(),
	pageNumber: Joi.number().min(0).optional().default(0),
	pageSize: Joi.number().min(0).max(100).optional().default(100),
}).error(new Joi.ValidationError(`getFunnelsSchema type error`));

async function getFunnels(ctx, next) {
	const body = Joi.attempt(ctx.request.query, getFunnelsSchema);
	const { status, pageNumber, pageSize } = body;

	const funnels = await dbClient.funnel.findMany({
		where: {
			...(status ? { status } : {}),
		},
		...getPaginationQuery(pageNumber, pageSize),
	});

	ctx.body.data = { funnels: funnels.map((funnel) => omit(funnel, "query")) };
	ctx.status = 200;
	return next();
}

async function getFunnel(ctx, next) {
	const funnel = await getFunnelById(ctx.request.params.id);

	ctx.body.data = { funnel: omit(funnel, "query") };
	ctx.status = 200;
	return next();
}

async function createFunnel(ctx, next) {
	const body = Joi.attempt(ctx.request.body, Funnel);
	const funnel = await dbClient.funnel.create({
		data: body,
	});

	await removeByPrefix("/funnels");

	ctx.body.message = "ok";
	ctx.body.data = { funnel };
	ctx.status = 200;

	return next();
}

async function updateFunnel(ctx, next) {
	const body = Joi.attempt(ctx.request.body, FunnelUpdate);

	const funnel = await dbClient.funnel.update({
		where: {
			id: ctx.request.params.id,
		},
		data: body,
	});

	await removeByPrefix("/funnel");
	await getFunnelById.delete(funnel?.id);

	ctx.body.message = "ok";
	ctx.body.data = { funnel };
	ctx.status = 200;

	return next();
}

router.get("/funnels", rateLimit("/funnels"), getFunnels);
router.get("/funnel/:id", rateLimit("/funnel/id/get"), getFunnel);
router.put("/funnel/:id", rateLimit("/funnel/id/put"), updateFunnel);
router.post("/funnel", rateLimit("/funnel"), createFunnel);

module.exports = router;
