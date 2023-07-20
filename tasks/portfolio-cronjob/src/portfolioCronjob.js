const { getCurrentPortfolioByPlatform } = require("@backend/common/functions/portfolio");
const { dbClient } = require("@paratica/common/prisma");
const axios = require("axios").default;
const ERROR_MAP = require("@backend/common/enums/error");

const DYDX_PLATFORM_ID = 11;

async function getPortfolioByExchange(userApiConnection, params) {
	const userId = userApiConnection.userId;
	const MINIMUM_AMOUNT = 0.000001;
	const platform = await dbClient.platform.findFirst({
		where: {
			id: userApiConnection.platformId,
		},
	});
	let errorMessage = {
		platformId: userApiConnection.platformId,
		status: "ERROR",
		...ERROR_MAP.UNCOMPLETED_EXCHANGE_REQUEST,
	};

	const portfolios = await getCurrentPortfolioByPlatform(params, platform.info.platformKey);

	if (!portfolios || portfolios.error) {
		errorMessage = {
			...errorMessage,
			step: "getPortfolios",
			...(portfolios?.error && { message: portfolios?.error }),
		};

		console.log("getPortfolioByExchange " + userId + " " + JSON.stringify(errorMessage));
		return errorMessage;
	}

	const assets = portfolios.assets?.filter(({ coinAmount }) => coinAmount > MINIMUM_AMOUNT);

	if (!assets) {
		errorMessage = {
			...errorMessage,
			step: "getPortfolios",
			message: "No assets found",
		};
		console.log("getPortfolios " + userId + " " + JSON.stringify(errorMessage));
		return errorMessage;
	}

	const assetQuery = [];
	for (let i = 0; i < assets.length; ++i) {
		assetQuery.push(assets[i].coinName);
	}

	let quote = userApiConnection.platformId === DYDX_PLATFORM_ID ? "usd" : "usdt";

	let options = {
		method: "GET",
		url:
			process.env.BACKEND_URL +
			"/exchange-rate?assets=" +
			assetQuery +
			"&quote=" +
			quote +
			"&platform=" +
			platform.info.platformKey,
		headers: {},
		data: "",
		maxRedirects: 20,
	};

	const usdtChangeRate = await axios.request(options).catch(function (error) {});

	if (!usdtChangeRate) {
		errorMessage.step = "getUsdtChangeRate";
		console.log("getUsdtChangeRate " + userId + " " + JSON.stringify(errorMessage));
		return errorMessage;
	}

	options.url =
		process.env.BACKEND_URL +
		"/exchange-rate?assets=" +
		assetQuery +
		"&quote=btc&platform=" +
		platform.info.platformKey;

	const btcChangeRate = await axios.request(options).catch(function (error) {});

	if (!btcChangeRate) {
		errorMessage.step = "getBtcChangeRate";
		console.log("getBtcChangeRate " + userId + " " + JSON.stringify(errorMessage));
		return errorMessage;
	}

	let totalUsdtAmount = 0;
	let totalBtcAmount = 0;

	for (let j = 0; j < assets.length; ++j) {
		try {
			assets[j].usdtAmount = assets[j].coinAmount * usdtChangeRate.data[assets[j].coinName];

			totalUsdtAmount += isNaN(assets[j].coinAmount * usdtChangeRate.data[assets[j].coinName])
				? 0
				: parseFloat(assets[j].coinAmount * usdtChangeRate.data[assets[j].coinName]);
			totalBtcAmount += isNaN(assets[j].coinAmount * btcChangeRate.data[assets[j].coinName])
				? 0
				: parseFloat(assets[j].coinAmount * btcChangeRate.data[assets[j].coinName]);
		} catch (error) {}
	}

	const balances = {
		platform,
		assets,
		timestamp: Date.now(),
	};

	const userBalanceData = {
		userId,
		platformId: platform.id,
		portfolio: balances,
		stableAmounts: {
			totalUsdtAmount,
			totalBtcAmount,
		},
	};
	const userBalance = await dbClient.userBalance.create({
		data: {
			...userBalanceData,
			createdBy: userId,
		},
	});

	return userBalance;
}

async function getPortfolio(userId) {
	const userApiConnections = await dbClient.userApiConnection.findMany({
		where: {
			userId,
			restrictions: {
				path: ["canRead"],
				equals: true,
			},
		},
	});

	const platformIdList = [];

	for (let i = 0; i < userApiConnections.length; ++i) {
		platformIdList.push(userApiConnections[i].platformId);
	}

	for (let i = 0; i < userApiConnections.length; ++i) {
		const params = {
			apiKey: JSON.parse(userApiConnections[i].exchangeConnectionInfo).apiKey,
			apiSecret: JSON.parse(userApiConnections[i].exchangeConnectionInfo).apiSecret,
		};

		if (userApiConnections[i].exchangeConnectionInfo?.passphrase) {
			params.passphrase = userApiConnections[i].exchangeConnectionInfo.passphrase;
		}

		await getPortfolioByExchange(userApiConnections[i], params);
	}

	return;
}

async function startPortfolioCronJob() {
	try {
		const userApiConnections = await dbClient.userApiConnection.findMany({
			where: {
				restrictions: {
					path: ["canRead"],
					equals: true,
				},
			},
			distinct: ["userId"],
			select: {
				userId: true,
			},
		});

		console.log("User api connections list length: ", userApiConnections.length);

		for (let i = 0; i < userApiConnections.length; ++i) {
			const userId = userApiConnections[i].userId;

			await getPortfolio(userId);
		}

		console.log("Executed successfully.");

		return;
	} catch (e) {
		console.log(e);
	} finally {
		process.exit(0);
	}
}

module.exports = { startPortfolioCronJob };
