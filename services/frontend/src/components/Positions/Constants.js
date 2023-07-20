import { SideFutures, SideLong, SideShort, SideSpot } from "images";

const SIDE_LOOKUP = {
	SHORT: {
		backgroundColor: "#7879F1",
		icon: SideShort,
	},
	LONG: {
		backgroundColor: "#0F20E8",
		icon: SideLong,
	},
	SPOT: {
		backgroundColor: "#A5A6F6",
		icon: SideSpot,
	},
	FUTURES: {
		backgroundColor: "#7879F1",
		icon: SideFutures,
	},
};

const POSITIONS_HEAD_CELLS = (t, status, hideLookup, onOrderChange) =>
	[
		{
			id: "pair",
			label: t("control_panel_positions_table_pair"),
			orderActive: Boolean(onOrderChange),
		},
		{
			id: "marketType",
			label: t("control_panel_positions_table_side"),
			orderActive: Boolean(onOrderChange),
		},
		{
			id: "exchange",
			label: t("control_panel_positions_table_exchange"),
			orderActive: Boolean(onOrderChange),
		},
		{
			id: "enterDate",
			label: t("control_panel_positions_table_enter_date"),
			orderActive: Boolean(onOrderChange),
		},
		...(status === "CLOSED"
			? [
					{
						id: "exitDate",
						label: t("control_panel_positions_table_exit_date"),
						orderActive: Boolean(onOrderChange),
					},
			  ]
			: []),
		{
			id: "expertStrategy",
			label: t("control_panel_positions_table_exp_str"),
			orderActive: false,
		},
		...(status !== "ERROR"
			? [
					{
						id: "profitAmount",
						label: t("control_panel_positions_table_profit_amount"),
						orderActive: false,
					},
			  ]
			: []),
		...(status === "ERROR"
			? [
					{
						id: "errorDate",
						label: t("control_panel_positions_table_error_date"),
						orderActive: false,
					},
					{
						id: "reason",
						label: t("control_panel_positions_table_reason"),
						orderActive: false,
					},
			  ]
			: []),
		...(status === "OPEN"
			? [
					{
						id: "price",
						label: t("control_panel_positions_table_price"),
						orderActive: false,
					},
			  ]
			: []),
		...(status === "CLOSED"
			? [{ id: "exitPrice", label: t("control_panel_positions_table_exit_price"), orderActive: false }]
			: []),
		...(status === "CLOSED"
			? [{ id: "exitBy", label: t("control_panel_positions_table_exit_by"), orderActive: false }]
			: []),
	].filter((x) => (hideLookup ? !hideLookup[x.id] : true));

const STRATEGIES_HEAD_CELLS = [
	{
		id: "head-cell-status",
		label: "Status",
	},
	{
		id: "head-cell-strategy",
		label: "Strategy",
	},
	{
		id: "head-cell-expert",
		label: "Expert",
	},
	{
		id: "head-cell-average-profit",
		label: "Average Profit",
	},
	{
		id: "head-cell-open-close-positions",
		label: "Open/Close Pos.",
	},
	{
		id: "head-cell-success-rate",
		label: "Success Rate",
	},
	{
		id: "head-cell-total-profit",
		label: "Total Profit",
	},
];

export { SIDE_LOOKUP, POSITIONS_HEAD_CELLS, STRATEGIES_HEAD_CELLS };
