export const tradingQualityRatios = [
	{
		title: "Maximum Drawdown",
		value: " > - 25%",
	},
	{
		title: "Profit Factor",
		value: "> 1.1",
	},
	{
		title: "Value at Risk 95",
		value: "> - 25%",
	},
];

export const tradingStatusRatios = (t) => ({
	maxReturnDrawDown: {
		title: t("expert_panel_publish_drawdown_at_return"),
		minValue: -25,
	},
	profitFactor: {
		title: t("expert_panel_publish_profit_factor"),
		minValue: 1.1,
	},
	valueAtRisk95: {
		title: t("expert_panel_publish_value_at_risk"),
		minValue: -25,
	},
});
