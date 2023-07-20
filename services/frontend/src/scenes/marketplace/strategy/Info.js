import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";

import { Grid, Tab, Tabs, Typography, useTheme } from "@mui/material";
import { Box } from "@mui/system";

import { Chip } from "components";

import shortenNumber from "utils/shortenNumber";

import { InfoBlue } from "images";

import useStatisticsMap from "./Constants";
import { MarketStrategyContext } from "./Strategy";

const Explanation = ({ text, labels, strategyFollowers }) => {
	const { t } = useTranslation("marketplace");

	return (
		<Grid sx={{ p: 2 }}>
			<Typography sx={{ fontWeight: 700 }}>
				{t("marketplace_strategy_page_explanation_tab_features_title")}
			</Typography>
			{labels?.map((label, ix) => (
				<Chip
					key={ix}
					variant="contained"
					backgroundColor={"#0F20E8"}
					label={label}
					sx={{ fontSize: "12px", ml: 1, mt: 1 }}
				/>
			))}
			{strategyFollowers?.[0].positionSettings.leverage && (
				<Chip
					variant="contained"
					backgroundColor={"#F4F5FC"}
					label={strategyFollowers?.[0].positionSettings.leverage + "X"}
					sx={{ fontSize: "12px", ml: 1, mt: 1, color: "#0F20E8" }}
				/>
			)}

			<Typography sx={{ fontWeight: 700, mt: 2 }}>
				{t("marketplace_strategy_page_explanation_tab_explanation_title")}
			</Typography>
			<Typography>{text}</Typography>
		</Grid>
	);
};

const Brief = ({ statistics }) => {
	const { t } = useTranslation("marketplace");
	const { statisticsMap } = useStatisticsMap();

	return (
		<Grid container sx={{ p: 2 }}>
			{Object.keys(statisticsMap).map((key, ix) => (
				<Grid key={ix} container spacing={2}>
					<Grid item xs={10}>
						<Typography sx={{ fontSize: "14px", fontWeight: 700 }}>{statisticsMap[key]?.label}</Typography>
					</Grid>
					<Grid item xs={2}>
						<Typography sx={{ color: (theme) => theme.palette.primary.main }}>
							{statistics?.[key]
								? `${statisticsMap?.[key]?.price ? "$" : ""}${shortenNumber(
										statistics?.[key] * (statisticsMap?.[key]?.multiplier ?? 1)
								  )}${statisticsMap?.[key]?.percent ? "%" : ""}`
								: "0"}
						</Typography>
					</Grid>
				</Grid>
			))}
			<Grid container spacing={2}>
				<Grid item xs={12}>
					<Typography sx={{ color: "#6A1FC2", marginTop: "1rem" }}>
						{t("marketplace_strategy_note")}
					</Typography>
				</Grid>
			</Grid>
		</Grid>
	);
};

function a11yProps(index) {
	return {
		id: `simple-tab-${index}`,
		"aria-controls": `simple-tabpanel-${index}`,
	};
}

const Safety = () => {
	const theme = useTheme();
	const { t } = useTranslation("marketplace");
	return (
		<Grid container sx={{ p: 2 }}>
			<Grid item xs={0.7}>
				<InfoBlue style={{ marginTop: 5 }} />
			</Grid>
			<Grid item xs={11.3}>
				<Typography
					sx={{
						fontSize: "0.8rem",
						[theme.breakpoints.up("md")]: {
							ml: 3,
						},
						[theme.breakpoints.up("lg")]: {
							ml: 2,
						},
						[theme.breakpoints.up("xl")]: {
							ml: 1,
						},
					}}
				>
					{t("marketplace_strategy_info")}
				</Typography>
			</Grid>
		</Grid>
	);
};

export default function Info() {
	const { marketStrategy } = useContext(MarketStrategyContext);
	const { strategy, explanations } = marketStrategy;
	const { labels, strategyStatistics, strategyFollowers } = strategy;
	const { t } = useTranslation("marketplace");
	const theme = useTheme();

	const [tab, setTab] = useState(0);

	const { i18n } = useTranslation();

	return (
		<>
			<Box sx={{ borderRadius: "8px", backgroundColor: "white" }}>
				<Tabs
					variant="fullWidth"
					centered
					value={tab}
					onChange={(_, newValue) => {
						setTab(newValue);
					}}
				>
					<Tab fullWidth label={t("marketplace_strategy_page_explanation_tab_title")} {...a11yProps(0)}></Tab>
					<Tab fullWidth label={t("marketplace_strategy_page_brief_tab_title")} {...a11yProps(1)}></Tab>
				</Tabs>
				{tab === 0 && (
					<Explanation
						labels={labels}
						text={explanations[i18n.resolvedLanguage]?.text}
						strategyFollowers={strategyFollowers}
					/>
				)}
				{tab === 1 && <Brief statistics={strategyStatistics} />}
			</Box>
			<Box
				sx={{
					[theme.breakpoints.up("lg")]: {
						height: "7rem",
					},
					[theme.breakpoints.up("xl")]: {
						height: "5rem",
					},
					borderRadius: "8px",
					backgroundColor: "white",
					marginTop: "0.2875rem",
				}}
			>
				<Safety />
			</Box>
		</>
	);
}
