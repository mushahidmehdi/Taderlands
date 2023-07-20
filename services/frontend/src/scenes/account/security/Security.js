import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { Box, FormControlLabel, FormGroup, Grid, Paper, Switch, Typography } from "@mui/material";

import { useSnackbar } from "notistack";

import { Breadcrumbs, PageCenteredProgress, PasswordDialog, Protection, RouteLayout } from "components";

import useCatchError from "api/useCatchError";
import { useUserApi } from "api/user";

import { setProfile } from "actions/UserActions";

import { useFetchAuthorized } from "services";

import { Check, Loading } from "images";

import useOperations from "./Operations";

export default function Security() {
	const { profile } = useSelector((state) => state.user);

	const [processing, setProcessing] = useState(false);
	const [open, setOpen] = useState({ protection: false, password: false });
	const [checked, setChecked] = useState();
	const [operation, setOperation] = useState(false);
	const [action, setAction] = useState();

	const { t } = useTranslation("accountCenter");
	const navigate = useNavigate();

	const { enqueueSnackbar } = useSnackbar();
	const fetchAuthorized = useFetchAuthorized();
	const dispatch = useDispatch();
	const { operations } = useOperations({});
	const catchError = useCatchError();

	const { activateC2fa, getSecuritySettings, getProfile, sendOtp, patchSecuritySettings } = useUserApi();

	const handleChange = (event) => {
		if (
			(!event.target.checked && event.target.value === "email" && !checked?.sms) ||
			(!event.target.checked && event.target.value === "sms" && !checked?.email)
		) {
			enqueueSnackbar(t("account_center_security_at_least_one_active_warning"), { variant: "error" });
			return;
		}

		if (event.target.value === "twoFA" && event.target.checked) {
			setOpen({ password: true });
			return;
		}

		if (event.target.value === "kyc" && event.target.checked) {
			navigate("kyc-info");
			return;
		}

		setOperation({
			path: `/security-settings`,
			body: {
				...(event.target.value === "twoFA" ? { twofaSecurityActive: event.target.checked } : {}),
				...(event.target.value === "email" ? { emailSecurityActive: event.target.checked } : {}),
				...(event.target.value === "sms" ? { smsSecurityActive: event.target.checked } : {}),
				...(event.target.value === "kyc" ? { kycSecurityActive: event.target.checked } : {}),
			},
			method: "PATCH",
		});
		setAction({ type: event.target.value, operation: event.target.checked });
		setOpen({ protection: true });
	};

	const otpAction = (operation, body, transactionId) => patchSecuritySettings(operation.method, body, transactionId);

	const handleActivateC2fa = (password) => {
		activateC2fa(password)
			.then((data) => {
				navigate("/security/c2fa-info", {
					state: {
						key: data?.data?.secret?.base32,
						qr: data?.data?.qr,
					},
				});
			})
			.catch(catchError);
	};

	const handleOtpComplete = () => {
		getSecuritySettings().then((data) => {
			const { emailSecurityActive, twofaSecurityActive, smsSecurityActive, kycStatus } =
				data?.data?.securitySettings;

			setChecked({
				email: emailSecurityActive,
				sms: smsSecurityActive,
				twoFA: twofaSecurityActive,
				kyc: kycStatus,
			});

			setOpen();
		});
	};

	useEffect(() => {
		setProcessing(true);

		Promise.all([
			getSecuritySettings().then((data) => {
				const { emailSecurityActive, twofaSecurityActive, smsSecurityActive, kycStatus } =
					data?.data?.securitySettings;

				setChecked({
					email: emailSecurityActive,
					sms: smsSecurityActive,
					twoFA: twofaSecurityActive,
					kyc: kycStatus,
				});

				setOpen();
			}),
			getProfile().then((data) => {
				dispatch(setProfile(data?.data?.profile));
			}),
		]).finally(() => {
			setProcessing(false);
		});
	}, []);

	const SecurityCard = ({ icon, title, text, value, noSms }) => (
		<Paper
			sx={{
				position: "relative",
				overflow: "hidden",
				p: "32px",
				border: "1px solid #CFD2FA",
				borderRadius: "8px",
				height: "200px",
			}}
		>
			<Typography sx={{ pr: 2, fontSize: "24px", fontWeight: 700 }}>{title}</Typography>
			<Typography sx={{ mt: 1, fontSize: "14px" }}>{text}</Typography>

			{((value === "kyc" && checked?.[value] === "NOT_COMPLETED") || value !== "kyc") && (
				<FormGroup sx={{ mt: 1 }}>
					<FormControlLabel
						control={
							<Switch
								checked={value === "kyc" ? false : checked?.[value]}
								onChange={handleChange}
								value={value}
								inputProps={{ "aria-label": "controlled" }}
							/>
						}
						label={
							value === "kyc"
								? t("account_center_security_card_kyc_not_completed_text")
								: checked?.[value]
								? t("account_center_security_card_enable_text")
								: t("account_center_security_card_disable_text")
						}
					/>
				</FormGroup>
			)}
			{value === "kyc" && checked?.[value] !== "NOT_COMPLETED" && (
				<Grid
					container
					sx={{
						mt: 3,
					}}
				>
					<Grid xs={0.5}>{checked?.[value] === "COMPLETED" ? <Check /> : <Loading />}</Grid>
					<Grid xs={11.5}>
						<Typography
							sx={{
								mr: 1,
								fontSize: "16px",
								color: (theme) =>
									checked?.[value] === "COMPLETED"
										? theme.palette.success.main
										: theme.palette.primary.main,
							}}
						>
							{checked?.[value] === "COMPLETED"
								? t("account_center_security_card_kyc_completed_text")
								: t("account_center_security_card_kyc_pending_text")}
						</Typography>
					</Grid>
				</Grid>
			)}
			{profile.phoneNumberVerificationStatus === false || profile.phoneNumber === null ? noSms : ""}
			<Box
				component="img"
				src={icon}
				sx={{ position: "absolute", width: 75, height: 75, bottom: "-12px", right: "-8px" }}
			/>
		</Paper>
	);

	return (
		<>
			{processing && <PageCenteredProgress />}
			<RouteLayout
				headerComp={
					<Breadcrumbs
						paths={[
							{
								text: t("account_center_menu_main_title"),
								onClick: () => navigate("/account-center"),
							},
							{
								text: t("account_center_security_main_title"),
							},
						]}
					/>
				}
			>
				{open?.protection && (
					<Protection
						open={open?.protection}
						title={operations[action.type]?.otp?.[action.operation].title}
						explanation={operations[action.type]?.otp?.[action.operation].explanation}
						success={operations[action.type]?.success}
						operation={operation}
						onClose={() => setOpen()}
						sendOtp={(method, transactionId) =>
							sendOtp(method, transactionId).then((_) => {
								enqueueSnackbar(t("common:Code sent successfully"), { variant: "success" });
							})
						}
						otpAction={otpAction}
						onComplete={() => handleOtpComplete()}
					/>
				)}
				{open?.password && (
					<PasswordDialog open={open?.password} onClose={() => setOpen()} onNext={handleActivateC2fa} />
				)}
				<div
					style={{
						borderRadius: "8px",
						marginTop: "24px",
						marginRight: "84px",
						padding: "24px 16px 24px 16px",
						backgroundColor: "#fff",
					}}
				>
					<Grid container spacing={4}>
						{Object.values(operations).map(({ icon, title, text, value, noSms }, ix) => (
							<Grid item xs={6} key={ix}>
								<SecurityCard icon={icon} title={title} text={text} value={value} noSms={noSms} />
							</Grid>
						))}
					</Grid>
				</div>
			</RouteLayout>
		</>
	);
}
