const koaCash = require("koa-cash");

const { redis } = require("../services/redis");

// TODO: discuss this value with the team
const MAX_AGE = 5 * 60; // 5 MINUTES

// IMPORTANT: While using koa-cash
// by default, all the GET and HEAD methods are cached using urls as redis keys.
// We should call removeByPrefix method inside the POST methods with proper key for that route.
const subscribe = (maxAge = MAX_AGE) =>
	koaCash({
		maxAge,
		get: async (key) => {
			let value;
			try {
				value = await redis.get(key);
				if (value) {
					value = JSON.parse(value);
				}
			} catch (err) {
				console.error(err);
			}

			return value;
		},
		set: (key, value, maxAge) => {
			return redis.set(key, JSON.stringify(value), "EX", maxAge);
		},
	});

const intervene = async (ctx, next) => {
	const cashed = await ctx.cashed?.();

	if (cashed) {
		return;
	}

	return next();
};

module.exports = {
	subscribe,
	intervene,
};
