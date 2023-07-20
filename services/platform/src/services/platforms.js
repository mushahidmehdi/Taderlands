const memoize = require("memoizee");

const { dbClient } = require("@paratica/common/prisma");

const MAX_AGE = 10 * 1000;

const getPlatformsByExchange = memoize(
	async (exchange) => {
		return await dbClient.platform.findMany({ where: { exchange, active: true } });
	},
	{ promise: true, maxAge: MAX_AGE, preFetch: true }
);

module.exports = {
	getPlatformsByExchange,
};
