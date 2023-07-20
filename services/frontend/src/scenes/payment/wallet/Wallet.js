import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
	Button,
	CircularProgress,
	Grid,
	IconButton,
	Link,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TablePagination,
	TableRow,
	Typography,
} from "@mui/material";

import dayjs from "dayjs";

import { Dialog, RouteLayout } from "components";
import CustomTableHead from "components/CustomTableHead";
import PageCenteredProgress from "components/PageCenteredProgress";

import { useDashboardApi } from "api/dashboard";
import { useUserApi } from "api/user";

import { setProfile } from "actions/UserActions";
import { setWallet } from "actions/WalletActions";

import { ArrowMiniRight, Deposit, Risk, Withdraw } from "images";

import WithdrawDisabled from "./WithdrawDisabled";

const TRANSACTIONS_HEAD_CELLS = (t) => [
	{
		id: "date",
		label: t("wallet_transactions_table_date_title"),
	},
	{
		id: "type",
		label: t("wallet_transactions_table_type_title"),
	},
	{
		id: "credit",
		label: t("wallet_transactions_table_credit_title"),
	},
];

export default function Wallet() {
	const MIN_WITHDRAW_AMOUNT = 10;

	const { profile } = useSelector((state) => state.user);
	const { wallet } = useSelector((state) => state.wallet);

	const [processing, setProcessing] = useState(true);
	const [transactions, setTransactions] = useState();
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [page, setPage] = useState(0);
	const [agreementOpen, setAgreementOpen] = useState();

	const navigate = useNavigate();
	const { t } = useTranslation("wallet");
	const dispatch = useDispatch();
	const { getTransactionSummary, getWallet } = useDashboardApi();
	const { updateAgreement } = useUserApi();

	const kycNotCompleted = profile?.userSecuritySetting?.kycStatus !== "COMPLETED";
	const balanceTooLow = wallet?.realBalance < MIN_WITHDRAW_AMOUNT;

	const handleRowsPerPageChange = (event) => {
		setRowsPerPage(parseInt(event.target.value));
	};

	const handlePageChange = (_, newPage) => {
		setPage(newPage);
	};

	const handleWithdraw = () => {
		navigate("/payment/withdraw");
	};

	useEffect(() => {
		Promise.all([
			getTransactionSummary().then((data) => setTransactions(data)),
			getWallet().then((data) => dispatch(setWallet(data))),
		])
			.then(() => {
				setProcessing(false);
			})
			.catch((err) => {});
	}, []);

	const handleAgreementClose = () => {
		setAgreementOpen(false);
	};

	const handleAgreementButton = () => {
		const body = { agreements: { amlDisclaimer: true } };

		updateAgreement(body)
			.then((data) => {
				dispatch(setProfile({ ...profile, aggreements: { ...profile.agreements, amlDisclaimer: true } }));
				navigate("/payment/crypto-deposit");
			})
			.catch((err) => {});
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
						onClick={() => handleAgreementButton()}
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
			{processing ? (
				<PageCenteredProgress open={processing} />
			) : (
				<RouteLayout header={t("wallet_info_card_balance_title")}>
					<Grid container sx={{ flexDirection: { xs: "column-reverse", md: "row" } }}>
						<Grid item xs={12} md={8}>
							{transactions ? (
								<TableContainer>
									<Table
										sx={{
											maxWidth: "100%",
											borderCollapse: "separate",
											borderSpacing: "0 0.75rem",
										}}
									>
										<CustomTableHead expand headCells={TRANSACTIONS_HEAD_CELLS(t)} />
										<TableBody
											sx={{
												backgroundColor: "white",
											}}
										>
											{transactions
												?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
												?.map((item, index) => {
													return (
														<>
															<TableRow key={index}>
																<TableCell>
																	<Typography>
																		{dayjs(item.transactionDate).format("MMM DD")}
																	</Typography>
																</TableCell>
																<TableCell>
																	<Typography>
																		{item.source.charAt(0).toUpperCase() +
																			item.source.slice(1).toLowerCase()}
																	</Typography>
																</TableCell>
																<TableCell>
																	<Typography
																		sx={{
																			color: (theme) =>
																				item?.amount < 0
																					? theme.palette.info.dark
																					: theme.palette.primary.main,
																		}}
																	>
																		{item?.amount < 0
																			? "-₮" +
																			  (item?.amount * -1)
																					.toFixed(4)
																					.replace(/(\.0+|0+)$/, "")
																			: "₮" +
																			  item?.amount
																					?.toFixed(4)
																					.replace(/(\.0+|0+)$/, "")}
																	</Typography>
																</TableCell>
																<TableCell>
																	<IconButton
																		sx={{
																			"&:hover": {
																				backgroundColor: "inherit",
																			},
																		}}
																		onClick={() => {
																			var date = new Date(item.transactionDate);
																			navigate({
																				pathname: "transaction-details",
																				search: `?transactionDateGte=${
																					item?.transactionDate
																				}&transactionDatelt=${new Date(
																					date.setDate(date.getDate() + 1)
																				).toISOString()}&source=${
																					item?.source
																				}`,
																			});
																		}}
																	>
																		<ArrowMiniRight />
																	</IconButton>
																</TableCell>
															</TableRow>
														</>
													);
												})}
										</TableBody>
									</Table>
								</TableContainer>
							) : (
								<CircularProgress />
							)}
							{transactions?.length && (
								<TablePagination
									rowsPerPageOptions={[5, 10, 25, 50]}
									component="div"
									count={transactions?.length}
									rowsPerPage={rowsPerPage}
									page={page}
									onPageChange={handlePageChange}
									onRowsPerPageChange={handleRowsPerPageChange}
								/>
							)}
						</Grid>

						<Grid item xs={12} md={4}>
							<Paper
								sx={{
									boxShadow: 0,
									backgroundColor: "#FFFFFF",
									padding: 2,
									ml: 1,
									mt: 1,
								}}
							>
								<div
									style={{
										display: "flex",
										flexDirection: "column",
										alignItems: "center",
									}}
								>
									<Typography fontWeight={"Bold"} sx={{ fontSize: "24px" }}>
										{t("wallet_info_card_balance_title")}
									</Typography>

									<Typography
										fontWeight={"Bold"}
										sx={{
											fontSize: "40px",
											mt: 2,
											color: (theme) => theme.palette.primary.main,
										}}
									>
										{`₮${(wallet?.bonusBalance + wallet?.realBalance)
											?.toFixed(4)
											.replace(/(\.0+|0+)$/, "")}`}
									</Typography>

									<Typography
										fontWeight={"Bold"}
										sx={{
											fontSize: "12px",
											color: (theme) => theme.palette.secondary.main,
										}}
									>
										{`( ₮${wallet?.bonusBalance?.toFixed(4).replace(/(\.0+|0+)$/, "")}`}
										{t("wallet_info_card_reward_credit_sub_title")}
									</Typography>
								</div>

								<>
									<Button
										startIcon={<Deposit style={{ width: "42px" }} />}
										variant="contained"
										fullWidth
										sx={{ p: 2, mt: 1, borderRadius: "8px", justifyContent: "flex-start" }}
										onClick={(e) =>
											profile?.agreements?.amlDisclaimer
												? navigate("/payment/crypto-deposit")
												: setAgreementOpen(true)
										}
									>
										{t("wallet_info_card_deposit_title")}
									</Button>

									<Button
										startIcon={<Withdraw style={{ width: "42px" }} />}
										variant="contained"
										fullWidth
										sx={{ p: 2, mt: 1, borderRadius: "8px", justifyContent: "flex-start" }}
										onClick={() => handleWithdraw()}
										disabled={kycNotCompleted || balanceTooLow}
									>
										{t("wallet_info_card_withdraw_title")}
									</Button>
									<WithdrawDisabled
										type={
											kycNotCompleted ? "KYC_REQUIRED" : balanceTooLow ? "BALANCE_TOO_LOW" : null
										}
									/>
								</>
							</Paper>
						</Grid>
					</Grid>
				</RouteLayout>
			)}
		</>
	);
}
