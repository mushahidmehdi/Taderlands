import { useEffect, useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
	Box,
	Button,
	Checkbox,
	FormControlLabel,
	Grid,
	IconButton,
	InputAdornment,
	Link,
	List,
	ListItem,
	TextField,
	Typography,
} from "@mui/material";

import Joi from "joi";
import { useSnackbar } from "notistack";

import { Dialog } from "components";

import { useRegisterApi } from "api/register";
import useCatchError from "api/useCatchError";

import { setJwt } from "actions/jwtActions";

import { Config } from "services";

import { EyeOff, EyeOn, LoginPage4 } from "images";

import Layout from "./Layout";
import LoginRegisterNavigation from "./LoginRegisterNavigation";

export default function Login({ test }) {
	const [email, setEmail] = useState();
	const [password, setPassword] = useState();
	const [error, setError] = useState({});
	const [showPassword, setShowPassword] = useState(false);
	const [legacyMessageOpen, setLegacyMessageOpen] = useState(false);
	const [tab, setTab] = useState(0);
	const [captcha, setCaptcha] = useState();

	const { t } = useTranslation("register");

	const navigate = useNavigate();
	const dispatch = useDispatch();
	const recaptchaRef = useRef();
	const { enqueueSnackbar } = useSnackbar();
	const { login } = useRegisterApi();
	const catchError = useCatchError();

	// making sure auth user not see login page again
	const { jwt: selectedJWT } = useSelector((state) => state.jwt);

	const loginSchema = Joi.object({
		email: Joi.string()
			.required()
			.regex(new RegExp("[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,64}"))
			.error(() => new Error(t("login_email_invalid"))),
		password: Joi.string()
			.required()
			.error(() => new Error(t("login_password_invalid"))),
	});
	const legacyUserMessageClose = () => {
		navigate("/forgot-password");
	};

	const LegacyUserMessage = () => (
		<Dialog
			dialogProps={{
				open: legacyMessageOpen,
				onClose: () => setLegacyMessageOpen(false),
				"data-testid": "legacy-user-message",
			}}
			title={<LoginPage4 width="105px" height="145px" />}
			content={
				<Box sx={{ textAlign: "left" }}>
					<Typography
						fontWeight={"Bold"}
						sx={{
							fontSize: "32px",
							textAlign: "center",
							color: (theme) => theme.palette.primary.main,
						}}
					>
						{t("login_legacy_pop_up_title")}
					</Typography>
					<Typography
						sx={{
							mt: 2,
							fontSize: "14px",
							whiteSpace: "pre-line",
						}}
					>
						{t("login_legacy_pop_up_sub_title")}
					</Typography>
					<List
						sx={{
							pl: 1,
							"& .MuiListItem-root": {
								display: "list-item",
							},
							listStyleType: "disc",

							fontSize: "14px",
						}}
					>
						<ListItem>{t("login_legacy_pop_up_list_text_1")}</ListItem>
						<ListItem>{t("login_legacy_pop_up_list_text_2")}</ListItem>
						<ListItem>{t("login_legacy_pop_up_list_text_3")}</ListItem>
						<ListItem>{t("login_legacy_pop_up_list_text_4")}</ListItem>
						<ListItem>{t("login_legacy_pop_up_list_text_5")}</ListItem>
					</List>
					<Typography
						sx={{
							mt: 1,
							fontSize: "14px",
						}}
					>
						{t("login_legacy_pop_up_sub_text")}
					</Typography>
				</Box>
			}
			action={
				<Button
					variant="contained"
					sx={{ width: "360px", height: "50px" }}
					onClick={(x) => legacyUserMessageClose()}
				>
					Start
				</Button>
			}
		/>
	);

	const handleSubmit = () => {
		try {
			if (!test && !captcha) {
				enqueueSnackbar("Invalid captcha.", { variant: "error" });
				return;
			}

			Joi.attempt({ email, password }, loginSchema);
		} catch (e) {
			enqueueSnackbar(e.message, { variant: "error" });
			return;
		}

		const parsedParaticaKey = JSON.parse(localStorage.getItem("persist:paratica:paratica-web") ?? "{}");

		const { jwt } = JSON.parse(parsedParaticaKey.jwt ?? "{}");

		if (jwt) {
			enqueueSnackbar("A user is already logged in. Please go to the dashboard.", {
				variant: "error",
			});
			return;
		}

		login({ email, password, captcha })
			.then((data) => {
				if (data?.data?.legacyUser) {
					setLegacyMessageOpen(true);
					return;
				}

				if (data?.data?.transactionId) {
					let state = {
						forgotPassword: false,
						email,
						...data.data,
					};

					if ("verifyStatus" in data?.data) {
						navigate("/register-verification", {
							state: {
								...state,
								user: email,
							},
						});

						return;
					}

					navigate("/login-verification", {
						state: state,
					});
					return;
				}

				if (data?.data?.accessToken) {
					dispatch(setJwt(data.data));
					navigate("/dashboard");
					return;
				}
			})
			.catch((err) => {
				if (err.message === "106.User not verified.") {
					navigate("/register-verification");
					return;
				}
				catchError(err);

				recaptchaRef.current.reset();
			});
	};

	useEffect(() => {
		if (selectedJWT?.accessToken) {
			navigate("/dashboard");
		}
	}, [selectedJWT?.accessToken]);

	return (
		<>
			{legacyMessageOpen && <LegacyUserMessage />}
			<Layout>
				<LoginRegisterNavigation />

				<TextField
					error={error?.email}
					sx={{
						marginBlock: "0.8rem",
					}}
					required
					fullWidth
					inputProps={{ "data-testid": "login-email" }}
					label={t("login_email_input_title")}
					autoFocus
					value={email ?? ""}
					onChange={(e) => {
						setEmail(e.target.value);
					}}
					onKeyPress={(e) => {
						if (e.key === "Enter") {
							handleSubmit();
						}
					}}
				/>
				<TextField
					error={error?.password}
					required
					fullWidth
					inputProps={{ "data-testid": "login-password" }}
					label={t("login_password_input_title")}
					value={password ?? ""}
					type={showPassword ? "text" : "password"}
					onChange={(e) => {
						setPassword(e.target.value);
						setError({ ...error, password: false });
					}}
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
				<Grid container spacing={1} sx={{ alignItems: "center", marginTop: "0.5rem" }}>
					<Grid item xs={6}>
						<FormControlLabel
							control={
								<Checkbox value="remember" sx={{ color: (theme) => theme.palette.primary.main }} />
							}
							label={t("login_remember_me")}
							sx={{ fontSize: "16px" }}
						/>
					</Grid>
					<Grid item xs={6} sx={{ textAlign: "end" }}>
						<Link
							href="/forgot-password"
							variant="body2"
							sx={{
								fontSize: "16px",
								color: (theme) => theme.palette.primary.main,
							}}
						>
							{t("login_forgot_password_direction_text")}
						</Link>
					</Grid>
				</Grid>
				{!test && (
					<ReCAPTCHA
						ref={recaptchaRef}
						sitekey={Config.captchaKey()}
						onChange={(value) => {
							setCaptcha(value);
						}}
					/>
				)}
				<Grid container>
					<Grid item xs={12}>
						<Button
							data-testid="login-submit"
							fullWidth
							variant="contained"
							onClick={handleSubmit}
							sx={{ fontSize: "16px", paddingBlock: "0.8rem", marginTop: "1.2rem" }}
						>
							{t("common:btn_continue")}
						</Button>
					</Grid>
				</Grid>
			</Layout>
		</>
	);
}
