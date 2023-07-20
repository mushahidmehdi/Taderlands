import * as React from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import { Box, Button, Typography } from "@mui/material";

import { useSnackbar } from "notistack";

import { Dialog, OtpDialog, TextField } from "components";
import SuccessDialog from "components/Protection/SuccessDialog";

import useCatchError from "api/useCatchError";
import { useUserApi } from "api/user";

import { useFetchAuthorized } from "services";
import Config from "services/config";

import { Success, verificationCode } from "images";

export default function ChangePassword({ open, setOpen, onClose }) {
	const { profile } = useSelector((state) => state.user);

	const [openOtp, setOpenOtp] = useState(false);
	const [openSuccess, setOpenSuccess] = useState(false);

	const [currentPassword, setCurrentPassword] = useState();
	const [password1, setPassword1] = useState();
	const [password2, setPassword2] = useState();
	const [error, setError] = useState(false);
	const [transactionId, setTransactionId] = useState();
	const [operation, setOperation] = useState();

	const { t } = useTranslation("accountCenter");
	const { enqueueSnackbar } = useSnackbar();
	const fetchAuthorized = useFetchAuthorized();

	const { sendOtp, startTransaction } = useUserApi();
	const catchError = useCatchError();

	const prepareData = () => {
		setError({
			currentPassword: !currentPassword,
			password1: !password1,
			password2: !password2,
		});

		if (!currentPassword || !password1 || !password2) {
			return;
		}

		if (password1 !== password2) {
			enqueueSnackbar("common:Passwords do not match");
			setError(true);
			return;
		}

		setOperation({ path: "/password/update", body: { newPassword: password1 }, method: "POST" });

		return {
			operation: { path: "/password/update", body: { newPassword: password1 }, method: "POST" },
			password: currentPassword,
		};
	};

	const handleNext = () => {
		const body = prepareData();

		startTransaction(body.operation, body.password)
			.then((data) => {
				if (data.data?.transactionId) {
					setTransactionId(data.data?.transactionId);
					onClose();
					setOpenOtp(true);
					return;
				}
			})
			.catch(catchError);
	};

	const handleFinalizeChangePassword = ({ emailCode, smsCode, twofaCode }) => {
		fetchAuthorized(`${Config.apiRoot() + "/user" + operation.path}`, {
			headers: {
				"Content-type": "application/json",
				"x-transaction-id": transactionId,
			},
			method: operation.method,
			body: JSON.stringify({
				...operation?.body,
				emailCode,
				smsCode,
				twofaCode,
			}),
		})
			.then((res) => res.json())
			.then(() => {
				setOpenOtp(false);
				setOpenSuccess(true);
			});
	};

	return (
		<React.Fragment>
			{openOtp && (
				<OtpDialog
					open={openOtp}
					onClose={() => setOpenOtp()}
					onNext={handleFinalizeChangePassword}
					title={t("account_center_settings_change_password_otp_title")}
					explanation={t("account_center_settings_change_password_otp_text")}
					sendOtp={(method, transactionId) =>
						sendOtp(method, transactionId)
							.then(() => {
								enqueueSnackbar(t("common:Code sent successfully"), { variant: "success" });
							})
							.catch(catchError)
					}
					settings={profile.userSecuritySetting}
					transactionId={transactionId}
				/>
			)}
			{openSuccess && (
				<SuccessDialog
					open={openSuccess}
					onClose={() => setOpenSuccess()}
					title={t("account_center_settings_update_protection_success_title")}
					content={<Typography>{t("account_center_settings_change_password_success_text")}</Typography>}
					icon={<Success />}
				/>
			)}
			<Dialog
				dialogProps={{ open, onClose }}
				content={
					<>
						<Box component="img" src={verificationCode} sx={{ mt: 2 }} />
						<Typography fontWeight="bold" sx={{ mt: 2, fontSize: "24px" }}>
							{t("account_center_settings_change_password_title")}
						</Typography>
						<Typography>{t("account_center_settings_change_password_text")}</Typography>
						<TextField
							error={error.currentPassword}
							label={t("account_center_settings_change_password_current")}
							fullWidth
							type="password"
							onChange={(e) => setCurrentPassword(e.target.value)}
						/>
						<TextField
							error={error.password1}
							label={t("account_center_settings_change_password_new")}
							fullWidth
							type="password"
							onChange={(e) => setPassword1(e.target.value)}
						/>
						<TextField
							error={error.password2}
							label={t("account_center_settings_change_password_new_again")}
							fullWidth
							type="password"
							onChange={(e) => setPassword2(e.target.value)}
						/>
					</>
				}
				action={
					<Button variant="contained" sx={{ width: 300 }} onClick={handleNext}>
						{t("common:Next")}
					</Button>
				}
			></Dialog>
		</React.Fragment>
	);
}
