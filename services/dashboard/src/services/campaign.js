const memoize = require("memoizee");
const { dbClient } = require("@paratica/common/prisma");
const { redis } = require("@backend/common/services/redis");
const MAX_AGE = 10 * 1000;

const CONTROL_FUNCTION_LIST = {
	USER_API_CONNECTION: "USER_API_CONNECTION",
	FOLLOW_STRATEGY: "FOLLOW_STRATEGY",
	POSITION: "POSITION",
	MERCHANT_VOLUME: "MERCHANT_VOLUME",
	RELEASE_STRATEGY: "RELEASE_STRATEGY",
};

const STATUS_TYPES = {
	SIGNED: "SIGNED",
	PENDING: "PENDING",
	CLOSED: "CLOSED",
	CLAIMED: "CLAIMED",
	COMPLETED: "COMPLETED",
	ACCEPTED: "ACCEPTED",
};

const STEP_TYPES = {
	CLAIM: "CLAIM",
	MERCHANT: "MERCHANT",
	REGISTER: "REGISTER",
};

const getCampaignById = memoize(
	async (id) => {
		return await dbClient.campaign.findFirst({ where: { id: parseInt(id) } });
	},
	{ promise: true, maxAge: MAX_AGE, preFetch: true }
);

async function campaignStepsChecker(params) {
	switch (params.functionName) {
		case CONTROL_FUNCTION_LIST.USER_API_CONNECTION:
			return userApiconnectionControl(params);
		case CONTROL_FUNCTION_LIST.FOLLOW_STRATEGY:
			return followStrategyControl(params);
		case CONTROL_FUNCTION_LIST.POSITION:
			return positionControl(params);
		case CONTROL_FUNCTION_LIST.MERCHANT_VOLUME:
			return merchantVolumeControl(params);
		case CONTROL_FUNCTION_LIST.RELEASE_STRATEGY:
			return checkMarketStrategy(params);
		default:
			return false;
	}
}

async function userApiconnectionControl(params) {
	const { userId, platformId } = params;

	const userApiConnection = await dbClient.userApiConnection.findFirst({
		where: {
			userId,
			platformId,
		},
	});

	return userApiConnection ? true : false;
}

async function followStrategyControl(params) {
	const { userId, platformId } = params;

	const strategyFollower = await dbClient.strategyFollower.findMany({
		where: {
			deletedAt: null,
			followerId: userId,
		},
		include: {
			strategy: {
				select: {
					platformId: true,
				},
			},
		},
	});

	const platformStrategyFollower = strategyFollower.filter((sf) => sf.strategy.platformId === platformId);

	return platformStrategyFollower.length > 0 ? true : false;
}

async function positionControl(params) {
	const { userId, platformId, positionCount, campaignStartDate } = params;

	const positions = await dbClient.position.findMany({
		where: {
			deletedAt: null,
			userId,
			status: STATUS_TYPES.CLOSED,
			createdAt: {
				gte: campaignStartDate,
			},
		},
		include: {
			signal: {
				include: {
					strategy: {
						select: {
							platformId: true,
						},
					},
				},
			},
		},
	});

	const platformPositions = positions.filter((p) => p.signal.strategy.platformId === platformId);

	return platformPositions.lenght >= positionCount ? true : false;
}

async function merchantVolumeControl(params) {
	const { userId, expectedVolume, campaignId } = params;

	let redisValue = await redis.get("userId:" + userId + ":campaignId:" + campaignId);

	if (redisValue) {
		redisValue = JSON.parse(redisValue);
		params.details = redisValue;
		return redisValue.volumeGenerated >= expectedVolume ? true : false;
	}

	const leaderboardPositionsSummary = await dbClient.leaderboardPositionSummary.findFirst({
		where: {
			userId,
			campaignId,
		},
	});

	const volumeGenerated = leaderboardPositionsSummary?.totalVolume || 0;
	const successRate = leaderboardPositionsSummary?.successRatio || 0;

	params.details = {
		volumeGenerated,
		successRate,
	};

	redisValue = params.details;

	await redis.set("userId:" + userId + ":campaignId:" + campaignId, JSON.stringify(redisValue), "EX", 300);

	return volumeGenerated >= expectedVolume ? true : false;
}

async function checkMarketStrategy(params) {
	const { userId, platformId } = params;

	const marketStrategy = await dbClient.marketStrategy.findFirst({
		where: {
			status: STATUS_TYPES.ACCEPTED,
			merchant: {
				userId,
			},
			...(platformId && {
				strategy: {
					platformId,
				},
			}),
		},
	});

	return marketStrategy ? true : false;
}

function _maskEmail(email) {
	const [username, domain] = email.split("@");
	const firstChar = username.charAt(0);
	const lastChar = username.charAt(username.length - 1);
	const maskedUsername = `${firstChar}****${lastChar}`;
	return `${maskedUsername}@${domain}`;
}

module.exports = {
	_maskEmail,
	getCampaignById,
	campaignStepsChecker,
	STATUS_TYPES,
	STEP_TYPES,
	CONTROL_FUNCTION_LIST,
};
