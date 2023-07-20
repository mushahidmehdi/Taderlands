const { dbClient } = require("@paratica/common/prisma");

function randomIntFromInterval(min, max) {
	// min and max included
	return Math.floor(Math.random() * (max - min + 1) + min);
}

const getParity = async (platformId, symbol) => {
	return await dbClient.parity.findFirst({
		where: {
			symbol,
			platformId,
		},
		select: {
			id: true,
			symbol: true,
			base: true,
			quote: true,
		},
	});
};

const getSignal = async (id) => {
	return await dbClient.signal.findFirst({
		where: {
			id: id,
		},
		include: {
			strategy: {
				include: {
					platform: {
						select: {
							id: true,
						},
					},
				},
			},
		},
	});
};

const getStrategy = async (id) => {
	return await dbClient.strategy.findFirst({
		where: {
			id: id,
		},
		select: {
			id: true,
			webhookToken: true,
			executionType: true,
			tradeSettings: true,
			parities: true,
			platform: {
				select: {
					id: true,
					name: true,
				},
			},
			tradeType: {
				select: {
					name: true,
				},
			},
			strategyType: {
				select: {
					id: true,
				},
			},
			public: true,
		},
	});
};

const getStrategyFollowers = async (id) => {
	return await dbClient.strategyFollower.findMany({
		where: {
			strategyId: id,
		},
		select: {
			followerId: true,
			positionSettings: true,
			budgetSettings: true,
			blacklist: true,
			status: true,
			virtual: true,
		},
	});
};

const getUserApiConnections = async (platformId, userIds) => {
	return await dbClient.userApiConnection.findMany({
		where: {
			platformId,
			userId: { in: userIds },
		},
		select: { isActive: true, userId: true, restrictions: true },
	});
};

const getOpenPositionsBySignalId = async (signalId) => {
	return await dbClient.position.findMany({
		where: {
			signalId: signalId,
			status: "OPEN",
		},
	});
};

const getOpenPositionUserIdsByStrategyAndParity = async (strategyId, parityId, virtual = false) => {
	return await dbClient.position.findMany({
		where: {
			status: "OPEN",
			virtual,
			signal: {
				strategyId: strategyId,
				parity: {
					id: parityId,
				},
			},
		},
		select: {
			userId: true,
		},
	});
};

const getOpenPositionUserIdsByPlatform = async (platformId) => {
	return await dbClient.position.findMany({
		where: {
			status: "OPEN",
			virtual: false,
			signal: {
				strategy: {
					platformId,
				},
			},
		},
		select: {
			userId: true,
		},
	});
};

const getOpenRealPositionUserIdsByParity = async (parityId) => {
	return await dbClient.position.findMany({
		where: {
			status: "OPEN",
			virtual: false,
			signal: {
				parity: {
					id: parityId,
				},
			},
		},
		select: {
			userId: true,
		},
	});
};

const getOpenPositionsByStrategy = async (strategyId) => {
	return await dbClient.position.findMany({
		where: {
			status: "OPEN",
			virtual: false,
			signal: {
				strategyId: strategyId,
			},
		},
	});
};

const getOpenSignalByStrategyAndParity = async (strategyId, parityId, include = false) => {
	const query = {
		where: {
			strategyId,
			status: "OPEN",
			parityId,
		},
	};

	if (include) {
		query.include = {
			strategy: {
				include: {
					platform: {
						select: {
							id: true,
						},
					},
				},
			},
		};
	}

	return await dbClient.signal.findFirst(query);
};

const getOpenPositionsCountWithUserId = async () => {
	return await dbClient.position.groupBy({
		by: ["userId"],
		where: {
			status: "OPEN",
		},
		_count: {
			_all: true,
		},
	});
};

const createSignal = async (strategyId, parityId, enterAnalysisData, price, symbol, tags) => {
	return await dbClient.signal.create({
		data: {
			enterSignalCreationDate: new Date(),
			strategyId: strategyId,
			parityId: parityId,
			enterAnalysisData: enterAnalysisData,
			status: "OPEN",
			info: {
				openPrice: price,
				symbol: symbol,
			},
			ruleDecisionTags: {
				enterTags: tags,
			},
		},
	});
};

const updateSignalWithExitDate = async (exitAnalysisData, tags, signal) => {
	return await dbClient.signal.update({
		where: {
			id: signal.id,
		},
		data: {
			exitSignalCreationDate: new Date(),
			exitAnalysisData: exitAnalysisData,
			exitBy: "STRATEGY",
			status: null,
			ruleDecisionTags: {
				enterTags: signal.ruleDecisionTags.enterTags,
				exitTags: tags,
			},
		},
	});
};

const getSignalCount = () => dbClient.signal.count();

const getOpenPositionsCount = () =>
	dbClient.position.count({
		where: {
			status: "OPEN",
		},
	});

const getClosedPositionsCount = () =>
	dbClient.position.count({
		where: {
			status: "CLOSED",
		},
	});

const getOpenSignals = () =>
	dbClient.signal.findMany({
		select: {
			id: true,
		},
		where: {
			status: "OPEN",
		},
		skip: randomIntFromInterval(0, 100),
		take: randomIntFromInterval(500, 5000),
	});

module.exports = {
	getParity,
	getSignal,
	getStrategy,
	getStrategyFollowers,
	getUserApiConnections,
	getOpenPositionsBySignalId,
	getOpenPositionsByStrategy,
	getOpenPositionsCountWithUserId,
	getOpenSignalByStrategyAndParity,
	getOpenPositionUserIdsByStrategyAndParity,
	getOpenPositionUserIdsByPlatform,
	createSignal,
	updateSignalWithExitDate,
	getOpenRealPositionUserIdsByParity,
	getOpenSignals,
	getSignalCount,
	getOpenPositionsCount,
	getClosedPositionsCount,
};
