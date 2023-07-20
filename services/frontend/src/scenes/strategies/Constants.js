import { SideFutures, SideLong, SideShort, SideSpot } from "images";

const STRATEGIES_HEAD_CELLS = (t) => [
	{
		id: "head-cell-status",
		label: t("control_panel_robots_table_pair"),
	},
	{
		id: "head-cell-strategy",
		label: t("control_panel_robot_table_strategy"),
	},
	{
		id: "head-cell-expert",
		label: t("control_panel_robot_table_exp_str"),
	},
	{
		id: "head-cell-side",
		label: t("control_panel_robot_table_side"),
	},
	{
		id: "head-cell-exchange",
		label: t("control_panel_robot_table_exchange"),
	},
	{
		id: "head-cell-average-profit",
		label: t("control_panel_robots_table_average_profit"),
	},
	{
		id: "head-cell-open-close-positions",
		label: t("control_panel_robots_table_pos_count"),
	},
	{
		id: "head-cell-success-rate",
		label: t("control_panel_robots_table_success_rate"),
	},
	{
		id: "head-cell-total-profit",
		label: t("control_panel_robots_table_total_profit"),
	},
	{
		id: "settings",
		label: "Settings",
	},
];

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
export { STRATEGIES_HEAD_CELLS, SIDE_LOOKUP };
