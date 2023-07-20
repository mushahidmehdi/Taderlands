const memoize = require("memoizee");
const { merge } = require("lodash");

const { dbClient } = require("@paratica/common/prisma");
const { STATUS_TYPES } = require("../constants");
const MAX_AGE = 3 * 1000;
const MAXIMUM_FOLLOWED_STRATEGY_COUNT_PER_PLATFORM = 5;
const { _ } = require("lodash");

const TIME_RANGE_MAP = {
	"1M": 1,
	"3M": 3,
	"6M": 6,
	"1Y": 12,
};

const TIME_RANGE_STRATEGY_STATISTICS_MAP = {
	"1M": "strategyStatistics1m",
	"3M": "strategyStatistics3m",
	"6M": "strategyStatistics6m",
	"1Y": "strategyStatistics1y",
};

const ORDER_TYPE_MAP = {
	ASC: "asc",
	DESC: "desc",
};

const getMarketStrategyById = memoize(
	async (id) => {
		return await dbClient.marketStrategy.findUnique({
			where: {
				id: parseInt(id),
			},
			include: {
				merchant: true,
				strategy: {
					select: {
						id: true,
						platform: true,
						executionType: true,
						parities: true,
						strategyStatistics: true,
						strategyStatistics1m: true,
						strategyStatistics3m: true,
						strategyStatistics6m: true,
						strategyStatistics1y: true,
						labels: true,
						strategyFollowers: {
							where: {
								followerId: process.env.ZERO_VALUE_USER_ID,
							},
						},
					},
				},
			},
		});
	},
	{ promise: true, maxAge: MAX_AGE, preFetch: true }
);

const getFollowerLimitControlResult = async (marketStrategy, strategy, userId) => {
	const strategyFollowedCount = await dbClient.strategyFollower.count({
		where: {
			strategyId: BigInt(marketStrategy.strategyId),
			status: { not: STATUS_TYPES.UNFOLLOWED },
		},
	});

	if (strategyFollowedCount >= marketStrategy.maxFollowerCount) {
		const erroData = {
			text: "MAX_FOLLOWER_COUNT_REACHED",
			code: 404,
		};
		return erroData;
	}

	const followingStrategyCount = await dbClient.strategyFollower.count({
		where: {
			followerId: userId,
			status: STATUS_TYPES.ON,
			strategy: {
				platformId: strategy.platformId,
				ownerId: { not: userId },
				public: 1,
			},
		},
	});

	if (followingStrategyCount >= MAXIMUM_FOLLOWED_STRATEGY_COUNT_PER_PLATFORM) {
		const erroData = {
			text: "MAX_FOLLOWING_COUNT_BY_PLATFORM_REACHED",
			code: 404,
		};
		return erroData;
	}
};

