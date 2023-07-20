import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import Joi from "joi";
import { useSnackbar } from "notistack";

import { Grid, IconButton, InputAdornment, Paper, TextField } from "@mui/material";

import { setMaster } from "actions/MasterActions";
import { useRegisterApi } from "api/register";
import useCatchError from "api/useCatchError";
import { EyeOff, EyeOn } from "images";

export default function MasterLogin() {
	const [username, setUsername] = useState();
	const [password, setPassword] = useState();
	const [error, setError] = useState({});
	const [showPassword, setShowPassword] = useState(false);

	const { i18n, t } = useTranslation();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { enqueueSnackbar } = useSnackbar();
	const catchError = useCatchError();

	const { masterLogin } = useRegisterApi();

	const masterLoginSchema = Joi.object({
		username: Joi.string()
			.required()
			.error(() => new Error("username")),
		password: Joi.string()
			.required()
			.error(() => new Error("password")),
	});

	const validate = () => {
		try {
			Joi.attempt({ password, username }, masterLoginSchema);
			return true;
		} catch (error) {
			setError({ [error.message]: true });
			enqueueSnackbar(`Username or password is invalid`, { variant: "error" });
			return false;
		}
	};

	const handleSubmit = () => {
		if (!validate()) return;

		masterLogin({ username, password })
			.then((data) => {
				dispatch(setMaster(data?.data?.accessToken));

				navigate("/");
			})
			.catch(catchError);
	};

	useEffect(() => {
		i18n.changeLanguage("en-us");
	}, []);

	return (
		<div style={{ backgroundColor: "#F4F5FC", height: "100vh" }}>
			<Grid container sx={{ pt: "20vh" }}>
				<Grid item xs={3}></Grid>
				<Grid item xs={6}>
					<Paper sx={{ backgroundColor: "white", p: 2 }}>
						<TextField
							error={error?.username}
							margin="normal"
							required
							fullWidth
							label={t("Username")}
							autoFocus
							type="text"
							value={username ?? ""}
							onChange={(e) => {
								setUsername(e.target.value);
								setError({ ...error, username: false });
							}}
							onKeyPress={(e) => {
								if (e.key === "Enter") {
									handleSubmit();
								}
							}}
						/>

						<TextField
							error={error?.password}
							margin="normal"
							required
							fullWidth
							autoComplete="off"
							label={t("Password")}
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
					</Paper>
				</Grid>
				<Grid item xs={3}></Grid>
			</Grid>
		</div>
	);
}
