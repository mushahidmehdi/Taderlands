import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import { Box, Button, Grid, Icon, Link, Paper, Typography } from "@mui/material";

import { EXCHANGE_TEXT_MAP } from "constants";

import { Breadcrumbs, RouteLayout } from "components";

import Config from "services/config";

import { Header } from "images";

export default function AddExchangeLinkInfo() {
	const { t, i18n } = useTranslation("accountCenter");
	const navigate = useNavigate();

	const { state } = useLocation();
	const { platformName, platform } = state;

	const handleNext = () => {
		navigate("../exchange-link/add-input", {
			state: { type: "add", platform: platform },
		});
		return;
	};

	return (
		<RouteLayout
			headerComp={
				<Breadcrumbs
					paths={[
						{
							text: t("account_center_menu_main_title"),
							onClick: () => navigate("/account-center"),
						},
						{
							text: t("account_center_connections_main_title"),
							onClick: () => navigate("/exchange-link"),
						},
						{
							text: t("account_center_connections_add_flow_connect_title"),
						},
					]}
				/>
			}
		>
			<Grid container sx={{ mb: 2 }}>
				<Grid item xs={12}>
					<Paper sx={{ backgroundColor: "#FFFFFF", padding: 4 }}>
						<Grid container>
							<Grid item xs={12}>
								<Typography sx={{ mt: 2, fontSize: "24px" }}>
									{t("account_center_connections_step_0_add_flow_sub_title")}
								</Typography>
							</Grid>
							<Grid item xs={12}>
								<Typography sx={{ mt: 2, fontSize: "14px" }}>
									{t("account_center_connections_step_0_add_flow_sub_text")}
								</Typography>
							</Grid>
							<Paper
								sx={{
									mt: 2,
									backgroundColor: "#F4F5FC",
									width: "80%",
									padding: 5,
									display: "flex",
									flexDirection: "column",
									alignItems: "center",
								}}
							>
								<Typography sx={{ mt: 2, textAlign: "center" }}>
									{t("account_center_connections_step_0_add_flow_info_title", {
										exchange: EXCHANGE_TEXT_MAP[platform?.exchange],
									})}
								</Typography>

								<Box
									sx={{
										display: "flex",
										flexDirection: "row",
										alignItems: "center",
										justifyContent: "center",
										mt: 5,
									}}
								>
									<Icon color="primary" sx={{ width: 70, height: 50 }}>
										<Header />
									</Icon>
									<Icon color="primary" sx={{ width: 50, height: 50, mt: 3, ml: 2 }}>
										<SwapHorizIcon />
									</Icon>
									<Box
										component="img"
										src={`${Config.cdnRoot()}/general/exchange-icons/${platform.exchange}.png`}
										sx={{ color: "#B5B5B5", width: 100, height: 100, ml: 1 }}
									/>
								</Box>

								<Typography sx={{ mt: 2, mb: 2 }}>
									{t("account_center_connections_add_flow_info_title")}
								</Typography>

								{platform?.connectionInfo?.[i18n.resolvedLanguage]?.steps?.map((item, ix) => (
									<Typography sx={{ mt: 2 }} key={ix}>
										{item}
									</Typography>
								))}

								<Box textAlign="center" sx={{ mt: 5 }}>
									<Link variant="body2" onClick={(x) => window.open(platform?.info?.source)}>
										{t("account_center_connections_update_flow_exchange_direction_text", {
											exchange: EXCHANGE_TEXT_MAP[platform.exchange],
										})}
									</Link>
								</Box>
							</Paper>
						</Grid>
					</Paper>
				</Grid>
				<Grid item xs={8} sx={{ mt: 2 }}></Grid>
				<Grid item xs={4} sx={{ mt: 2 }}>
					<Button variant="contained" fullWidth onClick={handleNext}>
						{t("common:Next")}
					</Button>
				</Grid>
			</Grid>
		</RouteLayout>
	);
}
