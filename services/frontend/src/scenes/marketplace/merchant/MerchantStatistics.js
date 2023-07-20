import React from "react";
import { useTranslation } from "react-i18next";

import { Grid, Icon, Paper, Typography } from "@mui/material";

import shortenNumber from "utils/shortenNumber";

import { Follower, Popular } from "images";

export default function MerchantStatistics({ merchantStatistics }) {
	const { t } = useTranslation("marketplace");

	const StatisticCard = ({ icon, text, value }) => (
		<Paper
			sx={{
				backgroundColor: "#FFFFFF",
				py: 3,
				px: 2,
				display: "flex",
				flexDirection: "column",
				alignItems: "start",
				ml: 1,
				mt: 1,
				height: "160px",
			}}
		>
			{icon && (
				<Icon
					sx={{
						height: 60,
						width: 60,
					}}
				>
					{icon}
				</Icon>
			)}
			<Typography
				sx={{
					fontSize: "24px",
					fontWeight: 700,
					textAlign: "start",
					color: (theme) => theme.palette.primary.main,
				}}
			>
				{text}
			</Typography>
			<Typography
				sx={{
					fontSize: "32px",
					fontWeight: 700,
					mt: "2px",
					mb: "4px",
				}}
			>
				{value}
			</Typography>
		</Paper>
	);

	return (
		<React.Fragment>
			<Grid container>
				<Grid item xs={6}>
					<StatisticCard
						text={t("marketplace_merchant_profile_total_volume_title")}
						value={
							merchantStatistics?.totalVolume ? "$" + shortenNumber(merchantStatistics?.totalVolume) : ""
						}
					></StatisticCard>
				</Grid>
				<Grid item xs={6}>
					<StatisticCard
						icon={<Follower />}
						text={t("marketplace_merchant_profile_followers_count_title")}
						value={merchantStatistics?.followersCount ? merchantStatistics?.followersCount : ""}
					></StatisticCard>
				</Grid>
				<Grid item xs={6}>
					<StatisticCard
						text={t("marketplace_merchant_profile_total_profit_title")}
						value={
							merchantStatistics?.totalProfit ? "$" + shortenNumber(merchantStatistics?.totalProfit) : ""
						}
					></StatisticCard>
				</Grid>
				<Grid item xs={6}>
					<StatisticCard
						icon={<Popular />}
						text={t("marketplace_merchant_profile_success_rate_title")}
						value={merchantStatistics?.successRate ? merchantStatistics.successRate?.toFixed(2) + "%" : ""}
					></StatisticCard>
				</Grid>
			</Grid>
		</React.Fragment>
	);
}
