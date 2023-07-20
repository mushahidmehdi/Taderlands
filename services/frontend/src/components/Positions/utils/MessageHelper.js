const prepareRateMessage = (positions) => {
	let message = { type: "subscribe", obj: [] };

	let exchangeParityMap = {};

	for (const position of positions) {
		const { symbol } = position.signal.parity;

		const { info } = position.signal.strategy.platform;

		const { platformKey } = info;

		!exchangeParityMap[platformKey] && (exchangeParityMap[platformKey] = new Set());

		exchangeParityMap[platformKey].add(symbol);
	}

	message.obj = Object.keys(exchangeParityMap).map((exchange) => {
		return { exchange, parities: [...exchangeParityMap[exchange]] };
	});

	return message;
};

// the data coming from client feeder service is an array consisting objects such:
// { exchange: "exchange name", parities: { "PARITY-1": 111, "PARITY-2": 222 } }
// This method normalizes this data to a simple map such as:
// { "exchange name-PARITY-1": 111, "exchange name-PARITY-2": 222 }
const normalizeRateMessage = (rates, data) =>
	data.reduce((acc, curr) => {
		Object.keys(curr.parities).forEach((par) => {
			acc[`${curr.exchange}-${par}`] =
				curr.parities[par] === "N/A"
					? rates?.[`${curr.exchange}-${par}`]
						? rates[`${curr.exchange}-${par}`]
						: null
					: curr.parities[par];
		});

		return acc;
	}, {});

export { normalizeRateMessage, prepareRateMessage };
