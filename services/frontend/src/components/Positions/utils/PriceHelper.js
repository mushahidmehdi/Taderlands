const calculatePriceChange = (position, rates) => {
	const { status } = position;
	const { positionPriceDiffPercent, enterPrice } = position?.positionInfo;

	const { leverage } = position.positionSettings;

	const { executionType } = position?.signal?.strategy;
	const { info } = position?.signal?.strategy?.platform;
	const { platformKey } = info;

	const { symbol } = position?.signal?.parity;

	const key = `${platformKey}-${symbol}`;

	if (status === "CLOSED") {
		return (positionPriceDiffPercent * (leverage ?? 1)).toFixed(2);
	}

	// status === "OPEN"

	if (!rates?.[key]) {
		console.log(`Rate could not be found: ${key}.`);
		return 0;
	}

	const currentPrice = rates?.[key];

	return (
		(executionType === "SHORT" ? -1 : 1) *
		((currentPrice - enterPrice) / enterPrice) *
		(leverage ?? 1) *
		100
	).toFixed(2);
};

export { calculatePriceChange };
