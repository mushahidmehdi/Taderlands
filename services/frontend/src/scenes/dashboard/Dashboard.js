import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import { Circle as CircleIcon } from "@mui/icons-material";
import { Box, Button, Grid, Paper, Typography } from "@mui/material";

import { Dialog, RouteLayout } from "components";
import { Positions } from "components/Positions";
import { prepareRateMessage } from "components/Positions/utils";

import { useDashboardApi } from "api/dashboard";
import { usePositionApi } from "api/position";
import { useStrategyApi } from "api/strategy";

import ClientFeeder from "services/ClientFeeder";

import useQuery from "utils/useQuery";

import { RewardCredit, UriGray2 } from "images";

import DashboardBottomPanel from "./DashboardBottomPanel";
import DashboardSkeleton from "./DashboardSkeleton";
import Portfolio from "./Portfolio";
import Robots from "./Robots";

export default function Dashboard() {
	const { profile } = useSelector((state) => state.user);

	const [openReward, setOpenReward] = useState();

	const [processing, setProcessing] = useState(true);
	const [positions, setPositions] = useState([]);
	const [portfolio, setPortfolio] = useState();
	const [summary, setSummary] = useState();
	const [strategies, setStrategies] = useState();
	const [openTab, setOpenTab] = useState("open");

	const { t } = useTranslation("dashboard");
	const query = useQuery();

	const { getPortfolio, getSummary } = useDashboardApi();
	const { getPositions } = usePositionApi();
	const { getFollowedStrategies } = useStrategyApi();

	const onTabChange = (tab) => {
		setOpenTab(tab);
	};

	useEffect(() => {
		if (query.get("welcome")) {
			setOpenReward(true);
		}

		Promise.all([
			getPositions({
				where: {
					status: openTab === "open" ? "OPEN" : "CLOSED",
					includeVirtual: false,
					pageNumber: 0,
					pageSize: 50,
				},
			}).then((data) => setPositions(data)),

			getPortfolio().then((data) => setPortfolio(data)),
			getSummary().then((data) => setSummary(data)),
			getFollowedStrategies().then((data) => setStrategies(data)),
		])
			.then((data) => {
				setProcessing(false);
			})
			.catch((err) => {
				console.log("Error occurred: ", err);
			});
	}, []);

	useEffect(() => {
		if (openTab) {
			getPositions({
				where: {
					status: openTab === "open" ? "OPEN" : "CLOSED",
					includeVirtual: false,
					pageNumber: 0,
					pageSize: 50,
				},
			}).then((data) => setPositions(data));
		}
	}, [openTab]);

	return (
		<>
			{processing ? (
				<DashboardSkeleton />
			) : (
				<RouteLayout header={t("dashboard_main_title")}>
					<div style={{ marginRight: "4vw" }}>
						<Grid container spacing={2}>
							<Grid item xs={12} sx={{ mt: 2 }}>
								<Grid container spacing={2}>
									<Grid item xs={8}>
										<Portfolio
											portfolio={portfolio}
											summary={summary}
											onRefresh={() => {
												Promise.all([getPortfolio(), getSummary()]).then(() => {});
											}}
										/>
									</Grid>
									<Grid item xs={4}>
										<>
											{!strategies?.length && (
												<Paper
													sx={{
														backgroundColor: "#FFFFFF",
														ml: 1,
														px: 2,
														display: "flex",
														justifyContent: "center",
														height: "100%",
														alignItems: "center",
														flexDirection: "column",
													}}
												>
													<Typography fontWeight={700} fontSize={"24px"} sx={{}}>
														{t("dashboard_no_robot_right_paper_title")}
													</Typography>
													<Box sx={{ justifyContent: "center", mt: 2 }}>
														<UriGray2 />
													</Box>
													<Box sx={{ mt: 1, textAlign: "center" }}>
														<Typography sx={{ align: "center" }}>
															{t("dashboard_no_robot_right_paper_text")}
														</Typography>
													</Box>
												</Paper>
											)}
											{strategies?.length > 0 && <Robots strategies={strategies} />}
										</>
									</Grid>
								</Grid>
							</Grid>

							{!strategies.length && (
								<Grid item xs={12}>
									<DashboardBottomPanel />
								</Grid>
							)}

							{strategies.length > 0 && (
								<Grid item xs={12} sx={{ mt: 2 }}>
									<Grid container direction={"row"}>
										{["open", "closed"].map((tab) => (
											<Grid key={tab} item>
												<Button
													size="large"
													sx={{
														fontSize: "1.25rem",
														...(tab !== openTab ? { color: "#AEAEAE" } : {}),
													}}
													startIcon={
														tab === openTab ? (
															<CircleIcon sx={{ width: 8, height: 8 }} />
														) : (
															<></>
														)
													}
													onClick={() => onTabChange(tab)}
												>
													{t(`dashboard_${tab}_positions_title`)}
												</Button>
											</Grid>
										))}
									</Grid>
									<Positions
										positions={positions}
										filter={{ where: { status: openTab === "open" ? "OPEN" : "CLOSED" } }}
									/>
								</Grid>
							)}
						</Grid>
					</div>

					{openReward && (
						<Dialog
							dialogProps={{ open: openReward, onClose: () => setOpenReward(false) }}
							content={
								<>
									<RewardCredit
										style={{
											maxWidth: "100%",
										}}
									/>
									<Typography
										fontWeight={"Bold"}
										sx={{
											color: (theme) => theme.palette.primary.main,
											mt: 2,
											textAlign: "center",
											fontSize: "32px",
										}}
									>
										{t("dashboard_welcome_title")}
									</Typography>
									<Typography
										fontWeight={"Bold"}
										sx={{
											color: "#000",
											mt: 2,
											textAlign: "center",
											fontSize: "24px",
										}}
									>
										{t("dashboard_welcome_text_1")}
									</Typography>
									<Typography
										fontWeight={"Bold"}
										sx={{
											color: "#000",
											mt: 2,
											textAlign: "center",
											fontSize: "14px",
										}}
									>
										{t("dashboard_welcome_text_2")}
									</Typography>
									<Button variant="contained" sx={{ width: "100%", mt: 3, p: 1.5 }} color="primary">
										{t("dashboard_welcome_btn_text")}
									</Button>
								</>
							}
						/>
					)}
					{positions?.length ? <ClientFeeder data={JSON.stringify(prepareRateMessage(positions))} /> : <></>}
				</RouteLayout>
			)}
		</>
	);
}
