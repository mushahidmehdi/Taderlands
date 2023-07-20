const { _ } = require("lodash");
const dayjs = require("dayjs");
const { dbClient } = require("@paratica/common/prisma");

const ORDER_TYPE_MAP = {
	ASC: "asc",
	DESC: "desc",
};

const SCORE_CALCULATOR_METHOT_MAP = {
	SUM: "sum",
	MULTIPLY: "multiply",
	DIVIDE: "divide",
	SUBTRACT: "subtract",
};

const SCORE_CALCULATOR_INITIAL_VALUE_MAP = {
	sum: 0,
	multiply: 1,
	divide: 1,
	subtract: 0,
};

const TO_FIXED_SIZE = 10;

async function calculateLeaderboardRank() {
	try {
		const campaigns = await dbClient.campaign.findMany({
			where: {
				startDate: {
					lte: dayjs().toDate(),
				},
				endDate: {
					gte: dayjs().toDate(),
				},
				leaderboardInfo: { not: {} },
			},
		});

		console.log("campaigns length: ", campaigns.length);

		for (let i = 0; i < campaigns.length; i++) {
			await calculateLeaderboardRankForCampaign(campaigns[i]);
		}

		console.log("Executed successfully.");
	} catch (e) {
		console.log(e);
	} finally {
		process.exit(0);
	}
}

async function calculateLeaderboardRankForCampaign(campaign) {
	try {
		let campaignAttendances = await dbClient.campaignAttendance.findMany({
			where: {
				campaignId: campaign.id,
				leaderboardPositionSummaries: {
					some: {},
				},
			},
			include: {
				user: true,
				leaderboardPositionSummaries: true,
			},
		});

		if (campaignAttendances.length === 0) {
			return;
		}

		campaignAttendances = campaignAttendances.map((campaignAttendance) => {
			const score = _getScore(campaignAttendance, campaign);

			return {
				...campaignAttendance,
				score,
			};
		});

		campaignAttendances = _sort(campaignAttendances, campaign);

		campaignAttendances = campaignAttendances.map((campaignAttendance, index) => {
			return {
				...campaignAttendance,
				rank: index + 1,
			};
		});

		const iterationNo = campaign.leaderboardInfo?.iterationNo || 0;

		const previousRanks = await dbClient.leaderboard.findMany({
			where: {
				iterationNo,
				campaignId: campaign.id,
			},
			select: {
				userId: true,
				rank: true,
			},
		});

		let previousRankData = {};

		for (let i = 0; i < previousRanks.length; i++) {
			previousRankData[previousRanks[i].userId] = previousRanks[i];
		}

		for (let i = 0; i < campaignAttendances.length; i++) {
			const tier = await _getTierByRank(campaignAttendances[i], campaign);

			const leaderboardData = {
				campaignId: campaignAttendances[i].campaignId,
				userId: campaignAttendances[i].userId,
				status: "active",
				score: campaignAttendances[i].score,
				rank: campaignAttendances[i].rank,
				...(tier && { tier }),
				...(previousRankData[campaignAttendances[i].userId]?.rank && {
					previousRank: previousRankData[campaignAttendances[i].userId]?.rank,
				}),
				...(campaignAttendances[i].leaderboardPositionSummaries[0]?.successRatio && {
					successRatio: parseFloat(
						campaignAttendances[i].leaderboardPositionSummaries[0].successRatio.toFixed(TO_FIXED_SIZE)
					),
				}),
				...(campaignAttendances[i].leaderboardPositionSummaries[0]?.averageProfit && {
					averageProfit: parseFloat(
						campaignAttendances[i].leaderboardPositionSummaries[0].averageProfit.toFixed(TO_FIXED_SIZE)
					),
				}),
				...(campaignAttendances[i].leaderboardPositionSummaries[0]?.totalVolume && {
					totalVolume: parseFloat(
						campaignAttendances[i].leaderboardPositionSummaries[0].totalVolume.toFixed(TO_FIXED_SIZE)
					),
				}),
				...(campaignAttendances[i].leaderboardPositionSummaries[0]?.totalProfit && {
					totalProfit: parseFloat(
						campaignAttendances[i].leaderboardPositionSummaries[0].totalProfitAmount.toFixed(TO_FIXED_SIZE)
					),
				}),
				iterationNo: iterationNo + 1,
			};

			await dbClient.leaderboard.create({
				data: { ...leaderboardData },
			});
		}

		await dbClient.campaign.updateMany({
			where: {
				id: campaign.id,
			},
			data: {
				leaderboardInfo: {
					...campaign.leaderboardInfo,
					iterationNo: iterationNo + 1,
				},
			},
		});
	} catch (error) {
		console.log(error);
	}
}

function _sort(campaignAttendances, campaign) {
	const { orderBy, orderType } = campaign.leaderboardInfo;
	return campaignAttendances.sort((a, b) => {
		const aValue = parseFloat(_.get(a, orderBy, 0));
		const bValue = parseFloat(_.get(b, orderBy, 0));

		if (orderType === ORDER_TYPE_MAP.ASC) {
			return aValue - bValue;
		}
		return bValue - aValue;
	});
}

async function _getTierByRank(campaignAttendance, campaign) {
	const tierList = campaign.leaderboardInfo?.tierList;

	for (let i = 0; i < tierList.length; i++) {
		if (campaignAttendance.rank >= tierList[i].rankFrom && campaignAttendance.rank <= tierList[i].rankTo) {
			return i;
		}
	}
}

function _getScore(campaignAttendance, campaign) {
	const { scoreCalculator } = campaign?.leaderboardInfo;

	const fieldsKeys = Object.keys(scoreCalculator.fields);

	let score = SCORE_CALCULATOR_INITIAL_VALUE_MAP[scoreCalculator.method];

	for (let i = 0; i < fieldsKeys.length; i++) {
		switch (scoreCalculator.method) {
			case SCORE_CALCULATOR_METHOT_MAP.SUM:
				score =
					score + campaignAttendance.leaderboardPositionSummaries[0][fieldsKeys[i]] ||
					0 * scoreCalculator.fields[fieldsKeys[i]];
				break;
			case SCORE_CALCULATOR_METHOT_MAP.MULTIPLY:
				score =
					score * campaignAttendance.leaderboardPositionSummaries[0][fieldsKeys[i]] ||
					0 * scoreCalculator.fields[fieldsKeys[i]];
				break;
			case SCORE_CALCULATOR_METHOT_MAP.DIVIDE:
				score =
					score / campaignAttendance.leaderboardPositionSummaries[0][fieldsKeys[i]] ||
					0 * scoreCalculator.fields[fieldsKeys[i]];
				break;
			case SCORE_CALCULATOR_METHOT_MAP.SUBTRACT:
				score =
					score - campaignAttendance.leaderboardPositionSummaries[0][fieldsKeys[i]] ||
					0 * scoreCalculator.fields[fieldsKeys[i]];
				break;
			default:
				score =
					score + campaignAttendance.leaderboardPositionSummaries[0][fieldsKeys[i]] ||
					0 * scoreCalculator.fields[fieldsKeys[i]];
				break;
		}
	}

	score = score / scoreCalculator.divisionRate;
	return parseFloat(score.toFixed(TO_FIXED_SIZE));
}

module.exports = { calculateLeaderboardRank };
