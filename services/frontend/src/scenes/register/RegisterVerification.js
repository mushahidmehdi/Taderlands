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

export default function RegisterVerification(props) {
	const [otp, setOtp] = useState();
	const [sendOtpDisabled, setSendOtpDisabled] = useState(true);
	const [sendOtpDate, setSendOtpDate] = useState(Date.now());

	const { t } = useTranslation();
	const { enqueueSnackbar } = useSnackbar();
	const navigate = useNavigate();
	const { state } = useLocation();
	const dispatch = useDispatch();

	const { sendOtpAgain: sendOtpAgainService, confirmRegisterOtp } = useRegisterApi();
	const catchError = useCatchError();

	const { jwt: selectedJWT } = useSelector((state) => state.jwt);

	useEffect(() => {
		if (selectedJWT?.accessToken) {
			navigate("/dashboard");
		}
	}, [navigate, selectedJWT?.accessToken]);

	const confirmOtp = () => {
		if (!otp) {
			enqueueSnackbar(t("Please provide received otp code."), { variant: "error" });
			return;
		}

		const body = {
			email: state.user,
			otp: otp,
		};

		const { transactionId } = state;

		confirmRegisterOtp({ body, transactionId })
			.then((data) => {
				dispatch(setJwt(data?.data));

				navigate("/?welcome=true");
			})
			.catch(catchError);
	};

	const sendOtpAgain = () => {
		const body = {
			email: state.user,
		};

		const { transactionId } = state;

		sendOtpAgainService({ body, transactionId })
			.then(() => {
				enqueueSnackbar(t("Code sent successfully"), { variant: "success" });
				setSendOtpDisabled(true);
				setSendOtpDate(Date.now());
			})
			.catch(catchError);
	};

	return (
		<Layout>
			<Typography sx={{ mt: 2, fontSize: "24px", fontWeight: "bold" }}>{t("onboarding_otp_title")}</Typography>

			<Typography sx={{ mt: 2, fontSize: "16px" }}>{t("onboarding_otp_text")}</Typography>

			<TextField
				margin="normal"
				fullWidth
				label={t("onboarding_otp_input_title")}
				value={otp ?? ""}
				onChange={(e) => setOtp(e.target.value)}
				onKeyPress={(e) => {
					if (e.key === "Enter") {
						confirmOtp();
					}
				}}
				inputProps={{ "data-testid": "otp-field" }}
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
										sendOtpAgain();
									}}
								>
									{t("onboarding_otp_retry_button")}
								</Link>
							</InputAdornment>
						),
				}}
			/>

			<Button
				fullWidth
				variant="contained"
				sx={{ mt: 3, fontSize: "16px" }}
				onClick={confirmOtp}
				data-testid="otp-continue"
			>
				{t("onboarding_otp_continue_button")}
			</Button>
		</Layout>
	);
}
