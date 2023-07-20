import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { omit } from "lodash";
import { useSnackbar } from "notistack";

import { Accordion, AccordionDetails, AccordionSummary, Box, Grid, Paper, Typography } from "@mui/material";

import { setFollower } from "actions/StrategyBuilderActions";
import { CoinIcon, Slider, TextField } from "components";
import { Scroll } from "images";
import { Config, useFetchAuthorized } from "services";

import { getAvailableBudget } from "../../../utils/budgetSettings";
import { StrategyBuilderContext } from "../StrategyBuilder";
import { QUOTE_MAP } from "./Constants";

const Result = ({ budget }) => {
	const { t } = useTranslation("workshop");

	return (
		<Grid container sx={{ mt: "30px" }}>
			<Grid
				container
				sx={{
					background: "#FFF",
					borderRadius: "8px",
					p: 2,
					gap: 1,
				}}
			>
				<Grid container xs={12} direction="row" justifyContent="space-between">
					<Box component="span" sx={{ textOverflow: "clip", color: "#3A3A3A" }}>
						{t("workshop_budget_settings_division_summary_amount_title")}
					</Box>
					<Box component="span" sx={{ textOverflow: "ellipsis" }}>
						<span style={{ color: "#0F20E8" }}>{budget?.amount}</span>{" "}
						<span style={{ fontSize: "12px" }}>{budget?.quote}</span>
					</Box>
				</Grid>

				<Grid container xs={12} direction="row" justifyContent="space-between">
					<Box component="span" sx={{ textOverflow: "clip", color: "#3A3A3A" }}>
						{t("workshop_budget_settings_division_summary_count_title")}
					</Box>
					<Box component="span" sx={{ textOverflow: "ellipsis", color: "#0F20E8" }}>
						<span>{budget?.maximumPositionCount}</span>
					</Box>
				</Grid>

				{budget?.leverage ? (
					<Grid container xs={12} direction="row" justifyContent="space-between">
						<Box component="span" sx={{ textOverflow: "clip", color: "#3A3A3A" }}>
							{t("workshop_budget_settings_division_summary_leverage_title")}
						</Box>
						<Box component="span" sx={{ textOverflow: "ellipsis" }}>
							<span style={{ color: "#0F20E8" }}>{budget?.leverage}x</span>
						</Box>
					</Grid>
				) : (
					<></>
				)}

				<Grid container xs={12} direction="row" justifyContent="space-between">
					<Box component="span" sx={{ textOverflow: "clip", color: "##36B37E" }}>
						{t("workshop_budget_settings_division_summary_position_amount_title")}
					</Box>
					<Box component="span" sx={{ textOverflow: "ellipsis" }}>
						<span style={{ color: "#36B37E" }}>{budget?.positionBudget}</span>{" "}
						<span style={{ fontSize: "12px" }}>{budget?.quote}</span>
					</Box>
				</Grid>
			</Grid>
		</Grid>
	);
};

const Header = ({ quote }) => {
	const { t } = useTranslation("workshop");

	return (
		<Grid container spacing={1} sx={{ ml: 2 }}>
			<Grid item>
				<CoinIcon style={{ marginTop: "4px" }} width="32px" height="32px" quote={quote} />
			</Grid>
			<Grid item>
				<Typography sx={{ fontSize: "16px", color: (theme) => theme.palette.primary.main, mt: 1 }}>
					{t("workshop_budget_settings_division_main_title", { quote: QUOTE_MAP[quote] })}
				</Typography>
			</Grid>
		</Grid>
	);
};

