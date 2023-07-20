import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

import { Box, Button, Grid, Icon, IconButton, Paper, Typography } from "@mui/material";

import { useSnackbar } from "notistack";

import { Breadcrumbs, OtpDialog, RouteLayout } from "components";

import { useUserApi } from "api/user";

import useCopyToClipboard from "utils/useCopyToClipboard";

import { AppStore, Duplicate, GooglePlay, Line, Step1, Step2 } from "images";

import useOperations from "./Operations";

export default function C2faInfo() {
	const [open, setOpen] = useState();

	const navigate = useNavigate();
	const { enqueueSnackbar } = useSnackbar();
	const { t } = useTranslation("accountCenter");
	const { state } = useLocation();
	const { key, qr } = state;
	const { operations } = useOperations({ c2faKey: key });
	const copyToClipboard = useCopyToClipboard();
	const { createTwoFaSettings } = useUserApi();

	const handleNext = () => {
		setOpen(true);
	};

	const handleOtpComplete = ({ twofaCode }) => {
		createTwoFaSettings(key, twofaCode).then((data) => {
			setOpen();
			enqueueSnackbar(t("Two FA security is activated successfully."), { variant: "success" });
			navigate("/security");
		});
	};

	return (
		<RouteLayout
			headerComp={
				<Breadcrumbs
					paths={[
						{
							text: t("common:Account Center"),
							onClick: () => navigate("/account-center"),
						},
						{
							text: t("account_center_security_2fa_main_title"),
						},
					]}
				/>
			}
		>
			{open && (
				<OtpDialog
					open={open}
					onClose={() => setOpen()}
					onNext={handleOtpComplete}
					title={operations.twoFA.otp[true].title}
					explanation={operations.twoFA.otp[true].text}
					settings={{
						twofaSecurityActive: true,
					}}
				/>
			)}
			<Grid container>
				<Grid item xs={12}>
					<Paper sx={{ mt: 2, backgroundColor: "#FFFFFF", width: "80%", padding: 5 }}>
						<Grid container>
							<Grid item xs={12}>
								<Typography fontWeight={"Bold"} sx={{ fontSize: "24px" }}>
									{t("account_center_security_2fa_page_main_title")}
								</Typography>
							</Grid>
							<Grid item xs={12}>
								<Typography sx={{ mt: 2, fontSize: "14px" }}>
									{t("account_center_security_2fa_page_main_text")}
								</Typography>
							</Grid>
							<Grid item xs={0.5} sx={{ mt: 5 }}>
								<Icon sx={{ mt: 1, width: 25, height: 25 }}>
									<Step1 />
								</Icon>
							</Grid>
							<Grid item xs={11.5} sx={{ mt: 5 }}>
								<Grid container>
									<Grid item xs={12}>
										<Typography fontWeight={"Bold"} sx={{ fontSize: "16px" }}>
											{t("account_center_security_2fa_page_app_title")}
										</Typography>
									</Grid>
									<Grid item xs={12}>
										<Typography sx={{ fontSize: "14px" }}>
											{t("account_center_security_2fa_page_app_text")}
										</Typography>
									</Grid>
								</Grid>
							</Grid>
							<Grid item xs={0.5} sx={{ mt: 1 }}>
								<Icon sx={{ height: 90 }}>
									<Line />
								</Icon>
							</Grid>
							<Grid item xs={11.5} sx={{ mt: 3 }}>
								<IconButton
									onClick={(e) =>
										window.open(
											"https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2"
										)
									}
								>
									<GooglePlay />
								</IconButton>
								<IconButton
									onClick={(e) =>
										window.open("https://apps.apple.com/tr/app/google-authenticator/id388497605")
									}
								>
									<AppStore />
								</IconButton>
							</Grid>
							<Grid item xs={0.5} sx={{ mt: 1 }}>
								<Icon sx={{ mt: 1, width: 25, height: 25 }}>
									<Step2 />
								</Icon>
							</Grid>
							<Grid item xs={11.5} sx={{ mt: 1 }}>
								<Grid container>
									<Grid item xs={12}>
										<Typography fontWeight={"Bold"} sx={{ fontSize: "16px" }}>
											{t("account_center_security_2fa_page_install_title")}
										</Typography>
									</Grid>
									<Grid item xs={12}>
										<Typography sx={{ fontSize: "14px" }}>
											{t("account_center_security_2fa_page_install_text")}
										</Typography>
									</Grid>
								</Grid>
							</Grid>
							{key && (
								<Box
									sx={{
										display: "flex",
										flexDirection: "column",
										alignItems: "center",
										width: "100%",
									}}
								>
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
										<Typography sx={{ fontSize: "14px" }}>
											{t("account_center_security_2fa_page_install_title")}
										</Typography>

										<Grid container>
											<Grid item xs={11}>
												<Typography fontWeight={"Bold"} sx={{ fontSize: "14px" }}>
													{key}
												</Typography>
											</Grid>

											<Grid item xs={1}>
												<IconButton
													onClick={(e) => {
														copyToClipboard(key);
													}}
													sx={{ ml: 0.7, mt: -1 }}
												>
													<Duplicate />
												</IconButton>
											</Grid>
										</Grid>
									</Paper>

									<Typography sx={{ fontSize: "14px", mt: 2, alignSelf: "center" }}>
										{t("account_center_security_2fa_page_or_text")}
									</Typography>

									<Box component="img" src={qr}></Box>
								</Box>
							)}
						</Grid>
					</Paper>
				</Grid>
				<Grid item xs={8} sx={{ mt: 5 }}></Grid>
				<Grid item xs={4} sx={{ mt: 5 }}>
					<Button variant="contained" sx={{ width: 300 }} onClick={handleNext}>
						{t("common:Next")}
					</Button>
				</Grid>
			</Grid>
		</RouteLayout>
	);
}
