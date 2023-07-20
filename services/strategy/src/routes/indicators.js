const Router = require("koa-router");
const memoize = require("memoizee");

const { dbClient } = require("@paratica/common/prisma");
const rateLimit = require("@backend/common/middlewares/rateLimit");

const MAX_AGE = 10 * 1000;

const getIndicatorService = memoize(
	async () => {
		return await dbClient.indicator.findMany();
	},
	{ promise: true, maxAge: MAX_AGE, preFetch: true }
);

async function getIndicators(ctx, next) {
	const indicators = await getIndicatorService();

	ctx.body.data = { indicators };
	ctx.status = 200;

	return next();
}

const router = Router();

router.get("/indicators", rateLimit("/indicators"), getIndicators);

module.exports = router;
