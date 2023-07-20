import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { Close as CloseIcon } from "@mui/icons-material";
import {
	Autocomplete,
	Button,
	Checkbox,
	Chip,
	FormControl,
	FormControlLabel,
	FormGroup,
	FormLabel,
	Grid,
	Radio,
	RadioGroup,
	Tab,
	Tabs,
	TextField,
	Typography,
} from "@mui/material";

import { uniqBy } from "lodash";
import { useSnackbar } from "notistack";

import { PageCenteredProgress } from "components";

import { setBacktests, setPositions } from "actions/BacktestActions";

import { Config, useFetchAuthorized } from "services";

import queryBuilder from "utils/queryBuilder";

import { ArrowDown, Sync } from "images";

import { BacktestContext } from "./Dialog";
import Info from "./Info";

function a11yProps(index) {
	return {
		id: `simple-tab-${index}`,
		"aria-controls": `simple-tabpanel-${index}`,
	};
}

const NewBacktest = ({ onCreate }) => {
	const { parities } = useSelector((state) => state.parity);
	const { strategy, ruleDesign } = useSelector((state) => state.strategyBuilder);
	const { backtests } = useSelector((state) => state.backtest);

	const [pairs, setPairs] = useState();
	const [interval, setInterval] = useState();
	const [error, setError] = useState(false);

	const fetchAuthorized = useFetchAuthorized();
	const dispatch = useDispatch();
	const { t } = useTranslation("workshop");

	const createBacktest = (parityId) => {
		return fetchAuthorized(`${Config.apiRoot()}/backtest/backtest`, {
			headers: {
				"Content-type": "application/json",
			},
			method: "POST",
			body: JSON.stringify({
				strategyId: strategy?.id,
				parityId,
				enterRuleDesign: ruleDesign?.enter,
				exitRuleDesign: ruleDesign?.exit,
				tradeSettings: strategy?.tradeSettings,
				executionType: strategy?.executionType,
				interval,
				reason: "StrategyBuilder",
			}),
		}).then((data) => data.json());
	};

	const handleCreateBacktest = () => {
		if (!pairs || !interval) {
			setError(true);
			return;
		}
		let promiseList = [];

		pairs.forEach((pair) => {
			promiseList.push(createBacktest(pair?.id));
		});

		Promise.all(promiseList).then((data) => {
			dispatch(setBacktests([...(backtests ?? []), ...data.map((x) => x?.data?.backtest)]));

			onCreate();
		});
	};

	return (
		<Grid container sx={{ width: "70%" }}>
			<Grid item xs={12} sx={{ mt: 2 }}>
				<Typography color={(theme) => theme.palette.primary.main}>
					{t("workshop_backtest_choose_pair_title")}
				</Typography>
				<Autocomplete
					multiple
					id="combo-box-demo"
					options={parities.filter((x) => strategy?.parities?.symbols.some((y) => y === x.id))}
					value={pairs ?? []}
					onChange={(_, newValue) => {
						setPairs(newValue?.length === 0 ? [] : uniqBy([...(pairs ?? []), ...newValue], "id"));
					}}
					renderTags={(values, getTagProps) => {
						return values.map((option, index) => (
							<Chip
								sx={{ borderRadius: 1, backgroundColor: "#6A1FC2", color: "white" }}
								{...getTagProps({ index })}
								deleteIcon={
									<CloseIcon
										sx={{
											color: "white !important",
											fontSize: "16px !important",
											border: "none",
											marginLeft: "-8px !important",
										}}
									/>
								}
								onDelete={() => {
									setPairs(pairs.filter((x) => x.id !== option.id));
								}}
								label={option.symbol}
							/>
						));
					}}
					popupIcon={<ArrowDown />}
					getOptionLabel={(option) => option.symbol}
					renderInput={(params) => (
						<TextField
							sx={{
								"& fieldset": {
									borderRadius: "8px",
									borderColor: (theme) => theme.palette.primary.main,
								},
								"& .MuiOutlinedInput-root": {},
							}}
							{...params}
							margin="normal"
							fullWidth
						/>
					)}
				/>
			</Grid>
			<Grid item xs={12} sx={{ mt: 2 }}>
				<Typography color={(theme) => theme.palette.primary.main}>
					{t("workshop_backtest_choose_date_title")}
				</Typography>
				<RadioGroup
					row
					aria-labelledby="demo-row-radio-buttons-group-label"
					name="row-radio-buttons-group"
					value={interval ?? ""}
					onChange={(_, value) => {
						setInterval(value);
					}}
				>
					{["1 Week", "1 Month", "3 Months", "6 Months", "12 Months"].map((interval, ix) => (
						<FormControlLabel
							key={ix}
							value={interval}
							control={<Radio sx={{ color: (theme) => theme.palette.primary.main }} />}
							label={t(`workshop_backtest_choose_date_option_${ix + 1}`)}
						/>
					))}
				</RadioGroup>
			</Grid>
			<Grid item xs={12} sx={{ mt: 3 }}>
				<Button fullWidth variant="contained" color="primary" onClick={() => handleCreateBacktest()}>
					{t("workshop_backtest_test_button")}
				</Button>
			</Grid>
			{error && (
				<Grid item xs={12} sx={{ mt: 1 }}>
					<Typography sx={{ fontSize: "14px", color: (theme) => theme.palette.error.main }}>
						{t("workshop_backtest_empty_error")}
					</Typography>
				</Grid>
			)}
		</Grid>
	);
};

