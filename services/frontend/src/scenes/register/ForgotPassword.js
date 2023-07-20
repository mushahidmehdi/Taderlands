import { useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { Button, Grid, IconButton, InputAdornment, TextField, Tooltip, Typography } from "@mui/material";

import { REGEXP_EMAIL, REGEXP_PASSWORD } from "constants";
import Joi from "joi";
import { useSnackbar } from "notistack";

import { Dialog } from "components";

import { useRegisterApi } from "api/register";
import useCatchError from "api/useCatchError";

import { Config } from "services";

import useQuery from "utils/useQuery";

import { EyeOff, EyeOn, Success, TooltipCheck, TooltipStop } from "images";

import Layout from "./Layout";

const InitiateForgotPasswordDialog = ({ open, onClose }) => (
	<Dialog
		dialogProps={{ open, onClose }}
		title={<Success />}
		content={
			<>
				<Typography fontWeight={"Bold"} sx={{ mt: 2, textAlign: "center", fontSize: "24px" }}>
					Reset Password
				</Typography>

				<Typography sx={{ mt: 2, textAlign: "center", fontSize: "14px" }}>
					Please go to your mail inbox and follow the instructions to reset your password.
				</Typography>

				<Button variant="outlined" sx={{ width: 300, mt: 2 }} color="primary" onClick={() => onClose()}>
					Close
				</Button>
			</>
		}
	/>
);

export default function ForgotPassword() {
	const [emailSelected, setEmailSelected] = useState(true);
	const [newPassword, setNewPassword] = useState();
	const [confirmPassword, setConfirmPassword] = useState();
	const [email, setEmail] = useState();
	const [phoneNumber, setPhoneNumber] = useState();
	const [captcha, setCaptcha] = useState();
	const [open, setOpen] = useState();

	const [showPassword, setShowPassword] = useState(false);
	const [showPassword2, setShowPassword2] = useState(false);

	const [error, setError] = useState({});
	const [isTooltipOpen, setIsTooltipOpen] = useState(false);

	const query = useQuery();
	const { t } = useTranslation("register");
	const navigate = useNavigate();
	const { enqueueSnackbar } = useSnackbar();
	const recaptchaRef = useRef();

	const { confirmForgotPassword, initiateForgotPassword } = useRegisterApi();
	const catchError = useCatchError();
	const transactionId = query.get("fg");

	const handleFocus = () => {
		setIsTooltipOpen(true);
	};

	const handleBlur = () => {
		setIsTooltipOpen(false);
	};

	const containsSpecial = (str) => {
		var re = /(?=.*?[.#?!@$%^&*-])/;
		return re.test(str);
	};

	const containsUppercase = (str) => {
		return /[A-Z]/.test(str);
	};

	const containsLowercase = (str) => {
		return /[a-z]/.test(str);
	};

	const containsNumber = (str) => {
		return /[0-9]/.test(str);
	};

	const passwordChecks = [
		{
			check: newPassword?.length >= 8 && newPassword.length <= 30,
			tooltip: <TooltipCheck />,
			message: t("register_password_input_error_text_4"),
		},
		{
			check: containsSpecial(newPassword),
			tooltip: <TooltipCheck />,
			message: t("register_password_input_error_text_3"),
		},
		{
			check: containsUppercase(newPassword) && containsLowercase(newPassword),
			tooltip: <TooltipCheck />,
			message: t("register_password_input_error_text_1"),
		},
		{
			check: containsNumber(newPassword),
			tooltip: <TooltipCheck />,
			message: t("register_password_input_error_text_2"),
		},
	];

	const isValid = passwordChecks.every((check) => check.check);

	const forgotPasswordInitiateSchema = Joi.object({
		email: Joi.string()
			.required()
			.regex(new RegExp(REGEXP_EMAIL))
			.error(() => new Error("email")),
	});

	const forgotPasswordConfirmSchema = Joi.object({
		newPassword: Joi.string()
			.required()
			.regex(new RegExp(REGEXP_PASSWORD))
			.error(() => new Error("newPassword")),
		confirmPassword: Joi.any()
			.valid(Joi.ref("newPassword"))
			.required()
			.error(() => new Error("confirmPassword")),
	});

	const validateInitiate = () => {
		try {
			if (!captcha) {
				enqueueSnackbar("Invalid captcha.", { variant: "error" });
				return;
			}

			Joi.attempt({ email }, forgotPasswordInitiateSchema);
			return true;
		} catch (error) {
			setError({ [error.message]: true });

			enqueueSnackbar(`Please fill the form fields properly.`, { variant: "error" });
			return false;
		}
	};

	const validateConfirm = () => {
		try {
			if (!captcha) {
				enqueueSnackbar("Invalid captcha.", { variant: "error" });
				return;
			}

			Joi.attempt({ newPassword, confirmPassword }, forgotPasswordConfirmSchema);
			return true;
		} catch (error) {
			setError({ [error.message]: true });

			enqueueSnackbar(`Please fill the form fields properly.`, { variant: "error" });
			return false;
		}
	};

	const handleInitiate = () => {
		if (!validateInitiate()) return;

		const data = { email, captcha };

		initiateForgotPassword(data)
			.then((_) => {
				setOpen(true);
			})
			.catch((err) => {
				catchError(err);
				recaptchaRef.current.reset();
			});
	};

	const handleConfirm = () => {
		if (!validateConfirm()) return;

		const data = { newPassword, confirmPassword, captcha, transactionId };

		confirmForgotPassword(data)
			.then((data) => {
				enqueueSnackbar(t("Password Changed"), { variant: "success" });
				navigate("/login");
			})
			.catch((err) => {
				catchError(err);
				recaptchaRef.current.reset();
			});
	};

	const handleSubmit = () => {
		if (transactionId) {
			handleConfirm();
		} else {
			handleInitiate();
		}
	};

	return (
		<Layout>
			<Typography
				sx={{
					mt: "5vh",
					fontSize: "24px",
					fontWeight: "bold",
					textAlign: "left",
				}}
			>
				{t("forgot_password_main_title")}
			</Typography>

			{!transactionId && <Typography sx={{ fontSize: "14px" }}>{t("forgot_password_main_text")}</Typography>}

			{!transactionId && (
				<TextField
					margin="normal"
					required
					fullWidth
					label={t("forgot_password_email_input_title")}
					autoFocus
					error={error?.email}
					onChange={(e) => setEmail(e.target.value)}
				/>
			)}

			{transactionId && (
				<>
					<Tooltip
						open={newPassword?.length >= 1 && isTooltipOpen}
						componentsProps={{
							tooltip: {
								sx: {
									backgroundColor: "#fff",
									color: "#000",
									display: "flex",
									justifyContent: "space-evenly",
									textAlign: "justify",
									padding: "1rem",
									boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
								},
							},
						}}
						title={
							<Grid>
								{passwordChecks.map(({ check, tooltip, message }) => (
									<>
										{check ? tooltip : <TooltipStop />}
										<span
											style={{
												color: check ? "green" : "red",
												fontSize: "0.75rem",
												marginLeft: "0.25rem",
											}}
										>
											{message}
										</span>
										<br />
									</>
								))}
							</Grid>
						}
						placement="top"
					>
						<TextField
							onFocus={handleFocus}
							onBlur={handleBlur}
							sx={{
								mt: 1,
							}}
							error={error.newPassword}
							label={t("register_password_input_title")}
							fullWidth
							type={showPassword ? "text" : "password"}
							onChange={(e) => setNewPassword(e.target.value)}
							InputProps={{
								endAdornment: (
									<InputAdornment position="end">
										<IconButton
											onClick={() => {
												setShowPassword(!showPassword);
											}}
										>
											{showPassword ? <EyeOn /> : <EyeOff />}
										</IconButton>
									</InputAdornment>
								),
							}}
						/>
					</Tooltip>
					<TextField
						sx={{
							mt: 1,
							mb: 1,
						}}
						error={error.confirmPassword}
						label={t("register_password_again_input_title")}
						fullWidth
						type={showPassword2 ? "text" : "password"}
						onChange={(e) => setConfirmPassword(e.target.value)}
						InputProps={{
							endAdornment: (
								<InputAdornment position="end">
									<IconButton
										onClick={() => {
											setShowPassword2(!showPassword2);
										}}
									>
										{showPassword2 ? <EyeOn /> : <EyeOff />}
									</IconButton>
								</InputAdornment>
							),
						}}
					/>
				</>
			)}
			<ReCAPTCHA
				ref={recaptchaRef}
				sitekey={Config.captchaKey()}
				onChange={(value) => {
					setCaptcha(value);
				}}
			/>

			<Button fullWidth variant="contained" sx={{ mt: 3, p: 1.4, fontSize: "16px" }} onClick={handleSubmit}>
				{t("common:btn_continue")}
			</Button>

			{open && <InitiateForgotPasswordDialog open={open} onClose={() => navigate("/")} />}
		</Layout>
	);
}
