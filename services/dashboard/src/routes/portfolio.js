const Router = require("koa-router");
const router = Router();
const dayjs = require("dayjs");
const axios = require("axios").default;

const { dbClient } = require("@paratica/common/prisma");

const ERROR_MAP = require("@backend/common/enums/error");

const { getCurrentPortfolioByPlatform } = require("@backend/common/functions/portfolio");
const { getRestrictions } = require("@backend/common/functions/restrictions");

const rateLimit = require("@backend/common/middlewares/rateLimit");

const DYDX_PLATFORM_ID = 11;
const BITMEX_PLATFORM_ID = 1;

async function connectionRecheck(userApiConnection) {
	let restrictions = await getRestrictions(
		userApiConnection.platform.exchange,
		JSON.parse(userApiConnection.exchangeConnectionInfo)
	);

	if (!restrictions || !restrictions?.isValid) {
		restrictions = {
			isValid: false,
		};
	}
	const details = {
		...(restrictions.expireDate && { expireDate: dayjs(restrictions.expireDate).format("DD/MM/YYYY") }),
		...(restrictions.exchangeId && { exchangeId: restrictions.exchangeId }),
	};

	await dbClient.userApiConnection.updateMany({
		where: {
			id: userApiConnection.id,
		},
		data: {
			restrictions,
			...(details && { details }),
		},
	});
}

async function getPortfolioByExchange(userApiConnection, params) {
	try {
		const userId = userApiConnection.userId;
		const MINIMUM_AMOUNT = 0.000001;
		const platform = await dbClient.platform.findFirst({
			where: {
				id: userApiConnection.platformId,
			},
		});

		let userBalance = {
			userId,
			platformId: userApiConnection.platformId,
			platform,
			portfolio: {},
			stableAmounts: {
				totalBtcAmount: 0.0,
				totalUsdtAmount: 0.0,
			},
		};

		let errorMessage = {
			platformId: userApiConnection.platformId,
			status: "ERROR",
			...ERROR_MAP.UNCOMPLETED_EXCHANGE_REQUEST,
		};

		const portfolios = await getCurrentPortfolioByPlatform(params, platform.info.platformKey);

		console.log("[getPortfolioByExchange] portfolios " + userId + " " + JSON.stringify(portfolios));

		if (!portfolios || portfolios.error) {
			errorMessage = {
				...errorMessage,
				step: "getPortfolios",
				...(portfolios?.error && { message: portfolios?.error }),
			};

			try {
				await connectionRecheck(userApiConnection);
			} catch (error) {
				errorMessage = {
					...errorMessage,
					step: "getPortfolios.connectionRecheck",
					...(error.message && { message: error.message }),
				};
			}
			userBalance.errorMessage = errorMessage;
			console.log("[getPortfolioByExchange] " + userId + " " + JSON.stringify(errorMessage));
			return userBalance;
		}
		const assets = portfolios.assets?.filter(({ coinAmount }) => coinAmount > MINIMUM_AMOUNT);

		console.log(`[getPortfolioByExchange] assets length: ${assets?.length}`);

		if (!assets || assets?.length === 0) {
			errorMessage = {
				...errorMessage,
				step: "getPortfolios",
				message: "No assets found",
			};
			userBalance.errorMessage = errorMessage;
			return userBalance;
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

		console.log(
			"[getPortfolioByExchange] get usdt exchange rate options " + userId + " " + JSON.stringify(options)
		);

		let usdtRateResponse;

		try {
			usdtRateResponse = await axios.request(options);
		} catch (e) {
			if (e.response) {
				console.log("Error at usdt rate request");
				console.log(JSON.stringify(e.response));
				console.log(JSON.stringify(e.options));
			}
		}

		if (usdtRateResponse?.status !== 200) {
			console.log(`Usdt rate status: ${usdtRateResponse?.status}`);
		}

		const usdtChangeRate = usdtRateResponse;

		if (!usdtChangeRate) {
			errorMessage.step = "getUsdtChangeRate";
			userBalance.errorMessage = errorMessage;
			console.log("getUsdtChangeRate " + userId + " " + JSON.stringify(errorMessage));
			return userBalance;
		}

		quote = userApiConnection.platformId === BITMEX_PLATFORM_ID ? "xbt" : "btc";

		options.url =
			process.env.BACKEND_URL +
			"/exchange-rate?assets=" +
			assetQuery +
			"&quote=" +
			quote +
			"&platform=" +
			platform.info.platformKey;

		let btcRateResponse;

		try {
			btcRateResponse = await axios.request(options);
		} catch (e) {
			if (e.response) {
				console.log("Error at btc rate request");
				console.log(JSON.stringify(e.response));
				console.log(JSON.stringify(e.options));
			}
		}

		if (btcRateResponse?.status !== 200) {
			console.log(`btc rate status: ${btcRateResponse?.status}`);
		}

		const btcChangeRate = btcRateResponse;

		if (!btcChangeRate) {
			errorMessage.step = "getBtcChangeRate";
			userBalance.errorMessage = errorMessage;
			console.log("getBtcChangeRate " + userId + " " + JSON.stringify(errorMessage));
			return userBalance;
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
			} catch (error) {
				console.log("calculateAssets " + userId + " " + JSON.stringify(error));
			}
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
		userBalance = await dbClient.userBalance.create({
			data: {
				...userBalanceData,
				createdBy: userId,
			},
		});

		userBalance = {
			...userBalance,
			platform,
		};

		return userBalance;
	} catch (error) {
		console.log("[getPortfolioByExchange] " + userApiConnection?.userId + " " + JSON.stringify(error));
	}
}

async function getPortfolio(ctx, next) {
	const userId = ctx.request.auth.userId;

	const balanceRefreshIntervalMinutes = process.env.BALANCE_REFRESH_INTERVAL_MINUTES;
	const currentDate = new Date();
	const controlDate = new Date(currentDate.getTime() - balanceRefreshIntervalMinutes * 60000);

	const userApiConnections = await dbClient.userApiConnection.findMany({
		where: {
			userId,
			restrictions: {
				path: ["canRead"],
				equals: true,
			},
		},
		include: {
			platform: true,
		},
	});

	console.log(`[getPortfolio] userId: ${userId}, userApiConnections length: ${userApiConnections.length}`);

	const platformIdList = [];

	for (let i = 0; i < userApiConnections.length; ++i) {
		platformIdList.push(userApiConnections[i].platformId);
	}

	const userBalances = await dbClient.userBalance.findMany({
		where: {
			userId,
			platformId: { in: platformIdList },
			createdAt: {
				gte: controlDate,
			},
		},
		include: {
			platform: true,
		},
	});

	console.log(`[getPortfolio] userBalances length: ${userBalances?.length}`);

	if (userBalances?.length > 0) {
		ctx.body.data = { userBalances };
		ctx.status = 200;

		return next();
	}

	const userBalancesFromPortfolio = [];

	for (let i = 0; i < userApiConnections.length; ++i) {
		try {
			const params = JSON.parse(userApiConnections[i].exchangeConnectionInfo);
			const userBalance = await getPortfolioByExchange(userApiConnections[i], params);

			userBalancesFromPortfolio.push(userBalance);
		} catch (error) {
			console.log("getPortfolioByExchange" + userApiConnections[i].userId + " " + JSON.stringify(error));
		}
	}

	ctx.body.data = { userBalances: userBalancesFromPortfolio };
	ctx.status = 200;

	return next();
}

router.get("/portfolio", rateLimit("/portfolio"), getPortfolio);

module.exports = router;
