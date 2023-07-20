import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Carousel from "react-material-ui-carousel";
import { useNavigate } from "react-router-dom";

import { Box, Button, Card, CardContent, Grid, Icon, IconButton, Paper, Typography } from "@mui/material";

import Config from "services/config";

import shortenNumber from "utils/shortenNumber";

import { ArrowMiniLeft, ArrowMiniRight, AverageProfit, Lightning, Manage, Plus, SpotUp2, Switch } from "images";

import PortfolioDialog from "./PortfolioDialog";

export default function Portfolio({ portfolio, summary, onRefresh }) {
	const [currentPlatform, setCurrentPlatform] = useState();
	const [dialogOpen, setDialogOpen] = useState(false);

	const { t } = useTranslation("dashboard");
	const navigate = useNavigate();

	const onDetailsClick = (item) => {
		setCurrentPlatform(item);
		setDialogOpen(true);
	};

	const handleExchange = () => {
		navigate("/exchange-link");
	};

	const AssetCard = ({ item }) => (
		<Card variant="outlined" sx={{ border: 0, mt: 2 }}>
			<CardContent
				sx={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
				}}
			>
				<Box
					component="img"
					src={`${Config.cdnRoot()}/general/exchange-icons/${item?.platform?.exchange}.png`}
					sx={{ width: 90, height: 90 }}
				/>
				<Typography
					sx={{
						fontSize: "16px",
						fontWeight: 700,
						mt: 1,
					}}
				>
					{item?.platform?.name}
				</Typography>
				<Typography
					sx={{
						fontSize: "24px",
						color: (theme) => theme.palette.primary.main,
						mt: 1,
					}}
				>
					{`$${
						item?.stableAmounts?.totalUsdtAmount
							? shortenNumber(item?.stableAmounts?.totalUsdtAmount)
							: "0.00"
					}`}
				</Typography>
				<Button variant="text" sx={{ fontSize: "12px", mt: 1 }} onClick={(e) => onDetailsClick(item)}>
					{t("dashboard_portfolio_details_title")}
				</Button>
			</CardContent>
		</Card>
	);

	return (
		<React.Fragment>
			{currentPlatform && currentPlatform?.portfolio?.assets && (
				<PortfolioDialog
					dialogOpen={dialogOpen}
					setDialogOpen={setDialogOpen}
					item={currentPlatform}
				></PortfolioDialog>
			)}
			<Grid container>
				<Grid item xs={6}>
					<Typography
						sx={{
							display: "flex",
							flexDirection: "row",
							fontSize: "24px",
							fontWeight: 700,
							color: (theme) => theme.palette.primary.main,
						}}
					>
						{t("dashboard_portfolio_title")}
					</Typography>
				</Grid>
				<Grid item xs={8} sx={{ display: "flex", flexDirection: "row", alignItems: "start" }}>
					<Typography
						sx={{
							fontSize: "24px",
							color: (theme) => theme.palette.secondary.main,
						}}
					>
						{`$${shortenNumber(
							portfolio?.reduce(function (a, b) {
								return a + b["stableAmounts"]["totalUsdtAmount"];
							}, 0)
						)}`}
					</Typography>
					<IconButton onClick={onRefresh}>
						<Switch />
					</IconButton>
				</Grid>

				<Grid item xs={12}>
					<Grid container>
						<Grid item xs={6}>
							<Paper
								sx={{
									backgroundColor: "#FFFFFF",
									padding: 2,
									height: "310px",
								}}
							>
								{!portfolio.length && (
									<Grid
										container
										spacing={0}
										align="center"
										justifyContent="center"
										direction="column"
									>
										<Grid item>
											<div style={{ marginTop: "100px" }}>
												<Box
													onClick={handleExchange}
													display="flex"
													alignItems="center"
													justifyContent="center"
													sx={{
														border: "2px dotted #e5e6fb",
														borderRadius: "0.4rem",
														width: "3rem",
														height: "3rem",
														cursor: "pointer",
													}}
												>
													<Plus />
												</Box>

												<Typography
													sx={{
														color: (theme) => theme.palette.primary.main,
														fontWeight: 700,
														mt: 3,
													}}
												>
													{t("dashboard_portfolio_add_exchange_card")}
												</Typography>
											</div>
										</Grid>
									</Grid>
								)}
								{portfolio && (
									<Carousel
										indicators={false}
										navButtonsAlwaysVisible={true}
										NextIcon={<ArrowMiniRight />}
										PrevIcon={<ArrowMiniLeft />}
										navButtonsProps={{
											style: {
												backgroundColor: "transparent",
											},
										}}
									>
										{portfolio?.map((item, i) => (
											<AssetCard key={i} item={item} />
										))}
									</Carousel>
								)}
							</Paper>
						</Grid>
						<Grid item xs={6}>
							<Grid container>
								<Grid item xs={6}>
									<Paper
										sx={{
											backgroundColor: "#FFFFFF",
											py: 3,
											px: 2,
											display: "flex",
											flexDirection: "column",
											alignItems: "center",
											ml: 1,
											height: "151px",
										}}
									>
										<Icon
											sx={{
												width: 25,
												height: 35,
											}}
										>
											<Manage />
										</Icon>
										<Typography
											sx={{
												fontSize: "16px",
												fontWeight: 700,
												textAlign: "center",
											}}
										>
											{t("dashboard_info_position_count")}
										</Typography>
										<Typography
											sx={{
												fontSize: "24px",
												fontWeight: 700,
												color: (theme) => theme.palette.primary.main,
												mt: "2px",
												mb: "4px",
											}}
										>
											{summary?.totalPositionCount}
										</Typography>
									</Paper>
								</Grid>
								<Grid item xs={6}>
									<Paper
										sx={{
											backgroundColor: "#FFFFFF",
											py: 3,
											px: 2,
											display: "flex",
											flexDirection: "column",
											alignItems: "center",
											ml: 1,
											height: "151px",
										}}
									>
										<Icon
											sx={{
												width: 25,
												height: 35,
											}}
										>
											<Lightning />
										</Icon>
										<Typography
											sx={{
												fontSize: "16px",
												fontWeight: 700,
												mt: "16px",
												textAlign: "center",
											}}
										>
											{t("dashboard_info_success_rate")}
										</Typography>
										<Typography
											sx={{
												fontSize: "24px",
												fontWeight: 700,
												color: (theme) => theme.palette.primary.main,
												mt: "4px",
											}}
										>
											{summary?.successRate && `${summary?.successRate}%`}
										</Typography>
									</Paper>
								</Grid>
								<Grid item xs={6}>
									<Paper
										sx={{
											backgroundColor: "#FFFFFF",
											py: 3,
											px: 2,
											display: "flex",
											flexDirection: "column",
											alignItems: "center",
											ml: 1,
											mt: 1,
											height: "151px",
										}}
									>
										<Icon
											sx={{
												width: 25,
												height: 25,
											}}
										>
											<AverageProfit />
										</Icon>
										<Typography
											sx={{
												fontSize: "16px",
												fontWeight: 700,
												textAlign: "center",
												mt: "4px",
											}}
										>
											{t("dashboard_info_average_profit")}
										</Typography>
										<Typography
											sx={{
												fontSize: "24px",
												fontWeight: 700,
												color: (theme) => theme.palette.primary.main,
												mt: "4px",
											}}
										>
											{`${summary?.averageProfit ? shortenNumber(summary?.averageProfit) : "0"}%`}
										</Typography>
									</Paper>
								</Grid>
								<Grid item xs={6}>
									<Paper
										sx={{
											backgroundColor: "#FFFFFF",
											py: 3,
											px: 2,
											display: "flex",
											flexDirection: "column",
											alignItems: "center",
											ml: 1,
											mt: 1,
											height: "151px",
										}}
									>
										<Icon
											sx={{
												width: 26,
												height: 25,
											}}
										>
											<SpotUp2 />
										</Icon>
										<Typography
											sx={{
												fontSize: "16px",
												fontWeight: 700,
												textAlign: "center",
												mt: "2px",
											}}
										>
											{t("dashboard_info_total_profit")}
										</Typography>
										<Typography
											sx={{
												fontSize: "24px",
												fontWeight: 700,
												color: (theme) => theme.palette.primary.main,
												mt: "4px",
											}}
										>
											{summary?.totalProfitAmount
												? `$${shortenNumber(summary?.totalProfitAmount)}`
												: `$0.00`}
										</Typography>
									</Paper>
								</Grid>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</React.Fragment>
	);
}
