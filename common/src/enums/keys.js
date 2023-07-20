const { seed } = require("@paratica/common/prisma");

const binanceSpotPrefix = "binance_spot";
const binanceTrPrefix = "binance_tr";
const binanceFuturesPrefix = "binance_futures";
const bitmexPerpetualPrefix = "bitmex_perpetual";
const tradeQueueSuffix = "_trade_queue";

const TRADE_TAGS = {
	appExit: "APP-EXIT",
	exchangeExit: "EXCHANGE-EXIT",
};

const BINANCE_SPOT = {
	name: "binance",
	tradeQueueName: binanceSpotPrefix + tradeQueueSuffix,
};

const BINANCE_FUTURES = {
	name: "binance-futures",
	tradeQueueName: binanceFuturesPrefix + tradeQueueSuffix,
};

const BINANCE_TR = {
	name: "binance-tr",
	tradeQueueName: binanceTrPrefix + tradeQueueSuffix,
};

const BITMEX = {
	name: "bitmex",
	tradeQueueName: bitmexPerpetualPrefix + tradeQueueSuffix,
};

function handlePlatformKeys(platformName) {
	switch (platformName) {
		case BINANCE_SPOT.name:
			return BINANCE_SPOT;
		case BINANCE_FUTURES.name:
			return BINANCE_FUTURES;
		case BITMEX.name:
			return BITMEX;
		case BINANCE_TR.name:
			return BINANCE_TR;
		default:
			throw new Error("No such platform was found");
	}
}

module.exports = {
	BINANCE_SPOT,
	BINANCE_FUTURES,
	BINANCE_TR,
	BITMEX,
	TRADE_TAGS,
	handlePlatformKeys,
};
