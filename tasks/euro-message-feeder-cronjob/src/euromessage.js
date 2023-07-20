const dayjs = require("dayjs");

const { callWebService, _orderByTier } = require("./utils/util");
const { getToken, createNewUser, removeExistingAssigneeList } = require("./services/service");

const { dbClient } = require("@paratica/common/prisma");

const TIER_LIST_MAP = {
	credit: "TOP_CREDIT",
	volume: "TOP_VOLUME",
	profit: "TOP_PROFIT",
};

const TOKEN_USAGE_LIMIT = 850;

const TOP_USERS_COUNT = 100;
const TIER_SEGMENTS_COUNT = 20;
const GROUP_NAME = "Genel";

const API_URL_PATH_MAP = {
	GET_TOKEN: "/auth/login",
	ASSING_TO_LIST: "/Member/AddToSendLists",
	REMOVE_FROM_LIST: "/Member/RemoveFromSendLists",
	CREATE_NEW_USER: "/Member/InsertMemberDemography",
};

async function updateUserLists() {
	try {
		let remainingTokenUsageCount = TOKEN_USAGE_LIMIT;
		let token = await getToken();

		if (!token) {
			console.log("EuroMessage token error");
			process.exit(0);
			return;
		}

		let validatedUsers = await dbClient.user.findMany({
			where: {
				emailVerificationStatus: true,
			},
			select: {
				id: true,
				email: true,
				name: true,
				surname: true,
				phoneNumber: true,
				merchant: true,
				userApiConnections: true,
				strategies: true,
				strategyFollowers: {
					select: {
						status: true,
						strategyFollowerStatistics: true,
					},
				},
				positions: true,
				userBalances: true,
				WalletTransactionSummaryReceiver: true,
				WalletTransactionSummarySender: true,
				positionSummary: true,
				userNotificationSetting: true,
			},
			take: 10,
		});

		console.log("Validated users list length: ", validatedUsers.length);

		for (let i = 0; i < validatedUsers.length; ++i) {
			let user = validatedUsers[i];

			if (
				!user?.userNotificationSetting?.emailNotification ||
				!user?.userNotificationSetting?.emailNotificationSettings?.marketing
			) {
				break;
			}

			if (remainingTokenUsageCount <= 0) {
				token = getToken();
				remainingTokenUsageCount = TOKEN_USAGE_LIMIT;
			}

			const updateUserFieldsFrekans = process.env.UPDATE_USER_LIST_FREQUENCY;
			const controlDate = dayjs().add(-updateUserFieldsFrekans, "day").toDate();

			user.newStrategyFollowed =
				user.strategyFollowers.filter((x) => x.status === "ON" && x.createdAt > controlDate).length > 0;
			user.newStrategyUnFollowed =
				user.strategyFollowers.filter((x) => x.status === "UNFOLLOWED" && x.updatedAt > controlDate).length > 0;

			user.newDeposit = user.WalletTransactionSummaryReceiver.filter((x) => x.createdAt > controlDate).length > 0;

			const receivedAmount = user.WalletTransactionSummaryReceiver.filter(
				(x) => (x.type = "REAL" && x.status === "DONE")
			).reduce((acc, cur) => acc + cur.receivedAmount, 0);

			const sentAmount = user.WalletTransactionSummarySender.filter((x) => x.status === "DONE").reduce(
				(acc, curr) => acc + curr.sentAmount,
				0
			);
			user.credit = (receivedAmount - sentAmount).toFixed(2);

			user.volume = user.strategyFollowers
				.reduce(
					(acc, curr) =>
						(acc + curr.strategyFollowerStatistics) & (curr.strategyFollowerStatistics !== null)
							? curr.totalVolume
							: 0,
					0
				)
				.toFixed(2);

			user.profit = user.strategyFollowers
				.reduce(
					(acc, curr) =>
						(acc + curr.strategyFollowerStatistics) & (curr.strategyFollowerStatistics !== null)
							? curr.totalProfit
							: 0,
					0
				)
				.toFixed(2);

			const mailingLists = [
				{
					id: "NO_API_CONNECTED",
					value: user.userApiConnections?.length === 0 ? "true" : "false",
				},
				{
					id: "NO_DEPOSIT_YET",
					value:
						user.userApiConnections.length > 0 && user.WalletTransactionSummaryReceiver?.length === 0
							? "true"
							: "false",
				},
				{
					id: "FIRST_DEPOSIT",
					value: user.WalletTransactionSummaryReceiver?.length === 1 ? "true" : "false",
				},
				{
					id: "NEW_DEPOSIT",
					value: user.newDeposit ? "true" : "false",
				},
				{
					id: "NO_STRATEGY_FOLLOWED",
					value:
						user.userApiConnections?.length > 0 &&
						user.WalletTransactionSummaryReceiver?.length > 0 &&
						user.strategyFollowers?.length === 0
							? "true"
							: "false",
				},
				{
					id: "NO_CREDIT_REMAINING",
					value: user.WalletTransactionSummaryReceiver?.length > 0 && user.credit <= 1 ? "true" : "false",
				},
				{
					id: "NEW_STRATEGY_FOLLOWED",
					value: user.newStrategyFollowed ? "true" : "false",
				},
				{
					id: "STRATEGY_UNFOLLOWED",
					value: user.newStrategyUnFollowed > 0 ? "true" : "false",
				},
				{
					id: "NO_POSITION_YET",
					value: user.positions?.length === 0 ? "true" : "false",
				},
				{
					id: "MARKETING_ALLOWED",
					value:
						user?.userNotificationSetting?.emailNotification &&
						user?.userNotificationSetting?.emailNotificationSettings?.marketing
							? "true"
							: "false",
				},
			];

			const SendLists = [];

			for (let i = 0; i < mailingLists.length; i++) {
				const mailingList = mailingLists[i];
				if (mailingList.value === "true") {
					SendLists.push({
						ListName: mailingList.id,
						GroupName: GROUP_NAME,
					});
				}
			}

			await removeExistingAssigneeList(user, token, SendLists);
			remainingTokenUsageCount = remainingTokenUsageCount - 2;

			const data = JSON.stringify({
				Key: "EMAIL",
				Value: user.email,
				Move: false,
				SendLists,
			});

			const params = {
				method: "post",
				path: API_URL_PATH_MAP.ASSING_TO_LIST,
				token,
				data,
			};

			const updateListResponse = await callWebService(params);
			remainingTokenUsageCount--;

			if (
				updateListResponse?.response?.data?.Errors[0]?.Code === "69" &&
				updateListResponse?.response?.data?.Errors[0]?.Message === "No such member!"
			) {
				remainingTokenUsageCount = remainingTokenUsageCount - 2;

				await createNewUser(user, token);
				await callWebService(params);
			}
		}

		console.log("Starting to iterate tier list");

		const tierList = ["volume", "credit", "profit"];

		for (let i = 0; i < tierList.length; i++) {
			const tier = tierList[i];
			validatedUsers = _orderByTier(tier, validatedUsers);

			let tierNumber = 0;

			for (let j = 0; j < TOP_USERS_COUNT; j++) {
				if (j % TIER_SEGMENTS_COUNT === 0) {
					tierNumber++;
				}

				const user = validatedUsers[j];

				if (!user) {
					j = TOP_USERS_COUNT;
					break;
				}

				const SendLists = [
					{
						ListName: TIER_LIST_MAP[tier] + "_" + tierNumber,
						GroupName: GROUP_NAME,
					},
				];

				const data = JSON.stringify({
					Key: "EMAIL",
					Value: user.email,
					Move: false,
					SendLists,
				});

				const params = {
					method: "post",
					path: API_URL_PATH_MAP.ASSING_TO_LIST,
					token,
					data,
				};

				const tierUpdateResponse = await callWebService(params);

				if (tierUpdateResponse?.response?.data?.Errors[0]) {
					for (let i = 0; i < tierUpdateResponse?.response?.data?.Errors.length; i++) {
						console.log(tierUpdateResponse?.response?.data?.Errors[i]);
					}

					remainingTokenUsageCount--;

					const euroMessageTransactionData = {
						userId: user.id,
						newAssignment: SendLists,
						transactionDate: new Date(),
					};

					await dbClient.euroMessageAssignment.create({
						data: euroMessageTransactionData,
					});

					if (
						tierUpdateResponse?.response?.data?.Errors[0]?.Code === "69" &&
						tierUpdateResponse?.response?.data?.Errors[0]?.Message === "No such member!"
					) {
						remainingTokenUsageCount = remainingTokenUsageCount - 2;

						await createNewUser(user, token);
						await callWebService(params);
					}
				}
			}
		}

		console.log("Executed successfully.");
	} catch (e) {
		console.log(e);
	} finally {
		process.exit(0);
	}
}

module.exports = { updateUserLists };
