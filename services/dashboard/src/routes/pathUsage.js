const Router = require("koa-router");
const router = Router();
const { redis, getKeysByPrefix } = require("@backend/common/services/redis");

async function getPathUsagesFromRedis(ctx, next) {
	const keys = await getKeysByPrefix("path-usage-count");

	let result = {};

	for (const key of keys) {
		result[key] = await redis.get(key);
	}

	ctx.status = 200;
	ctx.body.data = { pathUsage: result };
	return next();
}

router.get("/path-usage-count", getPathUsagesFromRedis);

module.exports = router;