const List = () => {
	const { backtests } = useSelector((state) => state.backtest);
	const { parities } = useSelector((state) => state.parity);
	const { strategy } = useSelector((state) => state.strategyBuilder);

	const { setPage, backtest, setBacktest } = useContext(BacktestContext);

	const [pairs, setPairs] = useState();
	const [statuses, setStatuses] = useState();
	const [filteredBacktests, setFilteredBacktests] = useState(backtests);
	const [processing, setProcessing] = useState();

	const fetchAuthorized = useFetchAuthorized();
	const dispatch = useDispatch();
	const { enqueueSnackbar } = useSnackbar();
	const { t } = useTranslation("workshop");

	useEffect(() => {
		if (pairs?.length || statuses?.length) {
			setFilteredBacktests(
				backtests.filter(
					(x) =>
						(pairs?.length ? pairs.some((y) => y.symbol === x.parity.symbol) : true) &&
						(statuses?.length ? statuses.some((y) => y === x.status) : true)
				)
			);
		} else {
			setFilteredBacktests(backtests);
		}
	}, [pairs, statuses]);

	const handleViewResults = (backtest) => {
		if (!backtest) {
			return;
		}

		setBacktest(backtest);

		setProcessing(true);

		fetchAuthorized(`${Config.apiRoot()}/backtest/backtest/${backtest.id}/positions`, {
			headers: {
				"Content-type": "application/json",
			},
			method: "GET",
		})
			.then((data) => data.json())
			.then((data) => {
				dispatch(setPositions(data?.data?.backtestPositions));

				setPage("Results");
			})
			.catch((e) => console.log(e))
			.finally(() => {
				setProcessing(false);
			});
	};

	const handleRefreshResults = () => {
		setProcessing(true);

		fetchAuthorized(
			`${Config.apiRoot()}/backtest/backtests?${queryBuilder({
				strategyId: strategy?.id,
				reason: "StrategyBuilder",
			})}`,
			{
				headers: {
					"Content-type": "application/json",
				},
				method: "GET",
			}
		)
			.then((data) => data.json())
			.then((data) => {
				dispatch(setBacktests(data?.data?.backtests));
			})
			.catch(() => {
				enqueueSnackbar("Something went wrong.", { variant: "error" });
			})
			.finally(() => {
				setProcessing(false);
			});
	};

	return (
		<>
			<Grid container sx={{ pt: 2, width: "90%" }} spacing={2}>
				<Grid item xs={12} sx={{ mb: 2, mt: 1, pl: "0 !important" }}>
					<Grid container spacing={3}>
						<Grid item xs={4}>
							<Typography color={(theme) => theme.palette.primary.main} sx={{ fontSize: "14px" }}>
								{t("workshop_backtest_previous_results_choose_pair_title")}
							</Typography>
							<Autocomplete
								multiple
								id="combo-box-demo"
								options={parities.filter((x) => strategy?.parities?.symbols.some((y) => y === x.id))}
								value={pairs ?? []}
								onChange={(_, newValue) => {
									setPairs(
										newValue?.length === 0 ? [] : uniqBy([...(pairs ?? []), ...newValue], "id")
									);
								}}
								renderTags={(values, getTagProps) => {
									return values.map((option, index) => (
										<Chip
											sx={{ borderRadius: 1, backgroundColor: "#6A1FC2", color: "white" }}
											{...getTagProps({ index })}
											deleteIcon={
												<CloseIcon
													sx={{
														color: "white !important",
														fontSize: "16px !important",
														border: "none",
														marginLeft: "-8px !important",
													}}
												/>
											}
											onDelete={() => {
												setPairs(pairs.filter((x) => x.id !== option.id));
											}}
											label={option.symbol}
										/>
									));
								}}
								popupIcon={<ArrowDown />}
								getOptionLabel={(option) => option.symbol}
								renderInput={(params) => (
									<TextField
										sx={{
											fontSize: "14px",
											"& fieldset": {
												borderRadius: "8px",
												borderColor: (theme) => theme.palette.primary.main,
											},
											"& .MuiOutlinedInput-root": {},
										}}
										{...params}
										margin="dense"
										fullWidth
									/>
								)}
							/>
						</Grid>
						<Grid item xs={4}>
							<FormControl>
								<FormLabel sx={{ color: (theme) => theme.palette.primary.main, fontSize: "14px" }}>
									{t("workshop_backtest_previous_results_choose_status_title")}
								</FormLabel>
								<FormGroup row sx={{ mt: "12px", color: (theme) => theme.palette.primary.main }}>
									{["INITIAL", "FINISHED"].map((status) => (
										<FormControlLabel
											key={status}
											sx={{
												"&.MuiTypography-root": {
													fontSize: "14px",
												},
											}}
											control={
												<Checkbox
													sx={{ color: (theme) => theme.palette.primary.main }}
													name={status}
													onChange={(e) => {
														setStatuses(
															e.target.checked
																? [...(statuses ?? []), e.target.name]
																: statuses.filter((x) => x !== e.target.name)
														);
													}}
													checked={statuses?.includes(status)}
												/>
											}
											label={t(`workshop_backtest_previous_results_status_${status}`)}
										/>
									))}
								</FormGroup>
							</FormControl>
						</Grid>
						<Grid item xs={4}>
							<Button
								sx={{ float: "right", marginTop: "6vh" }}
								startIcon={<Sync />}
								variant="outlined"
								onClick={() => handleRefreshResults()}
							>
								{t("workshop_backtest_previous_results_refresh_button")}
							</Button>
						</Grid>
					</Grid>
				</Grid>

				{backtests?.length ? (
					backtests
						.filter(
							(x) =>
								(pairs?.length ? pairs.some((y) => y.symbol === x.parity.symbol) : true) &&
								(statuses?.length ? statuses.some((y) => y === x.status) : true)
						)
						.map((item, ix) => (
							<Grid
								key={ix}
								item
								xs={12}
								sx={{
									border: "1px solid #0F20E8",
									borderRadius: "8px",
									padding: "16px",
									mb: 2,
								}}
							>
								<Grid container spacing={1} justifyContent="space-around">
									<Info backtest={item} />
									<Grid item>
										<Button
											disabled={item?.status === "INITIAL" || item?.status === "ERROR"}
											variant="text"
											color="primary"
											onClick={() => {
												handleViewResults(item);
											}}
											sx={{ fontWeight: "bold", textDecoration: "underline" }}
										>
											{t("workshop_backtest_previous_results_view_button")}
										</Button>
									</Grid>
								</Grid>
							</Grid>
						))
				) : (
					<Grid item xs={12}>
						<Typography sx={{ fontSize: "14px", textAlign: "center" }}>
							{t("workshop_backtest_previous_results_no_backtests_text")}
						</Typography>
					</Grid>
				)}
			</Grid>
			{processing && <PageCenteredProgress open={processing} />}
		</>
	);
};

