import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { Button, Grid, Link, Paper, TextField, Typography } from "@mui/material";

import { useSnackbar } from "notistack";

import { Dialog, Protection, RouteLayout } from "components";

import { usePaymentApi } from "api/payment";
import useCatchError from "api/useCatchError";

import { IslemSirasi, Risk, WallClock } from "images";

export default function Withdraw() {
	const { wallet } = useSelector((state) => state.wallet);

	const [open, setOpen] = useState(false);
	const [operation, setOperation] = useState(false);
	const [address, setAddress] = useState();
	const [amount, setAmount] = useState();
	const [error, setError] = useState();
	const [agreementOpen, setAgreementOpen] = useState();

	const navigate = useNavigate();
	const { enqueueSnackbar } = useSnackbar();
	const { t } = useTranslation("wallet");

	const { startWithdrawalTransaction, completeWithdrawal, sendOtpCode } = usePaymentApi();
	const catchError = useCatchError();

	const MIN_WITHDRAW_AMOUNT = 10;
	const MAX_WITHDRAW_AMOUNT = 10 * 1000;
	const WITHDRAW_THRESHOLD_AMOUNT = 50;

	const validate = () => {
		if (!address) {
			setError({ address: true });
			enqueueSnackbar(t("wallet_withdraw_withdraw_address_should_exist"), { variant: "error" });
			return;
		}

		if (!amount) {
			setError({ amount: true });
			enqueueSnackbar(t("wallet_withdraw_withdraw_amount_should_exist"), { variant: "error" });
			return;
		}

		if (amount < MIN_WITHDRAW_AMOUNT) {
			setError({ amount: true });
			enqueueSnackbar(t("wallet_withdraw_withdraw_amount_input_warning_min_balance"), { variant: "error" });
			return;
		}

		if (amount > MAX_WITHDRAW_AMOUNT) {
			setError({ amount: true });
			enqueueSnackbar(t("wallet_withdraw_withdraw_amount_input_warning_max_balance"), { variant: "error" });
			return;
		}

		if (wallet?.realBalance < WITHDRAW_THRESHOLD_AMOUNT && amount !== wallet?.realBalance) {
			setError({ amount: true });
			enqueueSnackbar(t("wallet_withdraw_withdraw_amount_input_warning_treshold_balance"), { variant: "error" });
			return;
		}

		if (amount > wallet?.realBalance) {
			setError({ amount: true });
			enqueueSnackbar(t("wallet_withdraw_withdraw_amount_larger_than_balance"), { variant: "error" });
			return;
		}

		return true;
	};

	const handleNext = () => {
		if (!validate()) {
			return;
		}

		setOperation({
			path: "/coinspaid/withdrawal/confirm",
			body: { currency: "USDT", amount, address, network: { name: "Tron", code: "TRON-20" } },
			method: "POST",
		});

		setOpen(true);
	};

	const sendOtp = (method, transactionId) => {
		return sendOtpCode(method, transactionId)
			.then((data) => {
				if (data?.error?.code) {
					enqueueSnackbar(t("Bir hata ile karşılaşıldı"), { variant: "error" });
					return;
				}
				enqueueSnackbar(t("login.Code sent successfully"), { variant: "success" });
			})
			.catch(catchError);
	};

	const otpAction = (operation, body, transactionId) => completeWithdrawal({ operation, body, transactionId });

	const handleOtpComplete = () => {
		setOpen(false);
		navigate("/payment");
	};

	const handleAgreementClose = () => {
		setAgreementOpen(false);
	};

	const AgreementDialog = () => (
		<Dialog
			dialogProps={{ open: agreementOpen, onClose: handleAgreementClose }}
			title={<Risk />}
			content={
				<Paper
					sx={{
						boxShadow: 0,
						backgroundColor: "#FFFFFF",
						padding: 2,
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						textAlign: "center",
					}}
				>
					<Typography fontWeight={"Bold"} sx={{ mt: 2, fontSize: "24px" }}>
						{t("wallet_withdraw_agreement_title")}
					</Typography>
					<Typography sx={{ whiteSpace: "pre-line", mt: 2, fontSize: "14px" }}>
						{t("wallet_withdraw_agreement_text")}
						{t("wallet_withdraw_agreement_text_tail")}
						<Link target="_blank" href={`${window.location.origin}/agreements?tab=4`}>
							{t("wallet_withdraw_agreement_kyc_aml")}
						</Link>
						.
					</Typography>
					<Button
						variant="contained"
						sx={{ width: 300, mt: 2 }}
						color="primary"
						onClick={() => handleAgreementClose()}
					>
						{t("wallet_withdraw_agreement_button")}
					</Button>
				</Paper>
			}
		></Dialog>
	);

	return (
		<>
			{agreementOpen && <AgreementDialog />}
			{open && (
				<Protection
					open={open}
					title={t("common:otp_email_verification_code")}
					explanation={t("common:otp_email_verification_code_text")}
					success={{
						icon: <IslemSirasi />,
						title: (
							<Typography fontWeight={"Bold"} sx={{ mt: 2, fontSize: "24px" }}>
								{t("wallet_withdraw_success_title")}
							</Typography>
						),
						content: (
							<Typography sx={{ mt: 2, fontSize: "14px" }}>
								{t("wallet_withdraw_success_text")}
							</Typography>
						),
					}}
					operation={operation}
					onClose={() => setOpen()}
					onPasswordNext={startWithdrawalTransaction}
					sendOtp={sendOtp}
					otpAction={otpAction}
					onComplete={() => handleOtpComplete()}
				/>
			)}
			<RouteLayout header={t("wallet_withdraw_main_title")}>
				<Grid container spacing={2} marginRight="4vw">
					<Grid item xs={12} md={8}>
						<Paper
							sx={{
								boxShadow: 0,
								backgroundColor: "#FFFFFF",
								padding: 4,
								display: "flex",
								flexDirection: "column",
								alignItems: "start",
								minHeight: "95%",
							}}
						>
							<Typography
								fontWeight={"Bold"}
								sx={{
									fontSize: "24px",
									mt: 2,
									color: (theme) => theme.palette.primary.main,
								}}
							>
								{t("wallet_withdraw_address_title")}
							</Typography>

							<TextField
								sx={{ mt: 2, width: "375px", maxWidth: "100%" }}
								error={error?.address}
								label={t("wallet_withdraw_address_placeholder_text")}
								onChange={(e) => {
									setAddress(e.target.value);
									setError({ ...error, address: false });
								}}
							/>
							<Typography
								fontWeight={"Bold"}
								sx={{
									fontSize: "12px",
									width: "375px",
									maxWidth: "100%",
									textAlign: "center",
									mt: 1,
									color: (theme) => theme.palette.secondary.main,
								}}
							>
								{t("wallet_withdraw_address_warning_text")}
							</Typography>

							<TextField
								sx={{ mt: 2, width: "375px", maxWidth: "100%" }}
								error={error?.amount}
								label={t("wallet_withdraw_amount_placeholder_text")}
								type="number"
								onChange={(e) => {
									setAmount(parseFloat(e.target.value));
									setError({ ...error, amount: false });
								}}
							/>

							<Typography
								sx={{
									fontSize: "12px",
									width: "375px",
									maxWidth: "100%",
									textAlign: "start",
									mt: 1,
									color: (theme) => theme.palette.primary.main,
								}}
							>
								{t("There will be a $1.8 network fee on your transaction.")}
							</Typography>
						</Paper>
					</Grid>
					<Grid item xs={12} md={4}>
						<Paper
							sx={{
								boxShadow: 0,
								backgroundColor: "#FFFFFF",
								padding: 2,
								display: "flex",
								flexDirection: "column",
								alignItems: "start",
								minHeight: "300px",
							}}
						>
							<WallClock />

							<Typography fontWeight={"Bold"} sx={{ fontSize: "24px", mt: 1 }}>
								{t("wallet_withdraw_balance_info_title")}
							</Typography>

							<Typography sx={{ color: (theme) => theme.palette.primary.main, fontSize: "24px", mt: 1 }}>
								{"₮" + wallet?.realBalance.toFixed(2)}
							</Typography>

							<Typography sx={{ mt: 1, fontSize: "12px" }}>
								{t("wallet_deposit_transfer_information_card_text_withdraw")}
							</Typography>
							<Typography sx={{ mt: 1, fontSize: "12px" }}>
								{t("wallet_deposit_transfer_information_card_text_below")}
							</Typography>
						</Paper>
						<Button
							variant="contained"
							onClick={(x) => {
								handleNext();
							}}
							fullWidth
							sx={{ mt: 2, fontSize: "16px" }}
						>
							{t("wallet_withdraw_continue_button_text")}
						</Button>
						<Typography sx={{ fontSize: "14px", textAlign: "center", mt: 1, p: 1 }}>
							{t("wallet_withdraw_continue_button_disclaimer_text_1")}
							<Typography
								component="span"
								color="secondary"
								fontSize="14px"
								sx={{ cursor: "pointer", textDecoration: "underline" }}
								onClick={(x) => setAgreementOpen(true)}
							>
								{t("wallet_withdraw_continue_button_disclaimer_text_2")}
							</Typography>
							{t("wallet_withdraw_continue_button_disclaimer_text_3")}
						</Typography>
					</Grid>
				</Grid>
			</RouteLayout>
		</>
	);
}
