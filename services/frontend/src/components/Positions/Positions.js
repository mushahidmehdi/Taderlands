import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
	Button,
	CircularProgress,
	Grid,
	IconButton,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TablePagination,
	TableRow,
	Typography,
} from "@mui/material";

import { CustomDate } from "components";
import CustomTableHead from "components/CustomTableHead";
import Dialog from "components/Dialog";

import { Collapse, Expand, Info } from "images";

import { POSITIONS_HEAD_CELLS } from "./Constants";
import { Pair, Price, Profit, Reason, Side } from "./columns";
import PercentChange from "./columns/PercentChange";
import { calculatePriceChange, QuoteSymbolMap } from "./utils";
import { roundOff } from "./utils/NumberHelper";

const DetailField = ({ value, label }) => (
	<Grid item>
		<Typography sx={{ fontSize: "12px", fontWeight: 700 }}>{label}</Typography>
		<Typography
			sx={{
				fontSize: "16px",
				fontWeight: 700,
				color: (theme) => theme.palette.primary.main,
			}}
		>
			{value}
		</Typography>
	</Grid>
);

export default function Positions({
	positions,
	filter,
	count,
	onPageChange,
	onRowsPerPageChange,
	hideLookup,
	onOrderChange,
}) {
	const [expand, setExpand] = useState(positions?.map((x) => false));
	const [open, setOpen] = useState(false);
	const [selectedErrorLog, setSelectedErrorLog] = useState();

	const { t } = useTranslation();
	const navigate = useNavigate();

	const { price: priceMap } = useSelector((state) => state.price);

	useEffect(() => {
		if (positions?.length) {
			setExpand(positions.map((_) => false));
		}
	}, [positions]);

	return (
		<>
			{positions ? (
				<TableContainer>
					<Table sx={{ minWidth: 750, borderCollapse: "separate", borderSpacing: "0 0.75rem" }}>
						<CustomTableHead
							expand
							headCells={POSITIONS_HEAD_CELLS(t, filter?.where?.status, hideLookup, onOrderChange)}
							order={filter?.orderBy}
							onOrderChange={onOrderChange}
						/>
						{positions.length <= 0 ? (
							<TableBody
								sx={{
									backgroundColor: "#fff",
									borderRadius: "8px",
								}}
							>
								<TableRow>
									<TableCell
										colSpan={POSITIONS_HEAD_CELLS(t, filter?.where?.status, hideLookup).length + 1}
									>
										<Typography sx={{ textAlign: "center" }}>
											{filter?.where?.status === "OPEN"
												? t("control_panel_positions_table_no_open_positions")
												: filter?.where?.status === "ERROR"
												? t("control_panel_positions_table_no_closed_positions_control_logs")
												: t("control_panel_positions_table_no_closed_positions")}
										</Typography>
									</TableCell>
								</TableRow>
							</TableBody>
						) : (
							<TableBody
								sx={{
									backgroundColor: filter?.where?.status === "OPEN" ? "white" : "#F0F0F5",
									mt: 4,
								}}
							>
								{positions?.map((item, index) => {
									const { tradingServicesErrorLog } = item;
									const { parity, strategy } = item.signal;
									const {
										executionType,
										platform,
										public: strategyPublic,
										user,
										marketStrategy,
									} = item.signal.strategy;
									const strategyName = marketStrategy?.name ?? item.signal.strategy?.name;

									const { name: platformName, info } = platform;
									const { platformKey } = info;
									const { nickname: merchantName } = user?.merchant ?? {};

									const {
										amountExecuted,
										enterPrice,
										enterDate,
										exitDate,
										exitPrice,
										drawUp,
										drawDown,
										profitInQuote,
										size,
									} = item.positionInfo;

									const { leverage } = item.positionSettings;

									const enterAmount = amountExecuted * enterPrice;

									const maximumDrawUp = drawUp?.price
										? (
												(executionType === "SHORT" ? -1 : 1) *
												((drawUp?.price - enterPrice) / enterPrice) *
												(leverage ?? 1) *
												100
										  ).toFixed(2)
										: 0;
									const maximumDrawDown = drawDown?.price
										? (
												(executionType === "SHORT" ? -1 : 1) *
												((drawDown?.price - enterPrice) / enterPrice) *
												(leverage ?? 1) *
												100
										  ).toFixed(2)
										: 0;

									const priceChange = calculatePriceChange(item, priceMap);

									const profitAmount =
										filter?.where?.status === "OPEN"
											? (size?.inQuote / (100 * (leverage ?? 1))) * priceChange
											: profitInQuote;

									return (
										<>
											<TableRow key={index}>
												{!hideLookup?.["pair"] && (
													<TableCell>
														<Pair parity={parity} />
													</TableCell>
												)}
												{!hideLookup?.["marketType"] && (
													<TableCell>
														<Side label={executionType} />
													</TableCell>
												)}
												{!hideLookup?.["exchange"] && <TableCell>{platformName}</TableCell>}
												<TableCell>
													<CustomDate date={enterDate} />
												</TableCell>
												{item.status === "CLOSED" && (
													<TableCell>
														<CustomDate date={exitDate} />
													</TableCell>
												)}
												{!hideLookup?.["expertStrategy"] && (
													<TableCell>
														<Typography
															fontWeight={500}
															sx={{
																cursor: "pointer",
															}}
															onClick={() =>
																strategy.public === 1 &&
																navigate(
																	`/marketplace/merchant/${strategy?.marketStrategy.merchantId}`
																)
															}
														>
															{strategyPublic
																? merchantName
																: t("control_panel_positions_own_strategy")}
														</Typography>
														<Typography
															sx={{
																cursor: "pointer",
															}}
															onClick={() =>
																strategy.public === 1 &&
																navigate(`/marketplace/strategy/${marketStrategy.id}`)
															}
														>
															{strategyName}
														</Typography>
													</TableCell>
												)}
												{item.status !== "ERROR" && (
													<>
														<TableCell>
															<Profit
																platformId={platform.id}
																quote={parity?.quote}
																profitAmount={profitAmount}
																virtual={item.virtual}
															/>
														</TableCell>
														<TableCell>
															<Price
																platformId={platform.id}
																quote={parity?.quote}
																price={
																	item?.status === "CLOSED"
																		? roundOff(exitPrice)
																		: priceMap?.[`${platformKey}-${parity.symbol}`]
																}
																priceChange={priceChange}
															/>
														</TableCell>
													</>
												)}
												{item.status === "CLOSED" && (
													<TableCell>
														<Typography>{item.positionInfo.exitBy}</Typography>
													</TableCell>
												)}
												{item.status !== "ERROR" && (
													<TableCell>
														<IconButton
															sx={{
																"&:hover": {
																	backgroundColor: "inherit",
																},
															}}
															onClick={() => {
																setExpand([
																	...expand.slice(0, index),
																	!expand[index],
																	...expand.slice(index + 1),
																]);
															}}
														>
															{expand?.[index] ? <Collapse /> : <Expand />}
														</IconButton>
													</TableCell>
												)}
												{item.status === "ERROR" && (
													<>
														<TableCell>
															<CustomDate date={tradingServicesErrorLog?.createdAt} />
														</TableCell>
														<TableCell>
															<Reason
																text={
																	tradingServicesErrorLog?.paraticaErrorCode
																		? t(
																				`tradingServicesErrorLog.reason.${tradingServicesErrorLog?.paraticaErrorCode}`
																		  )
																		: t(`tradingServicesErrorLog.reason.500`)
																}
															/>
														</TableCell>
														{t(
															`tradingServicesErrorLog.comment.${tradingServicesErrorLog?.paraticaErrorCode}`
														) && (
															<TableCell>
																<IconButton
																	onClick={() => {
																		setSelectedErrorLog(tradingServicesErrorLog);
																		setOpen(true);
																	}}
																>
																	<Info />
																</IconButton>
															</TableCell>
														)}
													</>
												)}
											</TableRow>
											{expand?.[index] && (
												<TableRow>
													<TableCell
														sx={{
															backgroundColor: (theme) =>
																theme.palette.background.default,
															border: "none",
														}}
														colSpan={
															POSITIONS_HEAD_CELLS(t, filter?.where?.status).length + 1
														}
													>
														<Grid
															container
															spacing={2}
															sx={{
																p: "8px",
																ml: "8px",
																width: "99%",
																borderRadius: "8px",
																backgroundColor: "#F4F5FD",
															}}
														>
															<DetailField
																label={t("control_panel_positions_table_enter_price")}
																value={`$${roundOff(enterPrice)}`}
															/>

															{!item?.virtual && enterAmount && (
																<DetailField
																	label={t(
																		"control_panel_positions_table_enter_amount"
																	)}
																	value={`${
																		platform.id === 1 && parity?.quote === "USD"
																			? "₿"
																			: QuoteSymbolMap[parity?.quote] ?? "$"
																	}${roundOff(size.inQuote)}`}
																/>
															)}

															{!item?.virtual &&
																size?.inUSDT !== size?.inQuote &&
																parity?.quote !== "USDT" && (
																	<DetailField
																		label={t("Position Size (USDT)")}
																		value={`${"$"}${roundOff(size?.inUSDT)}`}
																	/>
																)}
															<DetailField
																label={t("control_panel_positions_table_leverage")}
																value={`${executionType}${
																	leverage ? " x " + leverage : ""
																}`}
															/>

															<PercentChange
																label={t("control_panel_positions_table_max_du")}
																value={maximumDrawUp}
															/>
															<PercentChange
																label={t("control_panel_positions_table_max_dd")}
																value={maximumDrawDown}
															/>
														</Grid>
													</TableCell>
												</TableRow>
											)}
										</>
									);
								})}
							</TableBody>
						)}
					</Table>
				</TableContainer>
			) : (
				<CircularProgress />
			)}
			{open && (
				<Dialog
					dialogProps={{
						open,
						maxWidth: "lg",
						onClose: () => {
							setOpen();
							setSelectedErrorLog();
						},
					}}
					title={
						selectedErrorLog?.paraticaErrorCode
							? t(`tradingServicesErrorLog.reason.${selectedErrorLog?.paraticaErrorCode}`)
							: t(`tradingServicesErrorLog.reason.500`)
					}
					content={
						<Typography>
							{t(`tradingServicesErrorLog.comment.${selectedErrorLog?.paraticaErrorCode}`)}
						</Typography>
					}
					action={
						<Button variant="contained" fullWidth onClick={() => setOpen()}>
							Ok
						</Button>
					}
				/>
			)}
			{filter && count ? (
				<TablePagination
					rowsPerPageOptions={onRowsPerPageChange ? [10, 25, 50, 100] : []}
					component="div"
					count={count}
					rowsPerPage={filter?.where?.pageSize}
					page={filter?.where?.pageNumber}
					onPageChange={onPageChange}
					onRowsPerPageChange={onRowsPerPageChange}
				/>
			) : (
				<> </>
			)}
		</>
	);
}
