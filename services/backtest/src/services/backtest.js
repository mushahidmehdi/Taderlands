const memoize = require("memoizee");

const { dbClient } = require("@paratica/common/prisma");

const MAX_AGE = 10 * 1000;

const getBacktestById = memoize(
	async (id) => {
		return await dbClient.backtest.findUnique({
			where: {
				id: parseInt(id),
			},
			include: {
				strategy: {
					select: {
						name: true,
						platform: true,
					},
				},
				parity: true,
			},
		});
	},
	{ promise: true, maxAge: MAX_AGE, preFetch: true }
);

const getBacktestPositions = memoize(async (id, from, to) => {
	return await dbClient.backtestPosition.findMany({
		where: {
			deletedAt: null,
			backtest: {
				id: parseInt(id),
			},
			enterDate: {
				lte: new Date(to),
				gte: new Date(from),
			},
		},
	});
});

module.exports = {
	getBacktestById,
	getBacktestPositions,
};
