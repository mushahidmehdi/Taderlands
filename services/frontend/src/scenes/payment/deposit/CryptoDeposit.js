import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import QRCode from "react-qr-code";
import { useNavigate } from "react-router-dom";

import { Box, Button, Grid, IconButton, Paper, Radio, Typography } from "@mui/material";

import { useSnackbar } from "notistack";

import { Breadcrumbs, Dialog, RouteLayout } from "components";

import { usePaymentApi } from "api/payment";
import useCatchError from "api/useCatchError";

import { useFetchAuthorized } from "services";

import useCopyToClipboard from "utils/useCopyToClipboard";

import { Duplicate, IslemSirasi, Risk, UsdtTether, WallClock } from "images";

export default function CryptoDeposit() {
	const [warningOpen, setWarningOpen] = useState(false);
	const [successOpen, setSuccessOpen] = useState(false);
	const [userWalletAddress, setUserWalletAddress] = useState(null);

	const fetchAuthorized = useFetchAuthorized();
	const { enqueueSnackbar } = useSnackbar();
	const { t } = useTranslation("wallet");
	const navigate = useNavigate();
	const copyToClipboard = useCopyToClipboard();

	const { getWalletAddress } = usePaymentApi();
	const catchError = useCatchError();

	const handleWarningDialogClose = () => {
		setWarningOpen(false);
	};

	const handleSuccessDialogClose = () => {
		setSuccessOpen(false);
		navigate("/payment");
	};

	const handleNext = () => {
		setWarningOpen(false);
		navigate("/payment");
	};

	useEffect(() => {
		getWalletAddress({
			currency: "USDTT",
		})
			.then((resp) => setUserWalletAddress(resp?.data?.userWalletAddress?.address))
			.catch(catchError);
	}, []);

	const WarningDialog = () => (
		<Dialog
			dialogProps={{ open: warningOpen, onClose: handleWarningDialogClose }}
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
					<Risk />

					<Typography fontWeight={"Bold"} sx={{ mt: 2, fontSize: "24px" }}>
						{t("wallet_deposit_transfer_disclaimer_modal_title")}
					</Typography>

					<Typography sx={{ mt: 2, fontSize: "14px" }}>
						{t("wallet_deposit_transfer_disclaimer_modal_text")}
					</Typography>
				</Paper>
			}
			action={
				<Grid container>
					<Grid item xs={6} sx={{ textAlign: "center" }}>
						<Button variant="outlined" sx={{ width: "200px" }} onClick={handleWarningDialogClose}>
							{t("wallet_deposit_transfer_disclaimer_cancel_button_text")}
						</Button>
					</Grid>
					<Grid item xs={6} sx={{ textAlign: "center" }}>
						<Button variant="contained" sx={{ width: "200px" }} onClick={handleNext}>
							{t("wallet_deposit_transfer_disclaimer_continue_button_text")}
						</Button>
					</Grid>
				</Grid>
			}
		></Dialog>
	);

	const SuccessDialog = () => (
		<Dialog
			dialogProps={{ open: successOpen, onClose: handleSuccessDialogClose }}
			title={<IslemSirasi />}
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
						{t("wallet_deposit_transfer_success_title")}
					</Typography>
					<Typography sx={{ mt: 2, fontSize: "14px" }}>
						{t("wallet_deposit_transfer_success_text")}
					</Typography>
					<Button
						variant="outlined"
						sx={{ width: 300, mt: 2 }}
						color="primary"
						onClick={() => handleSuccessDialogClose()}
					>
						{t("wallet_deposit_transfer_success_close_button_text")}
					</Button>
				</Paper>
			}
		></Dialog>
	);

	return (
		<>
			{warningOpen && <WarningDialog></WarningDialog>}
			{successOpen && <SuccessDialog></SuccessDialog>}

			<RouteLayout
				header={
					<Breadcrumbs
						paths={[
							{
								text: t("wallet_transaction_title"),
								onClick: () => navigate("/payment"),
							},
							{
								text: t("wallet_deposit_transfer_main_title"),
							},
						]}
					/>
				}
			>
				<Grid container spacing={2}>
					<Grid item xs={12} md={8}>
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
							<Typography
								fontWeight={"Bold"}
								sx={{
									fontSize: "22px",
									mt: 2,
									ml: 2,
									color: (theme) => theme.palette.primary.main,
								}}
							>
								{t("wallet_deposit_transfer_address_main_title")}
							</Typography>
							<Paper
								sx={{
									mt: 2,
									ml: 2,
									minWidth: "90%",
									minHeight: "50px",
									borderColor: (theme) => theme.palette.primary.main,
									backgroundColor: (theme) => theme.palette.info.light,
								}}
								variant="outlined"
							>
								<Box display="flex" alignItems="center" justifyContent="space-between">
									<Box display="flex" alignItems="center" justifyContent="space-evenly">
										<Radio sx={{ color: (theme) => theme.palette.primary.main }} checked={true} />
										<UsdtTether />
										<Typography sx={{ fontSize: "14px" }}>{"USDT(Tether)"}</Typography>
									</Box>

									<Typography sx={{ fontSize: "10px", marginInlineEnd: "0.4rem", width: "4rem" }}>
										{t("wallet_deposit_transfer_tether_network_info")}
									</Typography>
								</Box>
							</Paper>
							<Typography
								sx={{
									mt: 3,
									fontSize: "16px",
									color: (theme) => theme.palette.primary.main,
									alignSelf: "center",
								}}
							>
								{t("wallet_deposit_transfer_address_sub_title")}
							</Typography>
							<Paper
								sx={{
									mt: 2,
									backgroundColor: "#F4F5FC",
									padding: 1,
									display: "flex",
									flexDirection: "column",
									alignItems: "center",
									alignSelf: "center",
								}}
							>
								<Box display="flex" justifyContent="space-between" alignItems="center">
									<Typography fontWeight={"Bold"} fontSize="12px">
										{userWalletAddress}
									</Typography>

									<IconButton
										onClick={(e) => {
											copyToClipboard(userWalletAddress, "Address Copied!");
										}}
										sx={{ ml: 0.2, mt: -0.5 }}
									>
										<Duplicate />
									</IconButton>
								</Box>
								{userWalletAddress && (
									<Box
										display="flex"
										justifyContent="space-between"
										alignItems="center"
										sx={{ mt: 2 }}
									>
										<QRCode value={userWalletAddress} />
									</Box>
								)}
							</Paper>
							<Typography
								fontWeight={"Bold"}
								sx={{
									mt: 2,
									fontSize: "12px",
									color: (theme) => theme.palette.secondary.main,
									alignSelf: "center",
								}}
							>
								{t("wallet_deposit_transfer_address_warning_text")}
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
								mb: 2,
								minHeight: "300px",
							}}
						>
							<WallClock />

							<Typography fontWeight={"Bold"} sx={{ ml: 2, mt: 1, fontSize: "24px" }}>
								{t("wallet_deposit_transfer_information_card_title")}
							</Typography>
							<Typography sx={{ ml: 2, mt: 1, fontSize: "12px" }}>
								{t("wallet_deposit_transfer_information_card_text_deposit")}
							</Typography>
							<Typography sx={{ ml: 2, mt: 1, fontSize: "12px" }}>
								{t("wallet_deposit_transfer_information_card_text_below")}
							</Typography>
							<Typography sx={{ ml: 2, mt: 1.2, fontSize: "12px" }}>
								{t("wallet_deposit_transfer_information_card_text_below_2")}
							</Typography>
						</Paper>
						<Box display="flex" mb={"1rem"}>
							<Button
								variant="contained"
								onClick={handleNext}
								sx={{
									width: "100%",
									padding: "0.8rem",
								}}
							>
								{t("wallet_deposit_address_continue_button_text")}
							</Button>
						</Box>
					</Grid>
				</Grid>
			</RouteLayout>
		</>
	);
}
