import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
	CircularProgress,
	Grid,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TablePagination,
	TableRow,
	Typography,
	useMediaQuery,
} from "@mui/material";

import dayjs from "dayjs";
import { useSnackbar } from "notistack";

import { Breadcrumbs, CustomButton, RouteLayout } from "components";
import CustomTableHead from "components/CustomTableHead";
import PageCenteredProgress from "components/PageCenteredProgress";

import { useFetchAuthorized } from "services";
import Config from "services/config";

import queryBuilder from "utils/queryBuilder";
import useQuery from "utils/useQuery";

import { Check, Filter as FilterSvg, Time } from "images";

import FilterDialog from "./FilterDialog";

const TRANSACTIONS_HEAD_CELLS = (t) => [
	{
		id: "date",
		label: t("wallet_transaction_details_page_table_date_title"),
	},
	{
		id: "source",
		label: t("wallet_transaction_details_page_table_source_title"),
	},
	{
		id: "type",
		label: t("wallet_transaction_details_page_table_type_title"),
	},
	{
		id: "credit",
		label: t("wallet_transaction_details_page_table_credit_title"),
	},
];

export default function TransactionDetails() {
	const { profile } = useSelector((state) => state.user);

	const [processing, setProcessing] = useState(true);
	const [transactions, setTransactions] = useState();
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [page, setPage] = useState(0);
	const [open, setOpen] = useState();
	const [dateColumn, setDateColumn] = useState();

	const fetchAuthorized = useFetchAuthorized();
	const { enqueueSnackbar } = useSnackbar();
	const navigate = useNavigate();
	const { t } = useTranslation("wallet");
	const query = useQuery();

	const matches = useMediaQuery("(max-width:900px)", { noSsr: true });

	const handleRowsPerPageChange = (event) => {
		setRowsPerPage(parseInt(event.target.value));
	};
	const handlePageChange = (_, newPage) => {
		setPage(newPage);
	};

	const getSummary = (filter) => {
		fetchAuthorized(`${Config.apiRoot()}/dashboard/wallet/transaction-details?${queryBuilder(filter)}`, {
			headers: {
				"Content-type": "application/json",
			},
			method: "GET",
		})
			.then((data) => data.json())
			.then((data) => {
				if (data?.error?.code) {
					enqueueSnackbar(t("Bir hata ile karşılaşıldı"), { variant: "error" });
					return;
				}
				setTransactions(data?.data?.walletTransactionDetails);
				setProcessing(false);
			})
			.catch((err) => {
				console.log(err);
				enqueueSnackbar(t("Bir hata ile karşılaşıldı"), { variant: "error" });
			});
	};

	useEffect(() => {
		const source = query.get("source");
		const transactionDateGte = query.get("transactionDateGte");
		const transactionDatelt = query.get("transactionDatelt");
		const status = query.get("status");
		const type = query.get("type");

		const filter = {
			...(source ? { source } : {}),
			...(transactionDateGte ? { transactionDateGte } : {}),
			...(transactionDatelt ? { transactionDatelt } : {}),
			...(status ? { status } : {}),
			...(type ? { type } : {}),
		};
		setDateColumn(dayjs(transactionDateGte).format("MMM DD"));

		getSummary(filter);
	}, [query]);

	return (
		<>
			{open && (
				<FilterDialog
					open={open}
					onClose={() => setOpen(false)}
					onSave={(data, selectedDate) => {
						setDateColumn(selectedDate);
						getSummary(data);
						setOpen(false);
					}}
				/>
			)}
			{processing ? (
				<PageCenteredProgress open={processing} />
			) : (
				<RouteLayout
					headerComp={
						!matches && (
							<Breadcrumbs
								paths={[
									{
										text: t("wallet_transaction_title"),
										onClick: () => navigate("/payment"),
									},
									{
										text:
											t("wallet_transaction_details_page_main_title") +
											"(" +
											(query.get("source") ?? query.get("source")) +
											")",
									},
								]}
							/>
						)
					}
				>
					<div style={{ marginRight: "4vw" }}>
						<Grid container>
							<Grid item xs={12} sx={{ display: "flex", width: "100%", justifyContent: "right" }} md={12}>
								<CustomButton icon={<FilterSvg />} text={t(`Filter`)} onClick={() => setOpen(true)} />
							</Grid>
							<Grid item xs={12}>
								{transactions ? (
									<TableContainer>
										<Table
											sx={{
												// minWidth: 750,
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
																		<Typography>{dateColumn}</Typography>
																	</TableCell>
																	<TableCell>
																		<Typography>
																			{item.source === "STRATEGY"
																				? profile?.strategyFollowers?.find(
																						({ strategy }) =>
																							strategy.id === item.pivot
																				  )?.strategy?.public === 1
																					? profile?.strategyFollowers?.find(
																							({ strategy }) =>
																								strategy.id ===
																								item.pivot
																					  )?.strategy?.marketStrategy?.name
																					: profile?.strategyFollowers?.find(
																							({ strategy }) =>
																								strategy.id ===
																								item.pivot
																					  )?.strategy?.name
																				: item.source === "REFERENCE" &&
																				  item.senderUsername
																				? item.senderUsername?.slice(0, 3) +
																				  "***" +
																				  item.senderUsername?.substring(
																						item.senderUsername?.indexOf(
																							"@"
																						)
																				  )
																				: item.source}
																		</Typography>
																	</TableCell>
																	<TableCell>
																		<Typography
																			sx={{
																				color: (theme) =>
																					item.type === "REAL"
																						? theme.palette.primary.main
																						: theme.palette.secondary.main,
																			}}
																		>
																			{item.type === "REAL"
																				? t(
																						"wallet_transaction_details_page_table_dynamic_credit_name"
																				  )
																				: t(
																						"wallet_transaction_details_page_table_reward_credit_name"
																				  )}
																		</Typography>
																	</TableCell>
																	<TableCell>
																		<Typography
																			sx={{
																				color: (theme) =>
																					profile?.id === item.senderId
																						? theme.palette.info.dark
																						: theme.palette.primary.main,
																			}}
																		>
																			{profile?.id === item.senderId
																				? "-₮" +
																				  item?._sum?.sentAmount
																						.toFixed(4)
																						.replace(/(\.0+|0+)$/, "")
																				: "₮" +
																				  item?._sum?.receivedAmount
																						?.toFixed(4)
																						.replace(/(\.0+|0+)$/, "")}
																		</Typography>
																	</TableCell>
																	<TableCell>
																		{item.status === "DONE" ? <Check /> : <Time />}
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
						</Grid>
					</div>
				</RouteLayout>
			)}
		</>
	);
}