export default function Settings() {
	const { strategy } = useSelector((state) => state.strategyBuilder);

	const [tab, setTab] = useState(0);

	const fetchAuthorized = useFetchAuthorized();
	const dispatch = useDispatch();
	const { t } = useTranslation("workshop");

	useEffect(() => {
		fetchAuthorized(
			`${Config.apiRoot()}/backtest/backtests?${queryBuilder({
				strategyId: strategy?.id,
				reason: "StrategyBuilder",
			})}`,
			{
				headers: {
					"Content-type": "application/json",
				},
				method: "GET",
			}
		)
			.then((data) => data.json())
			.then((data) => {
				dispatch(setBacktests(data?.data?.backtests));
			});
	}, []);

	return (
		<>
			<Typography sx={{ textAlign: "center", fontSize: "32px", fontWeight: 700 }}>
				{t("workshop_backtest_settings_main_title")}
			</Typography>
			<Typography sx={{ textAlign: "center" }}>{t("workshop_backtest_settings_main_text")}</Typography>
			<div>
				<Tabs
					centered
					fullWidth
					value={tab}
					sx={{ justifyContent: "center", alignItems: "center" }}
					onChange={(_, newValue) => {
						setTab(newValue);
					}}
				>
					{[t("workshop_backtest_new_backtest_title"), t("workshop_backtest_previous_results_title")].map(
						(label, ix) => (
							<Tab sx={{ textTransform: "none" }} key={label} label={label} {...a11yProps(ix)} />
						)
					)}
				</Tabs>
			</div>

			{tab === 0 && <NewBacktest onCreate={() => setTab(1)} />}
			{tab === 1 && <List />}
		</>
	);
}
