const Router = require("koa-router");
const router = Router();

const axios = require("axios").default;
const dayjs = require("dayjs");
const { reverse } = require("lodash");

const { setError } = require("@backend/common/utils");
const { subscribe: subscribeCache, intervene: interveneWithCache } = require("@backend/common/middlewares/cache");
const { getBacktestById, getBacktestPositions } = require("../services/backtest");

const { transformCandlesticks, transformMarks } = require("../utils");

async function getConfig(ctx, next) {
	const { id } = ctx.request.params;

	const backtest = await getBacktestById(id);

	if (!backtest) {
		setError(ctx, 404, "BACKTEST_NOT_FOUND");
		return next();
	}

	const result = {
		supported_resolutions: ["5", "15", "60", "240", "1D"],
		supports_group_request: false,
		supports_marks: true,
		supports_search: true,
		supports_time: true,
		supports_timescale_marks: false,
		exchanges: [
			{
				value: "",
				name: backtest?.strategy?.platform?.name,
				desc: backtest?.strategy?.platform?.name,
			},
		],
		symbols_types: [
			{
				name: "Stock",
				value: "stock",
			},
		],
	};

	ctx.body = result;
	ctx.status = 200;
	return next();
}

async function getSymbols(ctx, next) {
	const { id } = ctx.request.params;

	const backtest = await getBacktestById(id);

	if (!backtest) {
		setError(ctx, 404, "BACKTEST_NOT_FOUND");
		return next();
	}

	ctx.body = {
		name: backtest?.parity?.symbol,
		description: `Backtest for ${backtest?.parity?.symbol}`,
		"exchange-traded": backtest?.strategy?.platform?.name,
		"exchange-listed": backtest?.strategy?.platform?.name,
		timezone: "Europe/Istanbul",
		type: "crypto",
		has_intraday: true,
		has_no_volume: false,
		has_empty_bars: false,
		intraday_multipliers: ["5", "15", "60", "240"],
		supported_resolutions: ["5", "15", "60", "240", "1D"],
		minmov: 1,
		minmov2: 0,
		pointvalue: 1,
		session: "24x7",
		pricescale: 100,
		ticker: backtest?.parity?.symbol,
	};
	ctx.status = 200;
	return next();
}

async function getHistory(ctx, next) {
	const { id } = ctx.request.params;
	const { symbol, from, to, resolution, countback } = ctx.request.query;

	const { CANDLESTICKS_PROVIDER_URL, ZERO_VALUE_USER_ID } = process.env;

	const backtest = await getBacktestById(id);

	if (!backtest) {
		setError(ctx, 404, "BACKTEST_NOT_FOUND");
		return next();
	}

	const resolutionMap = {
		5: "5m",
		15: "15m",
		60: "1h",
		240: "4h",
		"1D": "1d",
	};

	let candlestickResponse;

	try {
		candlestickResponse = await axios.get(
			`${CANDLESTICKS_PROVIDER_URL}?platform=${backtest.strategy?.platform?.info?.platformKey}&interval=${resolutionMap[resolution]}&symbol=${symbol}&count=${countback}&to_date=${to}&exclude_open=true`,
			{ headers: { "x-user-id": ZERO_VALUE_USER_ID } }
		);
	} catch (e) {
		console.log(JSON.stringify(e));
	}

	if (candlestickResponse?.status !== 200) {
		console.log(`Candlestick provider response status: ${candlestickResponse?.status}`);
	}

	let response;
	if (!candlestickResponse.data.length) {
		response = {
			s: "no_data",
			nextTime: from - resolution * 60,
		};

		ctx.body = response;
		ctx.status = 200;
		return next();
	}

	const transformedCandlesticks = transformCandlesticks(candlestickResponse.data);

	// 1630443600 equals 01.09.2021
	if (to < 1630443600) {
		response = {
			s: "no_data",
			// nextTime: 1547408000,
		};
	} else {
		response = {
			s: "ok",
			...Object.keys(transformedCandlesticks).reduce((acc, curr) => {
				acc[curr] = reverse(transformedCandlesticks[curr]);
				return acc;
			}, {}),
		};
	}

	ctx.body = response;
	ctx.status = 200;
	return next();
}

async function getMarks(ctx, next) {
	const { id } = ctx.request.params;

	const { from, to } = ctx.request.query;

	const backtest = await getBacktestById(id);

	if (!backtest) {
		setError(ctx, 404, "BACKTEST_NOT_FOUND");
		return next();
	}

	const positions = await getBacktestPositions(
		id,
		dayjs(from * 1000).format("YYYY-MM-DD HH:mm:ss"),
		dayjs(to * 1000).format("YYYY-MM-DD HH:mm:ss")
	);

	ctx.body = transformMarks(positions, backtest.executionType);

	ctx.status = 200;
	return next();
}

async function getTime(ctx, next) {
	ctx.body = Math.floor(Date.now() / 1000);
	ctx.status = 200;
	return next();
}

router.get("/chart/:id/config", subscribeCache(5 * 60), interveneWithCache, getConfig);
router.get("/chart/:id/symbols", subscribeCache(5 * 60), interveneWithCache, getSymbols);
router.get("/chart/:id/history", subscribeCache(5 * 60), interveneWithCache, getHistory);
router.get("/chart/:id/marks", subscribeCache(5 * 60), interveneWithCache, getMarks);
router.get("/chart/:id/time", getTime);

module.exports = router;
