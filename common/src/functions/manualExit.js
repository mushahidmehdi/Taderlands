const { mqConnectionEmitter, createChannelWrapper, publishMessage } = require("../services/rabbitmq");
const { BINANCE_SPOT, BINANCE_FUTURES, BINANCE_TR, BITMEX, handlePlatformKeys } = require("../enums/keys");

const allowedExchanges = [BINANCE_SPOT, BINANCE_FUTURES, BINANCE_TR, BITMEX];

mqConnectionEmitter.on("connected", () => {
	allowedExchanges.forEach((keys) => {
		createChannelWrapper({
			name: keys.name,
			exchange: "manuelExit.exchange",
			queue: keys.tradeQueueName,
			routingKey: `manuelExit.${keys.name}`,
		});
	});
});

async function sendManualExits(type, positionsInfo) {
	for (const position of positionsInfo) {
		const keys = handlePlatformKeys(position.exchange);

		await publishMessage(keys.name, {
			id: position.positionId,
			tag: type,
		});
	}
}

module.exports = { sendManualExits };
