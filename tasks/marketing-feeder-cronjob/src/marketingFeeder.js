const { dbClient } = require("@paratica/common/prisma");
var axios = require("axios");
const dayjs = require("dayjs");

const TAGS_TYPES = {
	STANDART_USER: "STANDART_USER",
	MERCHANT_USER: "MERCHANT_USER",
};

async function updateUserFields() {
	try {
		const activeCampaignBaseUrl = process.env.ACTIVE_CAMPAIGN_API_BASE_URL;

		const fieldListUrl = `${activeCampaignBaseUrl}/fields`;

		const fieldListParams = {
			method: "get",
			url: fieldListUrl,
		};
		const fieldDetails = await callWebService(fieldListParams);

		if (!fieldDetails.fields || fieldDetails.fields.length === 0) {
			console.log("Error occured while getting field details");
			return;
		}

		let fieldMap = {};

		for (let i = 0; i < fieldDetails.fields.length; ++i) {
			if (fieldDetails.fields[i].title && fieldDetails.fields[i].id) {
				fieldMap[fieldDetails.fields[i].title] = parseInt(fieldDetails.fields[i].id);
			}
		}

		const validatedUsers = await dbClient.user.findMany({
			where: {
				emailVerificationStatus: true,
			},
			select: {
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
			},
			take: 10, // TODO: why take ten?
		});

		const contacts = [];

		for (let i = 0; i < validatedUsers.length; ++i) {
			let user = validatedUsers[i];
			const updateUserFieldsFrekans = process.env.UPDATE_USER_FIELD_FREQUENCY;
			const controlDate = dayjs().add(-updateUserFieldsFrekans, "day").toDate();

			user.newStrategyFollowed = user.strategyFollowers.filter((x) => x.createdAt > controlDate).length > 0;

			const receivedAmount = user.WalletTransactionSummaryReceiver.filter((x) => x.status === "DONE").reduce(
				(acc, cur) => acc + cur.receivedAmount,
				0
			);
			const sentAmount = user.WalletTransactionSummarySender.filter((x) => x.status === "DONE").reduce(
				(acc, curr) => acc + curr.sentAmount,
				0
			);
			const credit = (receivedAmount - sentAmount).toFixed(2);

			const volume = user.strategyFollowers
				.reduce(
					(acc, curr) =>
						(acc + curr.strategyFollowerStatistics) & (curr.strategyFollowerStatistics !== null)
							? curr.totalVolume
							: 0,
					0
				)
				.toFixed(2);

			const profit = user.strategyFollowers
				.reduce(
					(acc, curr) =>
						(acc + curr.strategyFollowerStatistics) & (curr.strategyFollowerStatistics !== null)
							? curr.totalProfit
							: 0,
					0
				)
				.toFixed(2);

			const contact = {
				email: user.email,
				first_name: user.firstName,
				last_name: user.lastName,
				phone: user.phoneNumber,
				tags: [user.merchant ? TAGS_TYPES.MERCHANT_USER : TAGS_TYPES.STANDART_USER],
				fields: [
					{
						id: fieldMap.API_CONNEDTED,
						value: user.userApiConnections.length > 0 ? "true" : "false",
					},
					{
						id: fieldMap.DEPOSITED,
						value: user.WalletTransactionSummaryReceiver.length > 0 ? "true" : "false",
					},
					{
						id: fieldMap.USER_BALANCE,
						value: user.userBalances.length > 0 ? "true" : "false",
					},
					{
						id: fieldMap.POSITION,
						value: user.positions.length > 0 ? "true" : "false",
					},
					{
						id: fieldMap.STRATEGY_FOLLOWED,
						value: user.strategyFollowers.length > 0 ? "true" : "false",
					},
					{
						id: fieldMap.STRATEGY_UNFOLLOWED,
						value: user.strategyFollowers.length > 0 ? "true" : "false",
					},
					{
						id: fieldMap.NEW_STRATEGY_FOLLOWED,
						value: user.newStrategyFollowed ? "true" : "false",
					},
					{
						id: fieldMap.MARKETING_ALLOWED,
						value: user?.marketingNotificationSettins ? "true" : "false",
					},
					{
						id: fieldMap.WEEKLY_RECAP,
						value: "",
					},
					{
						id: fieldMap.MONTHLY_RECAP,
						value: "",
					},
					{
						id: fieldMap.CREDIT,
						value: credit,
					},
					{
						id: fieldMap.VOLUME,
						value: volume,
					},
					{
						id: fieldMap.PROFIT,
						value: profit,
					},
				],
			};

			contacts.push(contact);
		}

		const contactParams = {
			method: "post",
			url: `${activeCampaignBaseUrl}/import/bulk_import`,
			data: JSON.stringify({ contacts }),
		};

		const result = await callWebService(contactParams);

		console.log(result);
	} catch (e) {
		console.log(e);
	} finally {
		process.exit(0);
	}
}

async function callWebService(params) {
	const { method, url, data } = params;
	const activeCampaignApiToken = process.env.ACTIVE_CAMPAIGN_API_TOKEN;

	var config = {
		method,
		maxBodyLength: Infinity,
		url,
		headers: {
			"Api-Token": activeCampaignApiToken,
		},
		...(data && { data }),
	};

	let responseData = "";

	await axios(config)
		.then(function (response) {
			responseData = response.data;
		})
		.catch(function (error) {
			responseData = error;
		});

	return responseData;
}

module.exports = { updateUserFields };
