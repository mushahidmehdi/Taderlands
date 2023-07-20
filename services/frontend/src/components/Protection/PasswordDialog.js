import { useState } from "react";
import { useTranslation } from "react-i18next";

import { useSnackbar } from "notistack";

import { Button, Typography } from "@mui/material";

import { Dialog, TextField } from "components";
import { VerificationCode } from "images";

export default function PasswordDialog({ open, onClose, onNext }) {
	const [password, setPassword] = useState();
	const [error, setError] = useState();

	const { enqueueSnackbar } = useSnackbar();
	const { t } = useTranslation("common");

	const handleNext = () => {
		if (!password) {
			setError({ password: true });
			enqueueSnackbar(t("otp_input_password_empty"), { variant: "error" });
			return;
		}

		onNext(password);
	};

	return (
		<Dialog
			dialogProps={{ open, onClose }}
			content={
				<>
					<VerificationCode />
					<Typography fontWeight={"Bold"} sx={{ mt: 2, fontSize: "24px" }}>
						{t("otp_input_password_main_title")}
					</Typography>
					<Typography sx={{ mt: 1, fontSize: "14px" }}>{t("otp_input_password_main_text")}</Typography>
					<TextField
						fullWidth
						margin="normal"
						size="small"
						error={error?.password}
						label={t("Password")}
						type="password"
						onChange={(e) => setPassword(e.target.value)}
					/>
				</>
			}
			action={
				<Button variant="contained" sx={{ width: 300 }} onClick={() => handleNext()}>
					{t("btn_continue")}
				</Button>
			}
		/>
	);
}
