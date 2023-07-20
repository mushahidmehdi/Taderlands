const Router = require("koa-router");
const Joi = require("joi");
const { pick } = require("lodash");

const { dbClient } = require("@paratica/common/prisma");
const { subscribe: subscribeCache, intervene: interveneWithCache } = require("@backend/common/middlewares/cache");
const rateLimit = require("@backend/common/middlewares/rateLimit");

const paritiesDetailsSchema = Joi.object({
	ids: Joi.array().items(Joi.any()).required(),
}).error(new Joi.ValidationError(`paritiesDetailsSchema type error`));

async function getParitiesDetails(ctx, next) {
	const body = Joi.attempt(ctx.request.body, paritiesDetailsSchema);
	const ids = body.ids.map((x) => Number(x));
	const parities = await dbClient.parity.findMany({
		where: {
			id: { in: ids },
		},
		select: {
			id: true,
			platformId: true,
			symbol: true,
			base: true,
			quote: true,
		},
	});

	ctx.body.data = { parities };
	ctx.status = 200;

	return next();
}

async function getParities(ctx, next) {
	const { platformId, base, quote, status, symbol } = ctx.request.query;

	const parities = await dbClient.parity.findMany({
		where: {
			...(platformId ? { platformId: parseInt(platformId) } : {}),
			...(base ? { base } : {}),
			...(quote ? { quote } : {}),
			...(symbol ? { symbol } : {}),
			...(status ? { status } : {}),
		},
	});

	ctx.body.data = { parities: parities.map((x) => pick(x, ["id", "platformId", "symbol", "base", "quote"])) };
	ctx.status = 200;

	return next();
}

const router = Router();

router.get(
	"/parities",
	rateLimit("/parities"),
	subscribeCache(30 * 60 /** MAX AGE: 30 Minutes */),
	interveneWithCache,
	getParities
);

router.post("/parities/details", rateLimit("/parities/details"), getParitiesDetails);

module.exports = router;
