import { useState } from "react";
import Countdown from "react-countdown";
import { useTranslation } from "react-i18next";

import { Button, InputAdornment, Link, Typography } from "@mui/material";

import { useSnackbar } from "notistack";

import { Dialog, TextField } from "components";

import { VerificationCode } from "images";

export default function OtpDialog({ title, explanation, open, onClose, onNext, settings, sendOtp, transactionId }) {
	const { emailSecurityActive, smsSecurityActive, twofaSecurityActive } = settings ?? {};

	const [error, setError] = useState();
	const [emailCode, setEmailCode] = useState();
	const [smsCode, setSmsCode] = useState();
	const [twofaCode, setTwofaCode] = useState();
	const [disabled, setDisabled] = useState();
	const [disabledDate, setDisabledDate] = useState();

	const { t } = useTranslation("common");
	const { enqueueSnackbar } = useSnackbar();

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

	const handleNext = () => {
		if (validate()) {
			enqueueSnackbar("You should fill otp codes before moving on.", { variant: "error" });
			return;
		}

		onNext({ emailCode, twofaCode, smsCode });
	};

	return (
		<Dialog
			dialogProps={{ open, onClose }}
			content={
				<>
					<VerificationCode />
					<Typography fontWeight={"Bold"} sx={{ mt: 2, fontSize: "24px" }}>
						{title}
					</Typography>
					<Typography sx={{ mb: 2, fontSize: "14px" }}>{explanation}</Typography>
					{twofaSecurityActive && (
						<TextField
							fullWidth
							error={error}
							label={t("otp_2fa_verification_code")}
							value={twofaCode ?? ""}
							sx={{ mb: 2 }}
							onChange={(e) => setTwofaCode(e.target.value)}
							size="small"
						/>
					)}
					{emailSecurityActive && (
						<TextField
							fullWidth
							error={error}
							label={t("otp_email_verification_code")}
							value={emailCode ?? ""}
							sx={{ mb: 2 }}
							onChange={(e) => setEmailCode(e.target.value)}
							size="small"
							endAdornment={
								disabled?.email && disabledDate?.email ? (
									<Countdown
										date={disabledDate?.email + 120000}
										intervalDelay={1000}
										renderer={(props) => <div>{props.total / 1000}</div>}
										onComplete={(e) => setDisabled({ ...disabled, email: false })}
									/>
								) : (
									<InputAdornment position="end">
										<Link
											href="#"
											onClick={(e) => {
												e.preventDefault();
												sendOtp("email", transactionId).then(() => {
													setDisabledDate({ ...disabledDate, email: Date.now() });
													setDisabled({ ...disabled, email: true });
												});
											}}
										>
											{t("otp_resend_code")}
										</Link>
									</InputAdornment>
								)
							}
						/>
					)}
					{smsSecurityActive && (
						<TextField
							fullWidth
							error={error}
							label={t("otp_sms_verification_code")}
							sx={{ mb: 2 }}
							value={smsCode ?? ""}
							onChange={(e) => setSmsCode(e.target.value)}
							size="small"
							endAdornment={
								disabled?.sms && disabledDate?.sms ? (
									<Countdown
										date={disabledDate?.sms + 120000}
										intervalDelay={1000}
										renderer={(props) => <div>{props.total / 1000}</div>}
										onComplete={(e) => setDisabled({ ...disabled, sms: false })}
									/>
								) : (
									<InputAdornment position="end">
										<Link
											href="#"
											onClick={(e) => {
												e.preventDefault();
												sendOtp("phoneNumber", transactionId).then(() => {
													setDisabledDate({ ...disabledDate, sms: Date.now() });
													setDisabled({ ...disabled, sms: true });
												});
											}}
										>
											{t("otp_resend_code")}
										</Link>
									</InputAdornment>
								)
							}
						/>
					)}
				</>
			}
			action={
				<Button variant="contained" sx={{ width: 300 }} onClick={() => handleNext()}>
					{t("Next")}
				</Button>
			}
		></Dialog>
	);
}
