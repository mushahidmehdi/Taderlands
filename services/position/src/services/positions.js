const memoize = require("memoizee");

const { dbClient } = require("@paratica/common/prisma");

const MAX_AGE = 5 * 1000;

const MEMOIZE_OPTS = { promise: true, maxAge: MAX_AGE, preFetch: true, primitive: true, normalizer: JSON.stringify };
const { getPaginationQuery } = require("@backend/common/utils");

const _getPositionsWhere = (req, userId) => {
	const {
		strategyPositions,
		platformIds,
		strategyIds,
		quotes,
		symbols,
		enterDateGte,
		enterDatelt,
		status,
		includeVirtual,
	} = req;

	const where = {
		deletedAt: null,
		user: {
			...(strategyPositions ? { id: process.env.ZERO_VALUE_USER_ID } : { id: userId }),
		},
		...(status ? { status } : {}),
		// https://stackoverflow.com/questions/2559318/how-to-check-for-an-undefined-or-null-variable-in-javascript
		...(includeVirtual === false ? { virtual: false } : {}),
		...(platformIds || strategyIds || quotes
			? {
					signal: {
						strategy: {
							...(platformIds ? { platformId: { in: platformIds } } : {}),
							...(strategyIds ? { id: { in: strategyIds } } : {}),
						},
						parity: {
							...(quotes && { quote: { in: quotes } }),
							...(symbols && { symbol: { in: symbols } }),
						},
					},
			  }
			: {}),
		createdAt: {
			...(enterDatelt ? { lt: enterDatelt } : {}),
			...(enterDateGte ? { gte: enterDateGte } : {}),
		},
	};

	return where;
};

const _getPositionsOrderBy = (req) => {
	const { pair, marketType, exchange, enterDate, exitDate } = req;

	const orderBy = {
		...(enterDate ? { createdAt: enterDate } : {}),
		...(exitDate ? { updatedAt: exitDate } : {}),
		...(marketType || exchange
			? {
					signal: {
						strategy: {
							...(marketType ? { executionType: marketType } : {}),
							...(exchange ? { platform: { exchange: exchange } } : {}),
						},
					},
			  }
			: {}),
		...(pair
			? {
					signal: {
						parity: {
							...(pair ? { base: pair } : {}),
						},
					},
			  }
			: {}),
	};

	return orderBy;
};

const getPositions = memoize(async ({ req, userId }) => {
	return await dbClient.position.findMany({
		where: _getPositionsWhere(req.where, userId),
		select: {
			id: true,
			status: true,
			virtual: true,
			budgetSettings: true,
			positionSettings: true,
			positionInfo: true,
			...(req.where.status ? { tradingServicesErrorLog: true } : {}),
			signal: {
				select: {
					strategy: {
						select: {
							marketStrategy: true,
							executionType: true,
							name: true,
							id: true,
							public: true,
							platform: {
								select: {
									id: true,
									name: true,
									exchange: true,
									info: true,
								},
							},
							user: {
								select: {
									merchant: {
										select: {
											id: true,
											name: true,
											nickname: true,
										},
									},
								},
							},
							tradeSettings: true,
							labels: true,
						},
					},
					parity: {
						select: {
							base: true,
							quote: true,
							symbol: true,
						},
					},
				},
			},
		},
		...getPaginationQuery(req.where.pageNumber, req.where.pageSize),

		orderBy: {
			...(req.orderBy ? _getPositionsOrderBy(req.orderBy) : { updatedAt: "desc" }),
		},
	});
}, MEMOIZE_OPTS);

const getPositionsCount = memoize(async ({ req, userId }) => {
	const where = _getPositionsWhere(req.where, userId);

	// https://github.com/prisma/prisma/issues/11556
	// count with where problem fixed with 3.9.1
	return await dbClient.position.aggregate({
		where,
		_count: true,
	});
}, MEMOIZE_OPTS);

module.exports = {
	getPositions,
	getPositionsCount,
};
