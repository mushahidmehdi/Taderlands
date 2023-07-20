import { useTranslation } from "react-i18next";

import { Grid, Paper, Typography } from "@mui/material";

import shortenNumber from "utils/shortenNumber";

const METRIC_LABELS = (t) => ({
	totalProfitPercent: t("marketplace_strategy_page_metrics_total_profit"),
	successRate: t("marketplace_strategy_page_metrics_success"),
	averageProfitPercent: t("marketplace_strategy_page_metrics_average_profit"),
	profitFactor: t("marketplace_strategy_page_metrics_profit"),
	sharpeRatio: t("marketplace_strategy_page_metrics_sharpe"),
	totalTradeCount: t("marketplace_strategy_page_metrics_pos_count"),
	maxDrawUp: t("marketplace_strategy_page_metrics_drawup"),
	maxDrawDown: t("marketplace_strategy_page_metrics_drawdown"),
	maxReturnDrawUp: t("marketplace_strategy_page_metrics_drawup_at_return"),
	maxReturnDrawDown: t("marketplace_strategy_page_metrics_drawdown_at_return"),
	averagePositionDuration: t("marketplace_strategy_page_metrics_average_position_duration"),
});
export default function Metrics({ metrics }) {
	const { t } = useTranslation("marketplace");

	return (
		<Paper sx={{ borderRadius: "8px", backgroundColor: (theme) => theme.palette.info.light, padding: 2 }}>
			<Grid container spacing={2}>
				{Object.keys(METRIC_LABELS(t)).map((key, ix) => (
					<>
						{metrics[key] ? (
							<Grid item xs={3} key={key}>
								<Typography sx={{ fontSize: "12px", color: (theme) => theme.palette.text.primary }}>
									{METRIC_LABELS(t)[key]}
								</Typography>
								<Typography
									sx={{
										fontSize: "16px",
										fontWeight: 700,
										color: (theme) => theme.palette.primary.main,
									}}
								>
									{key !== "totalTradeCount" && key !== "averagePositionDuration"
										? shortenNumber(parseFloat(metrics[key] ?? 0))
										: metrics[key] ?? 0}
								</Typography>
							</Grid>
						) : (
							<></>
						)}
					</>
				))}
			</Grid>
		</Paper>
	);
}
