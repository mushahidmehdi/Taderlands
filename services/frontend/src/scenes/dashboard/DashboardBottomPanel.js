import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { Grid, Paper, Typography } from "@mui/material";

import { ArrowRight, blueBg2, LeaderboardIcon, TrendStrategies, VectorStrokeLink } from "images";
import blueBackground from "images/blue-bg.png";

export default function DashboardBottomPanel() {
	const [isLoading, setLoading] = useState(false);
	const { t } = useTranslation("dashboard");
	const navigate = useNavigate();

	return (
		<Grid container spacing={2}>
			<Grid item xs={8}>
				<Paper sx={{ height: "283px" }}>
					<Grid container justifyContent="space-between">
						<Grid item xs={3}>
							<div
								style={{
									paddingLeft: "2vw",
									paddingTop: "5vh",
								}}
							>
								<Typography
									sx={{ cursor: "pointer", fontSize: "36px", fontWeight: 700, color: "#0F20E8" }}
									onClick={() => navigate("/marketplace")}
								>
									{t("dashboard_trend_strategies")}
								</Typography>
								<ArrowRight style={{ cursor: "pointer" }} />
							</div>
						</Grid>
						<Grid item>
							<div
								style={{
									height: "283px",
									width: "30vw",

									backgroundImage: `url(${blueBackground})`,
									backgroundRepeat: "no-repeat",
									backgroundPosition: "right",
								}}
							>
								<div style={{ position: "relative" }}>
									<div style={{ position: "absolute", right: 40, top: 30 }}>
										<TrendStrategies />
									</div>
								</div>
							</div>
						</Grid>
					</Grid>
				</Paper>
			</Grid>
			<Grid item xs={4}>
				<Grid container spacing={2}>
					<Grid item xs={6}>
						<Paper
							sx={{ borderRadius: "8px", height: "120px", cursor: "pointer" }}
							onClick={(x) => window.open("https://help.traderlands.com/", "_blank")}
						>
							<Typography padding={2} color={"#0F20E8"} fontWeight={700} fontSize={"16px"}>
								{t("dashboard_how_to_connect_exchange_card_title")}
							</Typography>
							<Grid item marginLeft={2}>
								<VectorStrokeLink />
							</Grid>
						</Paper>
					</Grid>
					<Grid item xs={6}>
						<Paper
							sx={{ borderRadius: "8px", height: "120px", cursor: "pointer" }}
							onClick={(x) => window.open("https://blog.traderlands.com/", "_blank")}
						>
							<Typography padding={2} color={"#0F20E8"} fontWeight={700} fontSize={"16px"}>
								{t("dashboard_go_to_community_page_card_title")}
							</Typography>
							<Grid item marginLeft={2} sx={{ cursor: "pointer" }}>
								<VectorStrokeLink />
							</Grid>
						</Paper>
					</Grid>
					<Grid item xs={12}>
						<Paper sx={{ borderRadius: "8px", height: "147px" }} onClick={() => {}}>
							<Grid container justifyContent="space-between">
								<Grid item xs={4} sx={{ cursor: "pointer" }} onClick={() => navigate("/marketplace")}>
									<div style={{ paddingLeft: "1vw", paddingTop: "2vh" }}>
										<Typography
											sx={{
												width: "8rem",
												fontSize: "20px",
												fontWeight: 700,
												color: "#0F20E8",
											}}
										>
											{t("dashboard_succesful_experts_card_title")}
										</Typography>
										<ArrowRight />
									</div>
								</Grid>
								<Grid item>
									<div
										style={{
											height: "147px",
											width: "15vw",

											borderRadius: "8px",

											backgroundImage: `url(${blueBg2})`,
											backgroundRepeat: "no-repeat",
											backgroundPosition: "right",
										}}
									>
										<div style={{ position: "relative" }}>
											<div style={{ position: "absolute", right: 20, top: 30 }}>
												<LeaderboardIcon />
											</div>
										</div>
									</div>
								</Grid>
							</Grid>
						</Paper>
					</Grid>
				</Grid>
			</Grid>
		</Grid>
	);
}
