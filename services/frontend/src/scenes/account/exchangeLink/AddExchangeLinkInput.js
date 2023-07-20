import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

import { Box, Button, Grid, Link, Paper, Typography } from "@mui/material";

import { EXCHANGE_TEXT_MAP } from "constants";
import { useSnackbar } from "notistack";

import { Breadcrumbs, Dialog, Protection, RouteLayout, TextField } from "components";

import { usePlatformApi } from "api/platform";
import useCatchError from "api/useCatchError";
import { useUserApi } from "api/user";

import { success } from "images";

import useOperations from "./Operations";

export default function AddExchangeLinkInput() {
	const { t } = useTranslation("accountCenter");

	const fields = [
		{
			key: "apiKey",
			label: t("account_center_connections_update_flow_api_key_title"),
		},
		{
			key: "apiSecret",
			label: t("account_center_connections_update_flow_api_secret_title"),
		},
		{
			key: "starkPrivateKey",
			label: "Stark Private Key",
		},
		{
			key: "passphrase",
			label: "Passphrase",
		},
		{
			key: "walletAddress",
			label: "Wallet Address",
		},
	];

	const [input, setInput] = useState({});
	const [error, setError] = useState({});
	const [passwordOpen, setPasswordOpen] = useState(false);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [operation, setOperation] = useState();

	const navigate = useNavigate();
	const { state } = useLocation();
	const { type, platform } = state;
	const { enqueueSnackbar } = useSnackbar();
	const { operations } = useOperations();

	const { addConnection, updateConnection } = usePlatformApi();
	const { sendOtp: sendOtpService } = useUserApi();
	const catchError = useCatchError();

	const validate = () => {
		let err = {
			...(!input.name && { name: true }),
			...fields.reduce((acc, curr) => {
				curr.key in platform?.requiredConnectionFields && !input?.[curr.key] && (acc[curr.key] = true);
				return acc;
			}, {}),
		};

		setError(err);

		return Object.keys(err).length !== 0;
	};

	const handleNext = () => {
		if (validate()) {
			enqueueSnackbar(t("account_center_connections_update_flow_warning"), { variant: "error" });
			return;
		}

		if (type === "add") {
			addConnection({ exchange: platform.exchange, ...input })
				.then(() => setDialogOpen(true))
				.catch((err) => {
					enqueueSnackbar(t("common:Bir hata ile karşılaşıldı"), { variant: "error" });
				});
		}

		if (type === "update") {
			setOperation({
				path: "/connection-update",
				body: { exchange: platform.exchange, ...input },
				method: "POST",
			});
			setPasswordOpen(true);
		}
	};

	const handleClose = () => {
		setDialogOpen(false);
		navigate("/exchange-link");
	};

	const sendOtp = (method, transactionId) =>
		sendOtpService(method, transactionId)
			.then((data) => {
				if (data?.error?.code === "601") {
					enqueueSnackbar(t("Email güvenliği aktif değil."), { variant: "error" });
					return;
				}

				enqueueSnackbar(t("login.Code sent successfully"), { variant: "success" });
			})
			.catch(catchError);

	const otpAction = (operation, body, transactionId) => updateConnection({ operation, body, transactionId });

	const handleOtpComplete = () => {
		setPasswordOpen(false);

		navigate("/exchange-link");
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
							text: t("account_center_connections_main_title"),
							onClick: () => navigate("/exchange-link"),
						},
						{
							text: t("account_center_connections_add_flow_update_title"),
						},
					]}
				/>
			}
		>
			{passwordOpen && (
				<Protection
					open={passwordOpen}
					title={operations.update?.otp.title}
					explanation={operations.update?.otp.explanation}
					success={operations.update.success}
					operation={operation}
					sendOtp={sendOtp}
					otpAction={otpAction}
					onComplete={() => handleOtpComplete()}
				/>
			)}
			<Dialog
				dialogProps={{ open: dialogOpen, onClose: handleClose }}
				title={<Box component="img" src={success} />}
				content={
					<>
						<Typography component="h1" variant="h4" sx={{ mt: 2, textAlign: "center" }}>
							{t("account_center_connections_add_flow_modal_title")}
						</Typography>
						<Typography sx={{ mt: 2, textAlign: "center" }}>
							{t("account_center_connections_add_flow_modal_text")}
						</Typography>
						<Button
							variant="contained"
							sx={{ width: 300, mt: 2 }}
							color="primary"
							onClick={() => navigate("../")}
						>
							{t("account_center_connections_add_flow_button_1_text")}
						</Button>
						<Button
							variant="contained"
							sx={{ width: 300, mt: 2 }}
							color="secondary"
							onClick={() => navigate("../exchange-link")}
						>
							{t("account_center_connections_add_flow_button_2_text")}
						</Button>
					</>
				}
			></Dialog>
			<Grid container>
				<Grid item xs={12}>
					<Paper sx={{ backgroundColor: "#FFFFFF", padding: 4, mt: 2, mr: 6 }}>
						<Grid container>
							<Grid item xs={12}>
								<Typography fontWeight={"Bold"} sx={{ fontSize: "24px" }}>
									{type === "add"
										? t("account_center_connections_add_flow_sub_title")
										: t("account_center_connections_update_flow_sub_title")}
								</Typography>
							</Grid>
							<Grid item xs={12}>
								<Typography sx={{ mt: 2, fontSize: "14px" }}>
									{type === "add"
										? t("account_center_connections_add_flow_sub_text")
										: t("account_center_connections_update_flow_sub_text")}
								</Typography>
							</Grid>
							<Paper
								sx={{
									mt: 3,
									backgroundColor: "#F4F5FC",
									width: "100%",
									padding: 2,
									display: "flex",
									flexDirection: "column",
									alignItems: "center",
								}}
							>
								<TextField
									size="small"
									fullWidth
									containerProps={{ sx: { width: "374px" } }}
									label={t("account_center_connections_update_flow_account_name_title")}
									error={error?.name}
									onChange={(e) => setInput({ ...input, name: e.target.value })}
									onKeyDown={(e) => e.key === "Enter" && handleNext()}
								/>
								{fields.map((field, ix) => (
									<>
										{field.key in platform?.requiredConnectionFields && (
											<TextField
												key={ix}
												size="small"
												fullWidth
												label={field.label}
												error={error?.[field.key]}
												containerProps={{ sx: { width: "374px", mt: 2 } }}
												labelProps={{
													sx: { mt: 1, color: (theme) => theme.palette.primary.main },
												}}
												onChange={(e) => setInput({ ...input, [field.key]: e.target.value })}
												onKeyDown={(e) => e.key === "Enter" && handleNext()}
											/>
										)}
									</>
								))}
								<Box textAlign="center" sx={{ mt: 4 }}>
									<Link href={platform?.info?.source} variant="body2" target="_blank">
										{t(`account_center_connections_update_flow_exchange_direction_text`, {
											exchange: EXCHANGE_TEXT_MAP[platform.exchange],
										})}
									</Link>
								</Box>
							</Paper>
						</Grid>
					</Paper>
					<Grid container justifyContent="space-between">
						<Grid item></Grid>
						<Grid item sx={{ mt: 3 }}>
							<Button variant="contained" sx={{ width: 300, mr: 6 }} onClick={handleNext}>
								{t("account_center_connections_update_flow_button_next")}
							</Button>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</RouteLayout>
	);
}
