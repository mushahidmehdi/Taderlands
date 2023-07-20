import { useEffect, useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
	Button,
	Checkbox,
	FormControlLabel,
	Grid,
	IconButton,
	InputAdornment,
	Link,
	TextField,
	Tooltip,
	Typography,
} from "@mui/material";

import Joi from "joi";
import { useSnackbar } from "notistack";

import { useRegisterApi } from "api/register";
import useCatchError from "api/useCatchError";

import { Config } from "services";

import useQuery from "utils/useQuery";

import { EyeOff, EyeOn, TooltipCheck, TooltipStop } from "images";

import Layout from "./Layout";
import LoginRegisterNavigation from "./LoginRegisterNavigation";

export default function Register() {
	const query = useQuery();
	const [showPassword, setShowPassword] = useState(false);
	const [showPassword2, setShowPassword2] = useState(false);
	const [emailSelected, setEmailSelected] = useState(true);
	const [telephoneSelected, setTelephoneSelected] = useState(false);
	const [email, setEmail] = useState();
	const [telephone, setTelephone] = useState();
	const [password, setPassword] = useState();
	const [password2, setPassword2] = useState();
	const [referenceCode, setReferenceCode] = useState(query.get("referenceCode"));
	const [codeTextBoxVisible, setCodeTextBoxVisible] = useState(query.get("referenceCode"));
	const [error, setError] = useState({});
	const [consent, setConsent] = useState(false);
	const [captcha, setCaptcha] = useState();
	const [isTooltipOpen, setIsTooltipOpen] = useState(false);

	const { t } = useTranslation("register");
	const navigate = useNavigate();
	const { enqueueSnackbar } = useSnackbar();
	const { register } = useRegisterApi();
	const catchError = useCatchError();
	const recaptchaRef = useRef();

	// making sure auth user not see register page again
	const { jwt: selectedJWT } = useSelector((state) => state.jwt);

	const REGEXP_PASSWORD = "^(?=.*[A-Za-z])(?=.*?[0-9])(?=.*?[.#?!@$%^&*-]).{8,}";
	const REGEXP_EMAIL = "[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,64}";
	const REGEXP_PHONE_NUMBER = "^[+]";

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
			check: password?.length >= 8 && password.length <= 30,
			tooltip: <TooltipCheck />,
			message: t("register_password_input_error_text_4"),
		},
		{
			check: containsSpecial(password),
			tooltip: <TooltipCheck />,
			message: t("register_password_input_error_text_3"),
		},
		{
			check: containsUppercase(password) && containsLowercase(password),
			tooltip: <TooltipCheck />,
			message: t("register_password_input_error_text_1"),
		},
		{
			check: containsNumber(password),
			tooltip: <TooltipCheck />,
			message: t("register_password_input_error_text_2"),
		},
	];

	const isValid = passwordChecks.every((check) => check.check);

	const registerSchema = Joi.object({
		email: Joi.string()
			.regex(new RegExp(REGEXP_EMAIL))
			.error(() => new Error(t("Email is not valid."))),
		telephone: Joi.string()
			.regex(new RegExp(REGEXP_PHONE_NUMBER))
			.error(() => new Error(t("Phone number is not valid."))),
		password: Joi.string()
			.regex(new RegExp(REGEXP_PASSWORD))
			.error(
				() =>
					new Error(
						t(
							"Password length should be greater than 8 characters including one number, a special character, and a capital letter."
						)
					)
			),
	}).oxor("telephone", "email");

	useEffect(() => {
		if (selectedJWT?.accessToken) {
			navigate("/dashboard");
		}
	}, [navigate, selectedJWT?.accessToken]);

	const prepareData = () => {
		let data = {};
		if (!captcha) {
			enqueueSnackbar("Invalid captcha.", { variant: "error" });
			return;
		}

		setError({
			email: emailSelected && !email,
			telephone: telephoneSelected && !telephone,
			password: !password,
			password2: !password2,
		});
		data = {
			...(emailSelected ? { email } : {}),
			...(telephoneSelected ? { telephone } : {}),
			...(referenceCode ? { referenceCode } : {}),
			notificationAgreement: consent,
			password: password,
		};
		if (password && password2 && password !== password2) {
			enqueueSnackbar(t("register_password_not_match_error_text"), { variant: "error" });
			return;
		}
		try {
			emailSelected
				? Joi.attempt({ email, password }, registerSchema)
				: Joi.attempt({ telephone, password }, registerSchema);
		} catch (e) {
			enqueueSnackbar(e.message, { variant: "error" });
			return;
		}
		if (error?.email || error?.telephone || error?.pass || error?.pass2) {
			return;
		}

		return { ...data, captcha };
	};

	const handleSubmit = () => {
		const body = prepareData();
		if (!body) return;

		register(body)
			.then((data) => {
				if (data?.data?.legacyUser) {
					enqueueSnackbar("This email is already registered. You should try to login.", { variant: "error" });
					return;
				}

				let state = {
					type: "email",
					user: body.email,
					transactionId: data.data.transactionId,
				};

				navigate("/register-verification", {
					state: state,
				});
			})
			.catch((err) => {
				if (err.message === "101.should login") {
					enqueueSnackbar("This email is already registered. You should try to login.", { variant: "error" });
					return;
				}

				if (err.message === "106.User not verified.") {
					navigate("/register-verification");
					return;
				}
				catchError(err);
			});
	};

	return (
		<Layout>
			<LoginRegisterNavigation />

			{emailSelected ? (
				<TextField
					error={error.email}
					margin="normal"
					required
					fullWidth
					label={t("register_email_input_title")}
					autoFocus
					onChange={(e) => setEmail(e.target.value)}
					onKeyPress={(e) => {
						if (e.key === "Enter") {
							handleSubmit();
						}
					}}
				/>
			) : (
				<TextField
					error={error.telephone}
					margin="normal"
					required
					fullWidth
					label={t("register_email_input_title")}
					autoFocus
					onChange={(e) => setTelephone(e.target.value)}
					onKeyPress={(e) => {
						if (e.key === "Enter") {
							handleSubmit();
						}
					}}
				/>
			)}
			<Tooltip
				open={password?.length >= 1 && isTooltipOpen}
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
					error={(error.password, !isValid)}
					margin="normal"
					required
					fullWidth
					label={t("register_password_input_title")}
					type={showPassword ? "text" : "password"}
					onChange={(e) => setPassword(e.target.value)}
					onKeyPress={(e) => {
						if (e.key === "Enter") {
							handleSubmit();
						}
					}}
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
				error={error.password2}
				margin="normal"
				required
				fullWidth
				label={t("register_password_again_input_title")}
				type={showPassword2 ? "text" : "password"}
				onChange={(e) => setPassword2(e.target.value)}
				onKeyPress={(e) => {
					if (e.key === "Enter") {
						handleSubmit();
					}
				}}
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
			{codeTextBoxVisible ? (
				<TextField
					margin="normal"
					fullWidth
					label={t("register_ref_code_input_title")}
					value={referenceCode}
					onChange={(e) => setReferenceCode(e.target.value)}
				/>
			) : (
				<Grid item xs={12} sx={{ textAlign: "center" }}>
					<Link
						href="#"
						variant="body2"
						sx={{ fontSize: "16px", color: (theme) => theme.palette.primary.main }}
						onClick={() => setCodeTextBoxVisible(true)}
					>
						{t("register_ref_code_title")}
					</Link>
				</Grid>
			)}

			<FormControlLabel
				control={
					<Checkbox
						value="consent"
						checked={consent}
						onChange={(x) => setConsent(!consent)}
						sx={{ color: (theme) => theme.palette.primary.main }}
					/>
				}
				label={t("register_consent_text")}
				sx={{ fontSize: "16px", mt: 2 }}
			/>

			<ReCAPTCHA
				ref={recaptchaRef}
				sitekey={Config.captchaKey()}
				onChange={(value) => {
					setCaptcha(value);
				}}
			/>

			<Button
				fullWidth
				variant="contained"
				sx={{ mt: 3, fontSize: "16px", paddingBlock: "0.75rem" }}
				onClick={handleSubmit}
			>
				{t("register_main_title")}
			</Button>

			<Typography sx={{ mt: 2, textAlign: "center", fontSize: "14px" }}>
				{t("register_user_disclaimer_text")}
				<Link
					sx={{ mt: 2, ml: 0.5, textAlign: "center" }}
					target="_blank"
					href={`${window.location.origin}/agreements?tab=1`}
				>
					{t(`register_user_disclaimer_user_agreement`)}
				</Link>
				,
				<Link
					sx={{ mt: 2, ml: 0.5, textAlign: "center" }}
					target="_blank"
					href={`${window.location.origin}/agreements?tab=2`}
				>
					{t(`register_user_disclaimer_privacy_policy`)}
				</Link>
				,{t("register_user_disclaimer_text_or")}
				<Link
					sx={{ mt: 2, ml: 0.5, textAlign: "center" }}
					target="_blank"
					href={`${window.location.origin}/agreements?tab=4`}
				>
					{t(`register_user_disclaimer_aml_kyc_policy`)}
				</Link>
				{t("register_user_disclaimer_text_tail")}
			</Typography>
		</Layout>
	);
}
