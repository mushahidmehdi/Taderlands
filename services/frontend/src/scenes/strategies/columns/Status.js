import { useTranslation } from "react-i18next";

import { Grid, Typography } from "@mui/material";

import { Bolt as BoltSvg, Standby as StandbySvg, Stop as StopSvg, Unfollow } from "images";

export default function Status({ status, strategyFollowerStatistics }) {
	const { t } = useTranslation();

	return (
		<Grid container spacing={2}>
			<Grid item xs={12}>
				{status === "ON" && <BoltSvg />}
				{status === "OFF" && <StopSvg />}
				{status === "STANDBY" && <StandbySvg />}
				{status === "UNFOLLOWED" && !strategyFollowerStatistics?.openPositionsCount && <Unfollow />}
				{status === "UNFOLLOWED" && strategyFollowerStatistics?.openPositionsCount > 0 && <StandbySvg />}
			</Grid>
			<Grid item xs={12}>
				{status === "ON" && <Typography>{t("control_panel_robots_table_status_on")}</Typography>}
				{status === "OFF" && <Typography>{t("control_panel_robots_table_status_off")}</Typography>}
				{status === "STANDBY" && <Typography>{t("control_panel_robots_table_status_standby")}</Typography>}
				{status === "UNFOLLOWED" && !strategyFollowerStatistics?.openPositionsCount && (
					<Typography>{t("control_panel_robots_archive_unfollowed_status")}</Typography>
				)}
				{status === "UNFOLLOWED" && strategyFollowerStatistics?.openPositionsCount > 0 && (
					<Typography>{t("control_panel_robots_table_status_standby")}</Typography>
				)}
			</Grid>
		</Grid>
	);
}
