const Router = require("koa-router");
const { dbClient } = require("@paratica/common/prisma");

const { subscribe: subscribeCache, intervene: interveneWithCache } = require("@backend/common/middlewares/cache");
const rateLimit = require("@backend/common/middlewares/rateLimit");

async function getPlatforms(ctx, next) {
	const { active } = ctx.request.query;

	const platforms = await dbClient.platform.findMany({
		where: {
			...((active === "true" || active === "false") && { active: active === "true" }),
		},
		select: {
			id: true,
			name: true,
			info: true,
			requiredConnectionFields: true,
			exchange: true,
			active: true,
			connectionInfo: true,
		},
	});

	ctx.body.data = { platforms };
	ctx.status = 200;

	return await next();
}

const router = Router();

router.get(
	"/platforms",
	rateLimit("/platforms"),
	subscribeCache(30 * 60 /** MAX AGE = 30 Minutes */),
	interveneWithCache,
	getPlatforms
);

module.exports = router;
