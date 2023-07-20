import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import { Box, Button, Grid, Icon, IconButton, Paper, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { Breadcrumbs, Dialog, RouteLayout } from "components";

import { useUserApi } from "api/user";

import useCopyToClipboard from "utils/useCopyToClipboard";

import { Check, Duplicate, Telegram, TelegramTraderLogo } from "images";

export default function TelegramInfo() {
	const [telegramCode, setTelegramCode] = useState();
	const [successOpen, setSuccessOpen] = useState(false);

	const { t } = useTranslation("accountCenter");
	const navigate = useNavigate();
	const theme = useTheme();
	const { createTelegramCode } = useUserApi();
	const copyToClipboard = useCopyToClipboard();

	const handleNext = () => {
		createTelegramCode().then((data) => setTelegramCode(data?.data?.telegramCode));
	};

	const handleSuccessClose = () => {
		setSuccessOpen(false);
		navigate("/notification-settings");
	};

	useEffect(() => {
		if (telegramCode) {
			setSuccessOpen(true);
		}
	}, [telegramCode]);

	const SuccessDialog = () => (
		<Dialog
			dialogProps={{ open: successOpen, onClose: handleSuccessClose }}
			content={
				<>
					<Typography fontWeight={"Bold"} sx={{ mt: 2, textAlign: "center", fontSize: "24px" }}>
						{t("account_center_notifications_telegram_auth_code_modal_title")}
					</Typography>
					<Typography sx={{ mt: 2, textAlign: "center", fontSize: "14px" }}>
						{t("account_center_notifications_telegram_auth_code_modal_text")}
					</Typography>
					{telegramCode && (
						<Paper
							sx={{
								mt: 2,
								backgroundColor: "#F4F5FC",
								padding: 1,
								display: "flex",
								flexDirection: "column",
								alignItems: "center",
							}}
						>
							<Grid container>
								<Grid item xs={10}>
									<Typography fontWeight={"Bold"} sx={{ fontSize: "14px" }}>
										{telegramCode}
									</Typography>
								</Grid>
								<Grid item xs={2}>
									<IconButton
										onClick={(e) => {
											copyToClipboard(telegramCode);
										}}
										sx={{ ml: 0.5, mt: -1 }}
									>
										<Duplicate />
									</IconButton>
								</Grid>
							</Grid>
						</Paper>
					)}
					<Button
						variant="outlined"
						sx={{ width: 300, mt: 2 }}
						color="primary"
						onClick={() => handleSuccessClose()}
					>
						{t("account_center_notifications_telegram_auth_code_modal_close_button")}
					</Button>
				</>
			}
		></Dialog>
	);

	return (
		<>
			{successOpen && <SuccessDialog />}
			<RouteLayout
				headerComp={
					<Breadcrumbs
						paths={[
							{
								text: t("account_center_notifications_main_title"),
								onClick: () => navigate("/notification-settings"),
							},
							{
								text: "Telegram",
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
										{t("account_center_notifications_telegram_auth_code_title")}
									</Typography>
								</Grid>
								<Grid item xs={12}>
									<Typography sx={{ mt: 2, fontSize: "14px" }}>
										{t("account_center_notifications_telegram_auth_code_text_1")}
										<a href="https://t.me/TraderlandsBot" target="_blank" rel="noopener noreferrer">
											@traderlandsbot
										</a>
										{t("account_center_notifications_telegram_auth_code_text_2")}
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
										{t("account_center_notifications_telegram_auth_code_steps_title")}
									</Typography>

									<Box
										sx={{
											display: "flex",
											flexDirection: "row",
											alignItems: "center",
											justifyContent: "center",
											mt: 3,
										}}
									>
										<Icon
											color="primary"
											sx={{
												width: 64,
												height: 64,
												backgroundColor: "white",
												borderRadius: "0.4rem",
												justifyContent: "center",
											}}
										>
											<Box sx={{ mt: "25%" }}>
												<TelegramTraderLogo />
											</Box>
										</Icon>
										<Icon color="primary" sx={{ width: 64, height: 64, mt: 5 }}>
											<SwapHorizIcon />
										</Icon>
										<Icon sx={{ width: 64, height: 64 }}>
											<Telegram />
										</Icon>
									</Box>
									<Grid container>
										<Grid item xs={12}>
											<Typography
												fontWeight={"Bold"}
												sx={{ fontSize: "14px", textAlign: "center", mt: 2 }}
											>
												{t("account_center_notifications_telegram_auth_code_steps_sub_title")}
											</Typography>
										</Grid>
										<Grid item xs={3} sx={{ textAlign: "right", alignContent: "center", mt: 2 }}>
											<Check color={theme.palette.primary.main} />
										</Grid>
										<Grid item xs={9}>
											<Typography sx={{ fontSize: "14px", ml: 2, mt: 2 }}>
												{t("account_center_notifications_telegram_auth_code_step_1_1")}
												<a
													href="https://t.me/TraderlandsBot"
													target="_blank"
													rel="noopener noreferrer"
												>
													@traderlandsbot
												</a>
												{t("account_center_notifications_telegram_auth_code_step_1_2")}
											</Typography>
										</Grid>
										<Grid item xs={3} sx={{ textAlign: "right", alignContent: "center", mt: 2 }}>
											<Check color={theme.palette.primary.main} />
										</Grid>
										<Grid item xs={9}>
											<Typography sx={{ fontSize: "14px", ml: 2, mt: 2 }}>
												{t("account_center_notifications_telegram_auth_code_step_2")}
											</Typography>
										</Grid>
										<Grid item xs={3} sx={{ textAlign: "right", alignContent: "center", mt: 2 }}>
											<Check color={theme.palette.primary.main} />
										</Grid>
										<Grid item xs={9}>
											<Typography sx={{ fontSize: "14px", ml: 2, mt: 2 }}>
												{t("account_center_notifications_telegram_auth_code_step_3")}
											</Typography>
										</Grid>
									</Grid>
									<Button variant="contained" sx={{ mt: 2 }} onClick={handleNext}>
										{t("account_center_notifications_telegram_auth_code_show_code")}
									</Button>
								</Paper>
							</Grid>
						</Paper>
					</Grid>
				</Grid>
			</RouteLayout>
		</>
	);
}
