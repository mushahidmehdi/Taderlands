const { redis } = require("@backend/common/services/redis");

async function pathUsageCount(ctx, next) {
	const pathKey = `path-usage-count:${ctx.request.method}:${ctx.request.originalUrl}`;

	if (ctx.request.originalUrl === "/path-usage-count") {
		return next();
	}

	let value = await redis.get(pathKey);

	if (value) {
		await redis.incr(pathKey);
		return next();
	}

	await redis.set(pathKey, 1, "EX", 60 * 60 * 24);

	return next();
}

module.exports = pathUsageCount;
