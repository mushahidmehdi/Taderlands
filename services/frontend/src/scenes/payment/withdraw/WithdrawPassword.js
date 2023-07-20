import * as React from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { useSnackbar } from "notistack";

import { Box, Button, Typography } from "@mui/material";

import { Dialog, TextField } from "components";
import { verificationCode } from "images";
import { useFetchAuthorized } from "services";
import Config from "services/config";

import WithdrawOtp from "./WithdrawOtp";

export default function WithdrawPassword({ passwordOpen, setPasswordOpen, address, amount }) {
	const [otpOpen, setOtpOpen] = useState(false);
	const [password, setPassword] = useState();
	const [error, setError] = useState({});
	const [transaction, setTransaction] = useState();
	const [operation, setOperation] = useState();

	const { t } = useTranslation();
	const { enqueueSnackbar } = useSnackbar();
	const fetchAuthorized = useFetchAuthorized();

	const handlePasswordClose = () => {
		setPasswordOpen(false);
	};

	const prepareData = () => {
		setError({
			password: !password,
		});

		if (!password) {
			return;
		}
		setOperation({
			path: "/coinspaid/withdrawal/confirm",
			body: { currency: "USDT", amount: amount, address: address, network: { name: "Tron", code: "TRON-20" } },
			method: "POST",
		});

		return {
			operation: {
				path: "/coinspaid/withdrawal/confirm",
				body: {
					currency: "USDT",
					amount: amount,
					address: address,
					network: { name: "Tron", code: "TRON-20" },
				},
				method: "POST",
			},
			password: password,
		};
	};

	const handleNext = () => {
		const body = prepareData();
		fetchAuthorized(`${Config.apiRoot()}/user/transaction/start`, {
			headers: {
				"Content-type": "application/json",
			},
			method: "POST",
			body: JSON.stringify(body),
		})
			.then((data) => data.json())
			.then((data) => {
				if (data?.error?.code) {
					enqueueSnackbar(t("Bir hata ile karşılaşıldı"), { variant: "error" });
					return;
				}

				if (data.data?.transactionId) {
					setTransaction(data.data?.transactionId);
					setOtpOpen(true);
					setPasswordOpen(false);
					return;
				}
			})
			.catch((err) => {
				enqueueSnackbar(t("Bir hata ile karşılaşıldı"), { variant: "error" });
			});
	};

	return (
		<React.Fragment>
			{otpOpen && (
				<WithdrawOtp
					otpOpen={otpOpen}
					setOtpOpen={setOtpOpen}
					operation={operation}
					transaction={transaction}
				></WithdrawOtp>
			)}
			<Dialog
				dialogProps={{ open: passwordOpen, onClose: handlePasswordClose }}
				content={
					<>
						<Box component="img" src={verificationCode} sx={{ mt: 2 }} />
						<Typography fontWeight={"Bold"} sx={{ mt: 2, fontSize: "24px" }}>
							{"Password"}
						</Typography>
						<Typography sx={{ mt: 1, fontSize: "14px" }}>
							{t("Güvenliğiniz bizim için önemli ile başlayan bir yazı gelmeli biraz uzun olsa iyi olur")}
						</Typography>
						<TextField
							fullWidth
							margin="normal"
							size="small"
							error={error?.password}
							label={t("login.Password")}
							type="password"
							onChange={(e) => setPassword(e.target.value)}
						/>
					</>
				}
				action={
					<Button variant="contained" sx={{ width: 300 }} onClick={handleNext}>
						{t("exchangeLink.Next")}
					</Button>
				}
			></Dialog>
		</React.Fragment>
	);
}
