import React from "react";
import { useTranslation } from "react-i18next";

import { Grid, Typography } from "@mui/material";

import { Bolt as BoltSvg, Standby as StandbySvg, Stop as StopSvg } from "images";

export default function Status({ status }) {
	const { t } = useTranslation();

	return (
		<Grid container>
			<Grid item xs={12}>
				{status === "SHORT" && <BoltSvg />}
				{status === "SPOT" && <StopSvg />}
				{status === "LONG" && <StandbySvg />}
			</Grid>
			<Grid item xs={12}>
				{status === "SHORT" && (
					<Typography sx={{ color: "#0F20E8", fontSize: "12px" }}>{t("strategy.on")}</Typography>
				)}
				{status === "SPOT" && (
					<Typography sx={{ color: "#AEAEAE", fontSize: "12px" }}>{t("strategy.off")}</Typography>
				)}
				{status === "LONG" && (
					<Typography sx={{ color: "#0F20E8", fontSize: "12px" }}>{t("strategy.standby")}</Typography>
				)}
			</Grid>
		</Grid>
	);
}
