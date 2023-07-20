import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { Box, Grid, IconButton, Link, Paper, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import useCopyToClipboard from "utils/useCopyToClipboard";

import { Duplicate, emailVerification, Success, VectorStrokeLinkBlue } from "images";

export default function useOperations({ c2faKey }) {
	const { t } = useTranslation("accountCenter");
	const copyToClipboard = useCopyToClipboard();
	const navigate = useNavigate();
	const theme = useTheme();

	const successObj = {
		icon: <Success />,
		title: t("account_center_settings_update_protection_success_title"),
		content: (
			<>
				<Typography sx={{ mt: 2, textAlign: "center", fontSize: "14px" }}>
					{t("account_center_settings_update_protection_success_text")}
				</Typography>
				{c2faKey && (
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
									{c2faKey}
								</Typography>
							</Grid>

							<Grid item xs={1}>
								<IconButton
									onClick={(e) => {
										copyToClipboard(c2faKey);
									}}
									sx={{ ml: 0.5, mt: -1 }}
								>
									<Duplicate />
								</IconButton>
							</Grid>
						</Grid>
					</Paper>
				)}
			</>
		),
	};

	const operations = {
		email: {
			icon: emailVerification,
			title: t("account_center_security_email_main_title"),
			text: t("account_center_security_email_main_text"),
			otp: {
				[true]: {
					title: t("account_center_security_email_active_title"),
					explanation: t("account_center_security_email_active_text"),
				},
				[false]: {
					title: t("account_center_security_email_deactive_title"),
					explanation: t("account_center_security_email_deactive_text"),
				},
			},
			value: "email",
			success: successObj,
			noSms: "",
		},
		sms: {
			icon: emailVerification,
			title: t("account_center_security_sms_main_title"),
			text: t("account_center_security_sms_main_text"),
			otp: {
				[true]: {
					title: t("account_center_security_sms_active_title"),
					explanation: t("account_center_security_sms_active_text"),
				},
				[false]: {
					title: t("account_center_security_sms_deactive_title"),
					explanation: t("account_center_security_sms_deactive_text"),
				},
			},
			value: "sms",
			success: successObj,
			noSms: (
				<Grid
					container
					sx={{
						cursor: "pointer",
						[theme.breakpoints.down("md")]: {
							maxWidth: "100%",
						},
						[theme.breakpoints.up("md")]: {
							maxWidth: "100%",
						},
						[theme.breakpoints.up("xl")]: {
							maxWidth: "70%",
						},
					}}
					onClick={() => navigate("/settings")}
				>
					<Box sx={{ mt: 1 }}>
						<VectorStrokeLinkBlue />
					</Box>
					<Link sx={{ mb: 1, ml: 3, fontSize: "14px", textDecoration: "none" }}>
						<Box item sx={{ mt: 1 }}>
							Go to profile and add your phone number
						</Box>
					</Link>
				</Grid>
			),
		},
		twoFA: {
			icon: emailVerification,
			title: t("account_center_security_2fa_main_title"),
			text: t("account_center_security_2fa_main_text"),
			otp: {
				[true]: {
					title: t("account_center_security_2fa_active_title"),
					explanation: t("account_center_security_2fa_active_text"),
				},
				[false]: {
					title: t("account_center_security_2fa_deactive_title"),
					explanation: t("account_center_security_2fa_deactive_text"),
				},
			},
			value: "twoFA",
			color: "#0F20E8",
			success: successObj,
			noSms: "",
		},
		kyc: {
			icon: emailVerification,
			title: t("account_center_security_kyc_main_title"),
			text: t("account_center_security_kyc_main_text"),
			otp: {
				[true]: {
					title: t("account_center_security_kyc_active_title"),
					explanation: t("account_center_security_kyc_active_text"),
				},
				[false]: {
					title: t("account_center_security_kyc_deactive_title"),
					explanation: t("account_center_security_kyc_deactive_text"),
				},
			},
			value: "kyc",
			color: "#0F20E8",
			success: successObj,
			noSms: "",
		},
	};

	return { operations };
}
