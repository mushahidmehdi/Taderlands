import * as React from "react";
import { useState } from "react";
import Countdown from "react-countdown";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { Box, Button, InputAdornment, Link, Paper, Typography } from "@mui/material";

import { useSnackbar } from "notistack";

import { Dialog, TextField } from "components";

import { useFetchAuthorized } from "services";
import Config from "services/config";

import { Success, verificationCode } from "images";

export default function WithdrawOtp({ otpOpen, setOtpOpen, transaction, operation }) {
	const { profile } = useSelector((state) => state.user);
	const [successOpen, setSuccessOpen] = useState(false);
	const [twofaCode, setTwofaCode] = useState();
	const [emailCode, setEmailCode] = useState();
	const [smsCode, setSmsCode] = useState();
	const [error, setError] = useState(false);
	const [sendOtpDisabled, setSendOtpDisabled] = useState(false);

	const { t } = useTranslation();
	const navigate = useNavigate();
	const { enqueueSnackbar } = useSnackbar();
	const fetchAuthorized = useFetchAuthorized();

	const onClose = () => {
		setSendOtpDisabled(false);
		setOtpOpen(false);
	};

	const handleSuccessClose = () => {
		setSuccessOpen(false);
		window.location.reload();
	};

	const sendOTP = (method) => {
		fetchAuthorized(`${Config.apiRoot()}/user/otp/${method}/request`, {
			headers: {
				"Content-type": "application/json",
				"x-transaction-id": transaction,
			},
			method: "POST",
		})
			.then((data) => data.json())
			.then((data) => {
				if (data?.error?.code) {
					enqueueSnackbar(t("Bir hata ile karşılaşıldı"), { variant: "error" });
					return;
				}
				enqueueSnackbar(t("login.Code sent successfully"), { variant: "success" });
				setSendOtpDisabled(true);
			})
			.catch((err) => {
				enqueueSnackbar(t("Bir hata ile karşılaşıldı"), { variant: "error" });
			});
	};

	const handleNext = () => {
		executeOperation();
	};

	const executeOperation = () => {
		const body = {
			...operation.body,
			...(profile?.userSecuritySetting?.emailSecurityActive && { emailCode }),
			...(profile?.userSecuritySetting?.twofaSecurityActive && { twofaCode }),
			...(profile?.userSecuritySetting?.smsSecurityActive && { smsCode }),
		};

		fetchAuthorized(`${Config.apiRoot()}/payment${operation.path}`, {
			headers: {
				"Content-type": "application/json",
				"x-transaction-id": transaction,
			},
			method: operation.method,
			body: JSON.stringify(body),
		})
			.then((data) => data.json())
			.then((data) => {
				if (data?.error?.code !== 0) {
					enqueueSnackbar(t("Bir hata ile karşılaşıldı"), { variant: "error" });
					return;
				}
				setSuccessOpen(true);
				setOtpOpen(false);
			})
			.catch((err) => {
				enqueueSnackbar(t("Bir hata ile karşılaşıldı"), { variant: "error" });
			});
	};

	const SuccessDialog = () => (
		<Dialog
			dialogProps={{ open: successOpen, onClose: handleSuccessClose }}
			title={<Success />}
			content={
				<Paper
					sx={{
						boxShadow: 0,
						backgroundColor: "#FFFFFF",
						padding: 2,
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						textAlign: "center",
					}}
				>
					<Typography fontWeight={"Bold"} sx={{ mt: 2, fontSize: "24px" }}>
						{t("Tamamlandı")}
					</Typography>
					<Typography sx={{ mt: 2, fontSize: "14px" }}>
						{t(
							"İşleminiz başarılya sıraya alınmıştır. Yatırımınız tamamlandığında bilgilendirme alacaksınız."
						)}
					</Typography>
					<Button
						variant="outlined"
						sx={{ width: 300, mt: 2 }}
						color="primary"
						onClick={() => handleSuccessClose()}
					>
						{t("exchangeLink.Close")}
					</Button>
				</Paper>
			}
		></Dialog>
	);

	return (
		<React.Fragment>
			<SuccessDialog />
			<Dialog
				dialogProps={{ open: otpOpen, onClose: onClose }}
				content={
					<>
						<Box component="img" src={verificationCode} sx={{ mt: 2 }} />
						<Typography fontWeight={"Bold"} sx={{ mt: 2, fontSize: "24px" }}>
							{"Withdraw"}
						</Typography>
						<Typography sx={{ mb: 2, fontSize: "14px" }}>
							{t("You can remove the following information and add your withdraw")}
						</Typography>
						{profile?.userSecuritySetting?.twofaSecurityActive && (
							<TextField
								fullWidth
								error={error}
								label={t("exchangeLink.2FA Verification Code")}
								onChange={(e) => setTwofaCode(e.target.value)}
								size="small"
							/>
						)}
						{profile?.userSecuritySetting?.emailSecurityActive && (
							<TextField
								fullWidth
								error={error}
								label={t("exchangeLink.Email Verification Code")}
								onChange={(e) => setEmailCode(e.target.value)}
								size="small"
								endAdornment={
									sendOtpDisabled ? (
										<Countdown
											date={Date.now() + 120000}
											intervalDelay={1000}
											renderer={(props) => <div>{props.total / 1000}</div>}
											onComplete={(e) => setSendOtpDisabled(false)}
										></Countdown>
									) : (
										<InputAdornment position="end">
											<Link
												href="#"
												onClick={(e) => {
													e.preventDefault();
													sendOTP("email");
												}}
											>
												{t("login.Resend Code")}
											</Link>
										</InputAdornment>
									)
								}
							/>
						)}
						{profile?.userSecuritySetting?.smsSecurityActive && (
							<TextField
								fullWidth
								error={error}
								label={t("exchangeLink.SMS Verification Code")}
								onChange={(e) => setSmsCode(e.target.value)}
								size="small"
								endAdornment={
									<InputAdornment position="end">
										<Link
											href="#"
											onClick={(e) => {
												e.preventDefault();
												sendOTP("sms");
											}}
										>
											{t("login.Resend Code")}
										</Link>
									</InputAdornment>
								}
							/>
						)}
					</>
				}
				action={
					<Button variant="contained" sx={{ width: 300 }} onClick={handleNext}>
						{t("exchangeLink.Next")}
					</Button>
				}
			></Dialog>
		</React.Fragment>
	);
}
