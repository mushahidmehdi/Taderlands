const memoize = require("memoizee");

const { dbClient } = require("@paratica/common/prisma");

const MAX_AGE = 3 * 1000;

const getParities = memoize(
	async (platformId, base, quote, symbol) =>
		await dbClient.parity.findMany({
			where: {
				...(platformId ? { platformId: parseInt(platformId) } : {}),
				...(base ? { base } : {}),
				...(quote ? { quote } : {}),
				...(symbol ? { symbol } : {}),
			},
		}),
	{ promise: true, maxAge: MAX_AGE, preFetch: true }
);

module.exports = {
	getParities,
};
