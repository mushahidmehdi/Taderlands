import React from "react";
import { useTranslation } from "react-i18next";

import { Grid } from "@mui/material";

import dayjs from "dayjs";

import { SmallText } from "components";

import { Config } from "services";

import { SpotRight } from "images";

export default function Info({ backtest }) {
	const { t } = useTranslation("workshop");

	return (
		<>
			<Grid item>
				<Grid container spacing={1} sx={{ width: "100px" }}>
					<Grid item>
						<img
							style={{ marginTop: "8px" }}
							loading="lazy"
							width="20"
							src={`${Config.cdnRoot()}/general/crypto-icons/${backtest?.parity.base}.png`}
							alt=""
						/>
					</Grid>
					<Grid item>
						<span>{backtest?.parity.base}</span>
						<div>
							<SpotRight />
							<span style={{ marginLeft: "4px", fontSize: "12px", color: "#AEAEAE" }}>
								{backtest?.parity.quote}
							</span>
						</div>
					</Grid>
				</Grid>
			</Grid>
			<Grid item sx={{ width: "125px" }}>
				<SmallText>{t("workshop_backtest_previous_results_table_title_1")}</SmallText>
				<SmallText sx={{ color: (theme) => theme.palette.primary.main }}>{backtest?.strategy?.name}</SmallText>
			</Grid>
			<Grid item>
				<SmallText>{t("workshop_backtest_previous_results_table_title_2")}</SmallText>
				<SmallText sx={{ color: (theme) => theme.palette.primary.main }}>
					{backtest?.strategy?.platform.name}
				</SmallText>
			</Grid>
			<Grid item>
				<SmallText>{t("workshop_backtest_previous_results_table_title_3")}</SmallText>
				<SmallText sx={{ color: (theme) => theme.palette.primary.main }}>{backtest.executionType}</SmallText>
			</Grid>
			<Grid item>
				<SmallText>{t("workshop_backtest_previous_results_table_title_4")}</SmallText>
				<SmallText sx={{ color: (theme) => theme.palette.primary.main }}>
					{`${dayjs(backtest.startDate).format("DD/MM/YYYY") ?? ""} - ${
						dayjs(backtest.endDate).format("DD/MM/YYYY") ?? ""
					}`}
				</SmallText>
			</Grid>
			<Grid item>
				<SmallText>{t("workshop_backtest_previous_results_table_title_5")}</SmallText>
				<SmallText sx={{ color: (theme) => theme.palette.primary.main }}>
					{dayjs(backtest.createdAt).format("HH:mm:ss DD/MM/YYYY")}
				</SmallText>
			</Grid>
			<Grid item>
				<SmallText>{t("workshop_backtest_previous_results_table_title_6")}</SmallText>
				<SmallText sx={{ color: (theme) => theme.palette.primary.main }}>
					{t(`workshop_backtest_previous_results_status_${backtest.status}`)}
				</SmallText>
			</Grid>
		</>
	);
}
