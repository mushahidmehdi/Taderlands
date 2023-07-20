import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { Button, FormControl, FormControlLabel, Grid, Paper, Radio, RadioGroup, Typography } from "@mui/material";

import { matchIsValidTel } from "mui-tel-input";
import { useSnackbar } from "notistack";

import { Breadcrumbs, OtpDialog, PhoneField, Protection, RouteLayout, TextField } from "components";

import useCatchError from "api/useCatchError";
import { useUserApi } from "api/user";

import { setProfile } from "actions/UserActions";

import { Config, useFetchAuthorized } from "services";

import { Success } from "images";

import ChangePassword from "./ChangePassword";

export default function Settings() {
	const { profile } = useSelector((state) => state.user);

	const [phoneNumber, setPhoneNumber] = useState(profile?.phoneNumber ?? "+90");
	const [email, setEmail] = useState(profile?.email);
	const [operation, setOperation] = useState();
	const [open, setOpen] = useState();
	const [passwordOpen, setPasswordOpen] = useState(false);
	const [emailDisabled, setEmailDisabled] = useState(Boolean(profile?.email));
	const [phoneDisabled, setPhoneDisabled] = useState(Boolean(profile?.phoneNumber));
	const [error, setError] = useState();

	const fetchAuthorized = useFetchAuthorized();
	const { t, i18n } = useTranslation("accountCenter");
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { enqueueSnackbar } = useSnackbar();

	const { sendOtp, sendOtpWithoutTransaction, updateContactInfo } = useUserApi();
	const catchError = useCatchError();

	const handleOpenOTP = (operation) => {
		setError();
		setOperation(operation);

		if (operation === "ChangePassword") setPasswordOpen(true);

		if (operation === "email") {
			if (!emailDisabled && !email) {
				setError({ email: true });
				return;
			}
			emailDisabled ? setEmailDisabled(false) : setOpen({ updateEmail: true });
		}

		if (operation === "PhoneNumber") {
			if (!phoneDisabled && !phoneNumber) {
				setError({ phoneNumber: true });
				return;
			}
			phoneDisabled ? setPhoneDisabled(false) : setOpen({ updatePhoneNumber: true });
		}
	};

	const handleContactInfoUpdate = ({ emailCode, smsCode }) => {
		fetchAuthorized(`${Config.apiRoot()}/user/otp/confirm`, {
			headers: {
				"Content-type": "application/json",
			},
			method: "POST",
			body: JSON.stringify({
				...(emailCode && { email }),
				...(smsCode && { phoneNumber }),
				otp: emailCode ?? smsCode,
			}),
		})
			.then((data) => data.json())
			.then((data) => {
				if (data?.error?.code) {
					enqueueSnackbar(data?.error?.detail, { variant: "error" });
					setOpen();
					return;
				}

				setOperation({
					path: "/contact-info",
					body: { contactInfoKey: data?.data.contactInfoKey },
					method: "PATCH",
				});

				setOpen({ protection: true });
			})
			.catch((err) => {
				enqueueSnackbar(t("common:Bir hata ile karşılaşıldı"), { variant: "error" });
			});
	};

	const otpAction = (operation, body, transactionId) => updateContactInfo({ operation, body, transactionId });

	const handleOtpComplete = () => {
		setOpen();
	};

	useEffect(() => {
		fetchAuthorized(`${Config.apiRoot()}/user/profile`, {
			headers: {
				"Content-type": "application/json",
			},
			method: "GET",
		})
			.then((data) => data.json())
			.then((data) => {
				dispatch(setProfile(data?.data?.profile));
				setEmail(data?.data?.profile?.email);
				setPhoneNumber(data?.data?.profile?.phoneNumber);
			})
			.catch((err) => {});
	}, []);

	const checkForValidNumber = (isValidNumber) => {
		if (!isValidNumber) {
			enqueueSnackbar(t("common:enter_a_valid_number"), { variant: "error" });
			return;
		}
		return true;
	};

	return (
		<RouteLayout
			headerComp={
				<Breadcrumbs
					paths={[
						{
							text: t("account_center_menu_main_title"),
							onClick: () => navigate("/account-center"),
						},
						{
							text: t("account_center_settings_main_title"),
						},
					]}
				/>
			}
		>
			{open?.updateEmail && (
				<OtpDialog
					open={open?.updateEmail}
					onClose={() => setOpen()}
					onNext={handleContactInfoUpdate}
					title={t("account_center_settings_update_email_otp_title")}
					explanation={t("account_center_settings_update_email_otp_text")}
					sendOtp={(method) =>
						sendOtpWithoutTransaction(
							method === "email"
								? {
										email,
								  }
								: { phoneNumber }
						)
							.then(() => {
								enqueueSnackbar(t("common:otp_code_sent_successfully"), { variant: "success" });
							})
							.catch(catchError)
					}
					settings={{ emailSecurityActive: true }}
				/>
			)}
			{open?.updatePhoneNumber && (
				<OtpDialog
					open={open?.updatePhoneNumber}
					onClose={() => setOpen()}
					onNext={handleContactInfoUpdate}
					title={t("account_center_settings_update_phone_otp_title")}
					explanation={t("account_center_settings_update_phone_otp_text")}
					sendOtp={(method) =>
						sendOtpWithoutTransaction(
							method === "email"
								? {
										email,
								  }
								: { phoneNumber }
						)
							.then(() => {
								enqueueSnackbar(t("common:otp_code_sent_successfully"), { variant: "success" });
							})
							.catch(catchError)
					}
					settings={{
						smsSecurityActive: true,
					}}
				/>
			)}
			{open?.protection && (
				<Protection
					open={open?.protection}
					title={t("account_center_settings_update_protection_otp_title")}
					explanation={t("account_center_settings_update_protection_otp_text")}
					success={{
						icon: <Success />,
						content: (
							<Typography sx={{ mt: 2, textAlign: "center", fontSize: "14px" }}>
								{t("account_center_settings_update_protection_success_text")}
							</Typography>
						),
						title: t("account_center_settings_update_protection_success_title"),
					}}
					operation={operation}
					onClose={() => setOpen()}
					sendOtp={(method, transactionId) =>
						sendOtp(method, transactionId)
							.then(() => {
								enqueueSnackbar(t("common:Code sent successfully"), { variant: "success" });
							})
							.catch(catchError)
					}
					otpAction={otpAction}
					onComplete={() => handleOtpComplete()}
				/>
			)}

			<ChangePassword open={open?.changePassword} onClose={() => setOpen()} setOpen={setOpen} />

			<Grid container sx={{ mt: 2 }}>
				<Grid item xs={12}>
					<Paper sx={{ backgroundColor: "#FFFFFF", width: "90%", padding: 3 }}>
						<Grid container>
							<Grid item xs={12}>
								<Typography fontWeight={"Bold"} sx={{ fontSize: "24px" }}>
									{t("account_center_settings_contact_title")}
								</Typography>
							</Grid>
							<Grid item xs={12}>
								<Typography sx={{ mt: 2, fontSize: "14px" }}>
									{t("account_center_settings_contact_text")}
								</Typography>
							</Grid>
							<Grid item xs={6}>
								<Grid container sx={{ mt: 2 }}>
									<Grid item xs={8}>
										<PhoneField
											disabled={phoneDisabled}
											fullWidth
											margin="normal"
											error={error?.phoneNumber}
											label={t("account_center_settings_number_title")}
											{...(phoneNumber ? { value: phoneNumber } : {})}
											onChange={(e) => setPhoneNumber(e)}
										/>
									</Grid>

									<Grid item xs={4}>
										<Button
											variant="contained"
											sx={{ ml: 2, mt: 5, width: 100 }}
											onClick={() =>
												checkForValidNumber(matchIsValidTel(phoneNumber)) &&
												handleOpenOTP("PhoneNumber")
											}
											color={profile?.phoneNumber && phoneDisabled ? "secondary" : "primary"}
										>
											{profile?.phoneNumber
												? phoneDisabled
													? t("account_center_settings_update_button_text")
													: t("account_center_settings_add_change_button_text")
												: t("account_center_settings_add_button_text")}
										</Button>
									</Grid>
								</Grid>
								<Grid container sx={{ mt: 2 }}>
									<Grid item xs={8}>
										<TextField
											disabled={emailDisabled}
											fullWidth
											margin="normal"
											size="small"
											error={error?.email}
											label={t("account_center_settings_email_title")}
											type="email"
											value={email}
											readOnly={true}
										/>
									</Grid>
								</Grid>
							</Grid>
							<Grid item xs={6}></Grid>
						</Grid>
					</Paper>
				</Grid>
				<Grid item xs={12}>
					<Paper sx={{ mt: 2, backgroundColor: "#FFFFFF", width: "90%", padding: 3 }}>
						<Grid container>
							<Grid item xs={12}>
								<Typography fontWeight={"Bold"} sx={{ fontSize: "24px" }}>
									{t("account_center_settings_secure_title")}
								</Typography>
							</Grid>
							<Grid item xs={12}>
								<Typography sx={{ mt: 2, fontSize: "14px" }}>
									{t("account_center_settings_secure_text")}
								</Typography>
							</Grid>
							<Grid item xs={6}>
								<Grid container sx={{ mt: 2 }}>
									<Grid item xs={12}>
										<TextField
											fullWidth
											disabled
											margin="normal"
											size="small"
											value="* * * * * * * *"
											label={t("account_center_settings_password_title")}
											type="password"
										/>
									</Grid>
									<Grid item xs={12}>
										<Button
											variant="text"
											sx={{ mt: 1 }}
											onClick={(_) => setOpen({ changePassword: true })}
										>
											{t("account_center_settings_change_password_button_text")}
										</Button>
									</Grid>
								</Grid>
							</Grid>
							<Grid item xs={6}></Grid>
						</Grid>
					</Paper>
				</Grid>
				{false && (
					<Grid item xs={12}>
						<Paper sx={{ mt: 2, mb: 2, backgroundColor: "#FFFFFF", width: "90%", padding: 3 }}>
							<Grid container>
								<Grid item xs={12}>
									<Typography fontWeight={"Bold"} sx={{ fontSize: "24px" }}>
										{t("account_center_choose_language")}
									</Typography>
								</Grid>
								<Grid item xs={12}>
									<Typography sx={{ mt: 2, fontSize: "14px" }}>
										{t("account_center_choose_language_explanation")}
									</Typography>
								</Grid>
							</Grid>
							<FormControl>
								<RadioGroup
									row
									aria-labelledby="demo-row-radio-buttons-group-label"
									name="row-radio-buttons-group"
									value={i18n.language}
									onChange={(e) => i18n.changeLanguage(e.target.value)}
								>
									<FormControlLabel
										value="en-us"
										control={<Radio />}
										label={t("account_center_english")}
									/>
									<FormControlLabel
										value="tr-tr"
										control={<Radio />}
										label={t("account_center_turkish")}
									/>
								</RadioGroup>
							</FormControl>
						</Paper>
					</Grid>
				)}
			</Grid>
		</RouteLayout>
	);
}
