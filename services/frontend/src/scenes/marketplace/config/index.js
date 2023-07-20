export const searchDropdown = (t) => [
	{
		key: t("marketplace_search_for_strategy"),
		value: "Strategy",
	},
	{
		key: t("marketplace_search_for_expert"),
		value: "Expert",
	},
];

export const activeTabType = (t) => [
	{
		name: t("marketplace_strategy_tab"),
		type: "STRATEGY",
	},
	{
		name: t("marketplace_creator_tab"),
		type: "EXPERT",
	},
];

export const filterOptions = {
	right: [
		{
			name: "ROI",
			type: "profitPercent",
		},
		{
			name: "Success Rate",
			type: "successRate",
		},
		{
			name: "Avr. Profit",
			type: "averageProfit",
		},
		{
			name: "Pos. Count",
			type: "positionCount",
		},
	],
	left: [
		{
			name: "Time Range",
			type: "WEEK",
		},
		{
			name: "Exchange",
			type: "EXCHANGE",
		},
	],
};

export const timeFilter = [
	{
		name: "Monthly",
		value: "1M",
	},
	{
		name: "Quarterly",
		value: "3M",
	},

	{
		name: "6 Months",
		value: "6M",
	},

	{
		name: "Yearly",
		value: "1Y",
	},
];

export const defaultFiltering = {
	FUNNEL_ID: 2,
	INITIAL_PAGE_NUMBER: 0,
	INITIAL_PAGE_SIZE: 12,
};

export const stratigiesObjectCount = {
	where: {
		timeRange: "1Y",
		pageSize: 250,
	},
};

export const TIME_RANGE_DATA_MAP = {
	undefined: "strategyStatistics",
	"1M": "strategyStatistics1m",
	"1Y": "strategyStatistics1y",
	"3M": "strategyStatistics3m",
	"6M": "strategyStatistics6m",
};
