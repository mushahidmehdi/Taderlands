import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { Box, Button, Grid, Paper, Radio, Typography } from "@mui/material";

import { useSnackbar } from "notistack";

import { Dialog, PageCenteredProgress, Protection } from "components";
import SuccessDialog from "components/Protection/SuccessDialog";

import { usePlatformApi } from "api/platform";
import useCatchError from "api/useCatchError";
import { useUserApi } from "api/user";

import { setConnections } from "actions/ConnectionActions";

import useOperations from "./Operations";

export default function ExchangeLinkOperations({ operationsOpen, setOperationsOpen, connection, platform }) {
	const [processing, setProcessing] = useState(false);
	const [selected, setSelected] = useState();
	const [operation, setOperation] = useState();
	const [open, setOpen] = useState({ protection: false, removeWarning: false, success: false });

	const { t } = useTranslation("accountCenter");
	const navigate = useNavigate();
	const { enqueueSnackbar } = useSnackbar();
	const dispatch = useDispatch();
	const { operations } = useOperations();

	const { recheckConnection, getConnections, updateConnection } = usePlatformApi();
	const { sendOtp } = useUserApi();
	const catchError = useCatchError();

	const handleNext = () => {
		if (selected === "check") {
			checkConnection();
			return;
		}

		if (selected === "delete") {
			setOperationsOpen(false);
			setOpen({ removeWarning: true });
			return;
		}

		if (selected === "update") {
			navigate("../exchange-link/add-input", {
				state: { type: "update", platform },
			});
			return;
		}

		if (selected === "disable") {
			setOperation({
				path: `/connection/:exchange/active`,
				body: {
					exchange: connection?.platform?.exchange,
					isActive: false,
				},
				method: "POST",
			});
		}

		if (selected === "enable") {
			setOperation({
				path: `/connection/:exchange/active`,
				body: {
					exchange: connection?.platform?.exchange,
					isActive: true,
				},
				method: "POST",
			});
		}

		setOperationsOpen(false);
		setOpen({ protection: true });
	};

	const checkConnection = () => {
		setOperationsOpen(false);
		setProcessing(true);

		recheckConnection(connection?.platform?.exchange)
			.then(() => {
				setProcessing(false);
				setOpen({ success: true });
				getConnections()
					.then((data) =>
						dispatch(
							setConnections(
								data?.data?.connections?.reduce((group, connection) => {
									const { exchange } = connection.platform;
									group[exchange] = group[exchange] ?? [];
									group[exchange].push(connection);
									return group;
								}, {})
							)
						)
					)
					.catch((err) => {
						enqueueSnackbar(t("common:Bir hata ile karşılaşıldı"), { variant: "error" });
					});
			})
			.catch((err) => {
				enqueueSnackbar(t("common:Bir hata ile karşılaşıldı"), { variant: "error" });
			});
	};

	const otpAction = (operation, body, transactionId) =>
		updateConnection({
			operation: { ...operation, path: operation.path.replace(":exchange", operation.body.exchange) },
			body,
			transactionId,
		});

	const handleDeleteProceed = () => {
		setOperation({
			path: `/connection/:exchange/delete`,
			body: {
				exchange: connection?.platform?.exchange,
			},
			method: "DELETE",
		});

		setOperationsOpen(false);
		setOpen({ protection: true });
	};

	const handleOtpComplete = () => {
		getConnections()
			.then((data) =>
				dispatch(
					setConnections(
						data?.data?.connections?.reduce((group, connection) => {
							const { exchange } = connection.platform;
							group[exchange] = group[exchange] ?? [];
							group[exchange].push(connection);
							return group;
						}, {})
					)
				)
			)
			.catch((err) => {
				enqueueSnackbar(t("common:Bir hata ile karşılaşıldı"), { variant: "error" });
			});

		setOpen();
	};

	const handleOperationsClose = () => {
		setOperationsOpen(false);
	};

	const RemoveWarningDialog = ({ open, onClose, onContinue }) => (
		<Dialog
			dialogProps={{ open, onClose }}
			content={
				<>
					<Typography component="h5" variant="h5" sx={{ mt: 2, color: "#D92323" }}>
						{t("account_center_connections_delete_flow_warning_title")}
					</Typography>

					<Typography>{t("account_center_connections_delete_flow_warning_text")}</Typography>
				</>
			}
			action={
				<Button
					variant="contained"
					color="danger"
					sx={{ width: 300, color: "#fff" }}
					onClick={() => onContinue()}
				>
					{t("account_center_connections_delete_flow_button_text")}
				</Button>
			}
		></Dialog>
	);

	const Operation = ({ icon, title, text, value, color }) => (
		<Paper
			sx={{
				width: "504px",
				mt: 2,
				borderColor: selected === value ? color : "#CFD2FA",
				backgroundColor: selected === value ? "#F4F5FC" : "#FFFFFF",
			}}
			variant="outlined"
		>
			<Grid container>
				<Grid item xs={2} sx={{ alignSelf: "center" }}>
					<Box component="img" src={icon} sx={{ ml: 2 }} />
				</Grid>
				<Grid item xs={9}>
					<Typography fontWeight={"Bold"} color={color} sx={{ mt: 2, fontSize: "16px" }}>
						{title}
					</Typography>
					<Typography sx={{ mt: 1, fontSize: "10px" }}>{text} </Typography>
				</Grid>
				<Grid item xs={1} sx={{ alignSelf: "center" }}>
					<Radio
						sx={{ color: color }}
						checked={selected === value}
						value={value}
						onChange={(e) => setSelected(e.target.value)}
					/>
				</Grid>
			</Grid>
		</Paper>
	);

	return (
		<>
			{processing && <PageCenteredProgress />}
			{open?.protection && (
				<Protection
					open={open?.protection}
					title={operations[selected]?.otp.title}
					explanation={operations[selected]?.otp.explanation}
					success={operations[selected]?.success}
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

			{open?.removeWarning && (
				<RemoveWarningDialog
					open={open?.removeWarning}
					onClose={() => setOpen()}
					onContinue={() => handleDeleteProceed()}
				/>
			)}

			{open?.success && (
				<SuccessDialog
					open={open?.success}
					onClose={() => setOpen()}
					title={operations.check.success.title}
					content={operations.check.success.content}
					icon={operations.check.success.icon}
				/>
			)}

			<Dialog
				dialogProps={{ open: operationsOpen, onClose: handleOperationsClose }}
				title={t("account_center_connections_operations_main_title")}
				content={
					<>
						<Typography sx={{ fontSize: "14px" }}>
							{t("account_center_connections_operations_main_text")}
						</Typography>
						{Object.values(operations)
							.filter((x) => (connection?.isActive ? x.value !== "enable" : x.value !== "disable"))
							.map(({ icon, title, text, value, color }, ix) => (
								<Operation key={ix} icon={icon} title={title} text={text} value={value} color={color} />
							))}
					</>
				}
				action={
					<Button disabled={!selected} variant="contained" sx={{ width: 300 }} onClick={handleNext}>
						{t("account_center_security_card_button_next")}
					</Button>
				}
			/>
		</>
	);
}