function preparePricingInfo(params) {
	const { user, marketStrategy, contractorUser, inviterUser, type } = params;
	let pricingInfo = {};

	switch (type) {
		case "Case4":
			pricingInfo = {
				strategy: {
					to: marketStrategy.merchant.userId,
					ratio: marketStrategy.pricing.amount,
					onProfit: true,
					onBuy: false,
					onSell: true,
					amountType: "profit",
				},
				systemProfit: {
					to: "system",
					ratio: user.baseFees.profitFee,
					onProfit: true,
					onBuy: false,
					onSell: true,
					amountType: "profit",
				},
				systemVolume: {
					to: "system",
					ratio: user.baseFees.volumeFee,
					onProfit: false,
					onBuy: true,
					onSell: true,
					amountType: "volume",
				},
			};

			return pricingInfo;

		case "Case5":
			pricingInfo = {
				strategy: {
					to: marketStrategy.merchant.userId,
					ratio: marketStrategy.pricing.amount,
					onProfit: true,
					onBuy: false,
					onSell: true,
					amountType: "profit",
				},
				systemVolume: {
					to: "system",
					ratio: user.baseFees.volumeFee,
					onProfit: false,
					onBuy: true,
					onSell: true,
					amountType: "volume",
				},
				systemProfit: {
					to: "system",
					ratio: (parseFloat(user.baseFees.profitFee) - 0.01).toFixed(2),
					onProfit: true,
					onBuy: false,
					onSell: true,
					amountType: "profit",
				},
				reference: {
					to: inviterUser.id,
					ratio: parseFloat(user.usedReferenceCode.inviterIncome) / 100,
					onProfit: true,
					onBuy: false,
					onSell: true,
					amountType: "profit",
				},
			};
			return pricingInfo;
		case "Case6":
			pricingInfo = {
				strategy: {
					to: marketStrategy.merchant.userId,
					ratio: marketStrategy.pricing.amount,
					onProfit: true,
					onBuy: false,
					onSell: true,
					amountType: "profit",
				},
				systemVolume: {
					to: "system",
					ratio: user.baseFees.volumeFee,
					onProfit: false,
					onBuy: true,
					onSell: true,
					amountType: "volume",
				},
				systemProfit: {
					to: "system",
					ratio: (parseFloat(user.baseFees.profitFee) - 0.01).toFixed(2),
					onProfit: true,
					onBuy: false,
					onSell: true,
					amountType: "profit",
				},
				reference: {
					to: inviterUser.id,
					ratio: (0.8 * parseFloat(user.usedReferenceCode.inviterIncome)) / 100,
					onProfit: true,
					onBuy: false,
					onSell: true,
					amountType: "profit",
				},
				contractorReference: {
					to: contractorUser.id,
					ratio: (0.2 * parseFloat(user.usedReferenceCode.inviterIncome)) / 100,
					onProfit: true,
					onBuy: false,
					onSell: true,
					amountType: "profit",
				},
			};
			return pricingInfo;
		default:
			return pricingInfo;
	}
}

function _orderBy(orderBy, orderType, timeRange, marketStrategies) {
	const ORDER_PATHS = {
		profitPercent: "marketStrategyMetrics[0].livetestResults.metrics.totalProfitPercent",
		successRate: "marketStrategyMetrics[0].livetestResults.metrics.successRate",
		averageProfit: "marketStrategyMetrics[0].livetestResults.metrics.averageProfitPercent",
		followerCount: "strategy._count.strategyFollowers",
		positionCount: "marketStrategyMetrics[0].livetestResults.metrics.totalTradeCount",
	};

	return marketStrategies.sort((a, b) => {
		const aValue = parseFloat(_.get(a, ORDER_PATHS[orderBy], 0));
		const bValue = parseFloat(_.get(b, ORDER_PATHS[orderBy], 0));

		if (orderType === ORDER_TYPE_MAP.ASC) {
			return aValue - bValue;
		}
		return bValue - aValue;
	});
}

function _getMarketStrategyWhere(body, funnel) {
	const { merchantId, platformId, search } = body.where;

	const where = merge(funnel?.query ?? {}, {
		strategy: {
			public: parseInt(1),
			...(platformId && {
				platform: {
					id: platformId,
				},
			}),
		},
		...(merchantId ? { merchantId: parseInt(merchantId) } : {}),
		...(search
			? {
					OR: [
						{
							name: {
								contains: `%${search}%`,
								mode: "insensitive",
							},
						},
						{
							strategy: {
								platform: {
									exchange: {
										contains: `%${search}%`,
										mode: "insensitive",
									},
								},
							},
						},
						{
							merchant: {
								nickname: {
									contains: `%${search}%`,
									mode: "insensitive",
								},
							},
						},
					],
			  }
			: {}),
	});

	return where;
}

const getMarketStrategiesCountService = memoize(
	async ({ body, funnel }) => {
		const where = _getMarketStrategyWhere(body, funnel);

		// https://github.com/prisma/prisma/issues/11556
		// count with where problem fixed with 3.9.1
		return await dbClient.marketStrategy.aggregate({
			where,
			_count: true,
		});
	},
	{ promise: true, maxAge: MAX_AGE, preFetch: true }
);

module.exports = {
	_orderBy,
	TIME_RANGE_MAP,
	getMarketStrategyById,
	preparePricingInfo,
	_getMarketStrategyWhere,
	getFollowerLimitControlResult,
	getMarketStrategiesCountService,
};
