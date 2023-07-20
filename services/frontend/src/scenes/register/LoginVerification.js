import { useEffect, useState } from "react";
import Countdown from "react-countdown";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import { Button, InputAdornment, Link, TextField, Typography } from "@mui/material";

import { useSnackbar } from "notistack";

import { useRegisterApi } from "api/register";
import useCatchError from "api/useCatchError";

import { setJwt } from "actions/jwtActions";

import Layout from "./Layout";

export default function LoginVerification() {
	const [twofaCode, setTwofaCode] = useState();
	const [emailCode, setEmailCode] = useState();
	const [smsCode, setSmsCode] = useState();
	const [sendOtpDisabled, setSendOtpDisabled] = useState(false);
	const [sendOtpDate, setSendOtpDate] = useState();
	const [error, setError] = useState();

	const { t } = useTranslation("common");
	const { enqueueSnackbar } = useSnackbar();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { state } = useLocation();
	const {
		emailSecurityActive,
		twofaSecurityActive,
		smsSecurityActive,
		transactionId,
		email,
		phoneNumber,
		newPassword,
		confirmPassword,
		forgotPassword,
	} = state ?? {};

	const { confirmLogin, confirmForgotPassword, sendOtp } = useRegisterApi();
	const catchError = useCatchError();

	const validate = () => {
		let err;

		if (emailSecurityActive && !emailCode) {
			err = { ...err, emailCode: true };
		}

		if (twofaSecurityActive && !twofaCode) {
			err = { ...err, twofaCode: true };
		}

		if (smsSecurityActive && !smsCode) {
			err = { ...err, smsCode: true };
		}

		setError(err);

		return err;
	};

	const getToken = () => {
		if (validate()) {
			enqueueSnackbar(t("register:login_verification_error_otp_codes_not_filled"), { variant: "error" });
			return;
		}

		if (forgotPassword) {
			confirmForgotPassword({
				body: {
					email,
					phoneNumber,
					twofaCode,
					emailCode,
					smsCode,
					email,
					newPassword,
					confirmPassword,
				},
				transactionId,
			}).then((data) => {
				dispatch(setJwt(data?.data));
				enqueueSnackbar(t("register:forgot_password_changed_successfully"), { variant: "success" });
				navigate("/dashboard");
			});
			return;
		}

		const body = {
			email,
			phoneNumber,
			transactionId,
			twofaCode,
			emailCode,
			smsCode,
		};

		confirmLogin({ body, transactionId })
			.then((data) => {
				if (data?.data?.accessToken) {
					dispatch(setJwt(data.data));
					return;
				}
				enqueueSnackbar(t("register:login_verification_error"), { variant: "error" });
			})
			.catch(() => {
				enqueueSnackbar(t("register:login_verification_error"), { variant: "error" });
			});
	};

	const sendOTP = (method) => {
		const body = {
			email,
			phoneNumber,
			transactionId,
		};

		sendOtp({ body, forgotPassword, method, transactionId })
			.then(() => {
				enqueueSnackbar(t("common:otp_code_sent_successfully"), { variant: "success" });
				setSendOtpDisabled({ ...sendOtpDisabled, [method]: true });
				setSendOtpDate({ ...sendOtpDate, [method]: Date.now() });
			})
			.catch(catchError);
	};

	// making sure auth user not see login page again
	const { jwt: selectedJWT } = useSelector((state) => state.jwt);

	useEffect(() => {
		if (selectedJWT?.accessToken) {
			navigate("/dashboard");
		}
	}, [selectedJWT?.accessToken]);

	return (
		<Layout>
			<Typography sx={{ mt: "5vh", fontSize: "24px", fontWeight: "bold", marginTop: "10rem" }}>
				{t("onboarding_otp_title")}
			</Typography>

			<Typography sx={{ mt: 1, fontSize: "14px" }}>{t("onboarding_otp_text")}</Typography>

			{state?.twofaSecurityActive && (
				<TextField
					margin="normal"
					fullWidth
					label={t("common:otp_enter_2fa_code")}
					onChange={(e) => setTwofaCode(e.target.value)}
					onKeyPress={(e) => {
						if (e.key === "Enter") {
							getToken();
						}
					}}
				/>
			)}
			{state?.smsSecurityActive && (
				<TextField
					margin="normal"
					fullWidth
					label={t("onboarding_otp_sms_input_title")}
					onChange={(e) => setSmsCode(e.target.value)}
					onKeyPress={(e) => {
						if (e.key === "Enter") {
							getToken();
						}
					}}
					InputProps={{
						endAdornment:
							sendOtpDisabled?.phoneNumber && sendOtpDate?.phoneNumber ? (
								<Countdown
									date={sendOtpDate?.phoneNumber + 120000}
									intervalDelay={1000}
									renderer={(props) => <div>{props.total / 1000}</div>}
									onComplete={(e) => setSendOtpDisabled({ ...sendOtpDisabled, phoneNumber: false })}
								/>
							) : (
								<InputAdornment position="end">
									<Link
										href="#"
										onClick={(e) => {
											e.preventDefault();
											sendOTP("phoneNumber");
										}}
									>
										{t("onboarding_otp_retry_button")}
									</Link>
								</InputAdornment>
							),
					}}
				/>
			)}
			{state?.emailSecurityActive && (
				<TextField
					margin="normal"
					fullWidth
					label={t("onboarding_otp_input_title")}
					onChange={(e) => setEmailCode(e.target.value)}
					onKeyPress={(e) => {
						if (e.key === "Enter") {
							getToken();
						}
					}}
					InputProps={{
						endAdornment:
							sendOtpDisabled?.email && sendOtpDate?.email ? (
								<Countdown
									date={sendOtpDate?.email + 120000}
									intervalDelay={1000}
									renderer={(props) => <div>{props.total / 1000}</div>}
									onComplete={(e) => setSendOtpDisabled({ ...sendOtpDisabled, email: false })}
								/>
							) : (
								<InputAdornment position="end">
									<Link
										href="#"
										onClick={(e) => {
											e.preventDefault();
											sendOTP("email");
										}}
									>
										{t("onboarding_otp_retry_button")}
									</Link>
								</InputAdornment>
							),
					}}
				/>
			)}
			<Button
				fullWidth
				variant="contained"
				sx={{ mt: 1, fontSize: "16px", paddingBlock: "0.8rem" }}
				onClick={getToken}
			>
				{forgotPassword ? t("common:btn_continue") : t("onboarding_otp_continue_button")}
			</Button>
		</Layout>
	);
}
