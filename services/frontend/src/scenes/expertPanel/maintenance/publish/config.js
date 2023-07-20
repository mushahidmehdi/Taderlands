export const tradingQualityRatios = [
	{
		key: "Sharpe Ratio",
		value: "> 0.5",
	},
	{
		key: "Maximun Drawndown",
		value: " > - %25",
	},
	{
		key: "Risk Factor",
		value: " > 1.1",
	},
	{
		key: "Value at Risk 95",
		value: "> - % 25",
	},
];

export const tradingStatusRatios = [
	{ key: "Sharpe Ratio ", minValue: 0.5, value: "sharpeRatio" },
	{ key: "Maximum Drawdown", minValue: -25, value: "maxDrawDown" },
	{ key: "Profit Factor", minValue: 1.1, value: "profitFactor" },
	{ key: "Value At Risk", minValue: -25, value: "valueAtRisk95" },
];
