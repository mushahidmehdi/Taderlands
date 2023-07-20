const memoize = require("memoizee");

const { dbClient } = require("@paratica/common/prisma");

const MAX_AGE = 10 * 1000;

const getFunnelById = memoize(
	async (id) => {
		return await dbClient.funnel.findFirst({ where: { id: parseInt(id) } });
	},
	{ promise: true, maxAge: MAX_AGE, preFetch: true }
);

module.exports = {
	getFunnelById,
};
