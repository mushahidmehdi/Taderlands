import * as React from "react";
import { useState } from "react";
import Countdown from "react-countdown";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { Box, Button, InputAdornment, Link, Typography } from "@mui/material";

import { useSnackbar } from "notistack";

import { Dialog, TextField } from "components";

import useCatchError from "api/useCatchError";
import { useUserApi } from "api/user";

import { verificationCode } from "images";

export default function AddPhoneOtp({ otpOpen, setOtpOpen, phoneNumber }) {
	const { profile } = useSelector((state) => state.user);
	const [smsCode, setSmsCode] = useState();
	const [error, setError] = useState(false);
	const [sendOtpDisabled, setSendOtpDisabled] = useState(false);
	const [sendOtpDate, setSendOtpDate] = useState();

	const { sendDeposit, confirmDeposit } = useUserApi();

	const { t } = useTranslation("wallet");
	const navigate = useNavigate();
	const { enqueueSnackbar } = useSnackbar();
	const catchError = useCatchError();

	const onClose = () => {
		setSendOtpDisabled(false);
		setOtpOpen(false);
	};

	const sendOTP = () => {
		sendDeposit({ phoneNumber: phoneNumber })
			.then((data) => {
				enqueueSnackbar(t("common:otp_code_sent_successfully"), { variant: "success" });
				setSendOtpDisabled(true);
				setSendOtpDate(Date.now());
			})
			.catch(catchError);
	};

	const handleNext = () => {
		confirmDeposit({ phoneNumber: phoneNumber, otp: smsCode })
			.then((data) => {
				navigate("/payment/crypto-deposit");
				onClose();
			})
			.catch(catchError);
	};

	return (
		<Dialog
			dialogProps={{ open: otpOpen, onClose: onClose }}
			content={
				<>
					<Box component="img" src={verificationCode} sx={{ mt: 2 }} />
					<Typography fontWeight={"Bold"} sx={{ mt: 2, fontSize: "24px" }}>
						{t("wallet_withdraw_add_phone_otp_title")}
					</Typography>
					<Typography sx={{ mb: 2, fontSize: "14px" }}>{t("wallet_withdraw_add_phone_otp_text")}</Typography>

					<TextField
						fullWidth
						error={error}
						label={t("wallet_withdraw_add_phone_otp_textfield_label")}
						onChange={(e) => setSmsCode(e.target.value)}
						size="small"
						endAdornment={
							sendOtpDisabled && sendOtpDate ? (
								<Countdown
									date={sendOtpDate + 120000}
									intervalDelay={1000}
									renderer={(props) => <div>{props.total / 1000}</div>}
									onComplete={(e) => setSendOtpDisabled(false)}
								/>
							) : (
								<InputAdornment position="end">
									<Link
										href="#"
										onClick={(e) => {
											e.preventDefault();
											sendOTP();
										}}
									>
										{t("common:onboarding_otp_retry_button")}
									</Link>
								</InputAdornment>
							)
						}
						InputProps={{
							endAdornment:
								sendOtpDisabled && sendOtpDate ? (
									<Countdown
										date={sendOtpDate + 120000}
										intervalDelay={1000}
										renderer={(props) => <div>{props.total / 1000}</div>}
										onComplete={(e) => setSendOtpDisabled(false)}
									/>
								) : (
									<InputAdornment position="end">
										<Link
											href="#"
											onClick={(e) => {
												e.preventDefault();
												sendOTP();
											}}
										>
											{t("common:onboarding_otp_retry_button")}
										</Link>
									</InputAdornment>
								),
						}}
					/>
				</>
			}
			action={
				<Button variant="contained" sx={{ width: 300 }} onClick={handleNext}>
					{t("common:Next")}
				</Button>
			}
		></Dialog>
	);
}
