const calculateSuccessInfo = ({
	profitedPositionsCount,
	closedPositionsCount,
	profitAmountSum,
	profitPercantageSum,
}) => {
	const successRatio = closedPositionsCount ? (profitedPositionsCount / closedPositionsCount) * 100 : null;

	const totalProfit = profitAmountSum;

	const averageProfit = closedPositionsCount !== 0 ? profitPercantageSum / closedPositionsCount : profitPercantageSum;

	return { successRatio, totalProfit, averageProfit };
};

export { calculateSuccessInfo };