const Budget = () => {
	const { strategy, follower } = useSelector((state) => state.strategyBuilder);
	const { platforms } = useSelector((state) => state.platform);

	const { portfolio, statusMap, status, setStatus } = useContext(StrategyBuilderContext);

	const [expanded, setExpanded] = useState(strategy?.parities?.quotes?.map((_, ix) => ix === 0));
	const [budgets, setBudgets] = useState(
		strategy?.parities?.quotes?.map((item) => ({
			quote: item,
			maximumPositionCount: 1,
			...(follower?.budgetSettings?.find((x) => x.quote === item) ?? {}),
		}))
	);

	const dispatch = useDispatch();
	const { enqueueSnackbar } = useSnackbar();
	const fetchAuthorized = useFetchAuthorized();
	const { t } = useTranslation("workshop");

	const calculatePositionBudget = ({ amount, leverage = 1, maximumPositionCount }) =>
		maximumPositionCount === 0 ? 0 : ((amount * leverage) / maximumPositionCount).toFixed(4);

	const handleChange = (ix) => (_, newExpanded) => {
		setExpanded([...expanded.slice(0, ix), newExpanded ? true : false, ...expanded.slice(ix + 1)]);
	};

	const platform = platforms.find((x) => x.id === strategy?.platformId);

	const isBudgetValid = (budget) => {};

	// at least one of the budgets must be valid
	const validate = () => {
		let err = [];

		let invalidAmount = 0;

		let validBudgetCount = 0;

		budgets.forEach((budget) => {
			if (budget?.amount > 0) {
				validBudgetCount++;
			}

			if (budget?.amount == 0 || budget?.amount < 0) {
				invalidAmount++;
			}
		});

		if (!validBudgetCount) {
			return t("error.Please fill budget settings for at least one base parity or make the strategy virtual");
		}

		if (invalidAmount) {
			return t("error.Please enter a positive value for the amount field");
		}

		return;
	};

	useEffect(() => {
		if (["continue", "save"].some((x) => x === status)) {
			const err = validate();

			if (err) {
				enqueueSnackbar(err, { variant: "error" });
				setStatus();
				return;
			}

			fetchAuthorized(`${Config.apiRoot()}/strategy/strategy-followers/${strategy?.id}`, {
				headers: {
					"Content-type": "application/json",
				},
				method: "PUT",
				body: JSON.stringify({
					budgetSettings: budgets
						.filter((x) => x.amount && x.maximumPositionCount)
						.map((item) => ({ leverage: 1, ...item })),
				}),
			})
				.then((data) => data.json())
				.then((data) => {
					dispatch(setFollower({ ...follower, budgetSettings: budgets }));

					enqueueSnackbar(t("All information saved successfully"), { variant: "success" });

					setStatus(statusMap[status]);
				});
		}
	}, [status]);

	return (
		<Paper sx={{ padding: "24px", marginBottom: "16px" }}>
			<Typography sx={{ fontSize: "24px", fontWeight: 700, marginBottom: "8px" }}>
				{t("workshop_budget_settings_main_title")}
			</Typography>
			<Typography variant="p" sx={{ color: "#3A3A3A", fontSize: "14px" }}>
				{t("workshop_budget_settings_main_text")}
			</Typography>

			{budgets &&
				budgets.map((item, ix) => (
					<Grid key={ix} spacing={2} style={{ marginTop: "10px" }}>
						<Accordion
							expanded={expanded[ix]}
							onChange={handleChange(ix)}
							sx={{ backgroundColor: expanded[ix] ? "#F0F0F5" : "inherit" }}
						>
							<AccordionSummary
								aria-controls="panel1a-content"
								id="panel1a-header"
								expandIcon={<Scroll />}
								sx={{
									flexDirection: "row-reverse",
								}}
							>
								<Header quote={item.quote} />
							</AccordionSummary>

							<AccordionDetails>
								<Grid container spacing={5}>
									<Grid item xs={12}>
										<TextField
											margin="normal"
											fullWidth
											label={t("workshop_budget_settings_division_budget_title")}
											helperText={getAvailableBudget({
												portfolio,
												platform: strategy.platform,
												quote: item.quote,
											})}
											labelProps={{ sx: { color: (theme) => theme.palette.primary.main } }}
											inputProps={{
												min: 0,
											}}
											containerProps={{ sx: { mt: 2 } }}
											type="number"
											value={item.amount}
											onChange={(e) => {
												const { value: amount } = e.target;

												setBudgets([
													...budgets.slice(0, ix),
													...(amount
														? [
																{
																	...item,
																	amount,
																	positionBudget: calculatePositionBudget({
																		...item,
																		amount,
																	}),
																},
														  ]
														: [omit(item, ["amount", "positionBudget"])]),
													...budgets.slice(ix + 1),
												]);
											}}
										/>
									</Grid>
									<Grid item xs={12}>
										<Grid container>
											<Grid item xs={12}>
												<Slider
													label={t("workshop_budget_settings_division_con_pos_title")}
													step={1}
													min={1}
													max={50}
													valueLabelDisplay="auto"
													value={item.maximumPositionCount}
													onChange={(_, value) => {
														const maximumPositionCount = value;

														setBudgets([
															...budgets.slice(0, ix),
															...(maximumPositionCount
																? [
																		{
																			...item,
																			maximumPositionCount,
																			positionBudget: calculatePositionBudget({
																				...item,
																				maximumPositionCount,
																			}),
																		},
																  ]
																: [
																		omit(item, [
																			"maximumPositionCount",
																			"positionBudget",
																		]),
																  ]),
															...budgets.slice(ix + 1),
														]);
													}}
												/>
											</Grid>
											<Grid item xs={12}>
												<Grid container xs={12} direction="row" justifyContent="space-between">
													<Box component="span" sx={{ textOverflow: "clip" }}>
														1
													</Box>
													<Box component="span" sx={{ textOverflow: "ellipsis" }}>
														50
													</Box>
												</Grid>
											</Grid>
										</Grid>
									</Grid>
									{platform?.info?.marketTypes.includes("FUTURES") && (
										<Grid item xs={12}>
											<Grid container>
												<Grid item xs={12}>
													<Slider
														label={t("workshop_budget_settings_division_leverage_title")}
														step={1}
														min={1}
														max={5}
														valueLabelDisplay="auto"
														value={item.leverage ?? 1}
														onChange={(e, value) => {
															const leverage = value;

															setBudgets([
																...budgets.slice(0, ix),
																{
																	...item,
																	leverage,
																	positionBudget: calculatePositionBudget({
																		...item,
																		leverage,
																	}),
																},
																...budgets.slice(ix + 1),
															]);
														}}
													/>
												</Grid>
												<Grid item xs={12}>
													<Grid
														container
														xs={12}
														direction="row"
														justifyContent="space-between"
													>
														<Box component="span" sx={{ textOverflow: "clip" }}>
															1X
														</Box>
														<Box component="span" sx={{ textOverflow: "ellipsis" }}>
															5X
														</Box>
													</Grid>
												</Grid>
											</Grid>
										</Grid>
									)}
								</Grid>
								<Result budget={item} />
							</AccordionDetails>
						</Accordion>
					</Grid>
				))}
		</Paper>
	);
};

export default Budget;
