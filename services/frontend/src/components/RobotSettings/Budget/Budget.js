import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import AddIcon from "@mui/icons-material/Add";
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Box,
	Button,
	DialogContent,
	Grid,
	Typography,
} from "@mui/material";

import { useSnackbar } from "notistack";

import { CoinIcon, Slider, TextField } from "components";

import { setStrategies } from "actions/StrategyActions";

import { useFetchAuthorized } from "services";
import Config from "services/config";

import { getAvailableBudget } from "utils/budgetSettings";

import { RobotContext } from "../RobotDialog";
import { QuoteMap } from "../utils";
import { BUDGET, SELECTION, SUCCESS } from "../utils/constant";
import SelectQuote from "./SelectQuote";

const Result = ({ executionType, budget }) => {
	const { t } = useTranslation("common");

	return (
		<Grid container style={{ marginTop: "30px" }}>
			<Typography sx={{ color: (theme) => theme.palette.primary.main, mb: 2 }}>Result</Typography>
			<Grid
				container
				style={{
					background: "#F4F5FC",
					borderRadius: "8px",
					padding: "10px",
					gap: "16px",
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
						{t("workshop_budget_settings_division_con_pos_title")}
					</Box>
					<Box component="span" sx={{ textOverflow: "ellipsis", color: "#0F20E8" }}>
						<span>{budget?.maximumPositionCount}</span>
					</Box>
				</Grid>

				{executionType !== "SPOT" && budget?.leverage ? (
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

const Budget = ({ contentProps, strategyName }) => {
	const {
		backButton,
		setBackButton,
		setSuccessMessage,
		setSelection,
		portfolio,
		selectedStrategyFollower,
		setSelectedStrategyFollower,
	} = useContext(RobotContext);
	const { strategies } = useSelector((state) => state.strategy);

	const { strategy, budgetSettings } = selectedStrategyFollower ?? {};

	const [budgets, setBudgets] = useState(budgetSettings ?? []);
	const [quoteInfos, setQuoteInfos] = useState(
		strategy?.parities?.quotes.filter((x) => !budgetSettings?.length || budgetSettings?.some((z) => z.quote !== x))
	);

	const dispatch = useDispatch();
	const { enqueueSnackbar } = useSnackbar();
	const fetchAuthorized = useFetchAuthorized();
	const { t } = useTranslation("common");

	const PAGE_SETTINGS = [
		{
			title: t("control_panel_robot_settings_budget_title"),
			subtitle: t("control_panel_robot_settings_budget_text", {
				name: strategy?.marketStrategy?.name ?? strategy?.name,
			}),
		},
		{
			title: t("control_panel_robot_settings_budget_page_select_base_pair_title"),
			subtitle: t("control_panel_robot_settings_budget_page_select_base_pair_text"),
		},
	];

	const calculatePositionBudget = ({ amount, leverage = 1, maximumPositionCount }) =>
		maximumPositionCount === 0 ? 0 : ((amount * leverage) / maximumPositionCount).toFixed(4);

	const addQuoteInfos = (quote = null) => {
		quote
			? setQuoteInfos(
					strategy?.parities?.quotes?.filter((x) => strategy?.budgetSettings?.some((z) => z.quote !== x))
			  )
			: setQuoteInfos(quoteInfos.filter((x) => x !== quote));
	};

	const addDifferentParity = (quote) => {
		if ((budgets ?? []).find((x) => x.quote === quote)) {
			enqueueSnackbar(t("Quote Already Exists"), { variant: "error" });
			return;
		}

		setBackButton({
			to: SELECTION,
			label: "Robot Settings",
		});

		setBudgets([
			...budgets,
			{
				amount: 0,
				leverage: 1,
				maximumPositionCount: 1,
				positionBudget: 0,
				quote,
			},
		]);
		addQuoteInfos(quote);
	};

	const updateBudgets = () => {
		if (budgets.length > 0) {
			fetchAuthorized(`${Config.apiRoot()}/strategy/strategy/${strategy.id}/followed/budget`, {
				headers: {
					"Content-type": "application/json",
				},
				method: "POST",
				body: JSON.stringify({
					budget: budgets.map((item) => ({ leverage: 1, ...item })),
				}),
			})
				.then((data) => data.json())
				.then((data) => {
					dispatch(
						setStrategies(
							strategies?.map((item) =>
								item.strategy.id === strategy.id ? { ...item, budgetSettings: budgets } : item
							)
						)
					);

					setSelectedStrategyFollower({ ...selectedStrategyFollower, budgetSettings: budgets });

					setSuccessMessage({
						title: t("control_panel_robot_settings_budget_success_title"),
						subtitle: t("control_panel_robot_settings_budget_success_text"),
					});

					setSelection(SUCCESS);
				})
				.catch((err) => {
					enqueueSnackbar(t("Bir hata ile karşılaşıldı"), { variant: "error" });
				});
		}
	};

	// const getAvailableBudget = (portfolio, quote) => {
	// 	const platformPortfolio = portfolio?.find((x) => x.platformId === strategy?.platform?.id);

	// 	const availableBudget = platformPortfolio?.portfolio?.assets?.find((x) => x.coinName === quote)?.coinAmount;

	// 	return availableBudget ? (
	// 		<Typography fontSize={12}>
	// 			{`${EXCHANGE_TEXT_MAP[selectedStrategyFollower?.strategy?.platform.exchange]} Budget`}
	// 			&nbsp;
	// 			<Typography component="span" color="primary" fontSize={12}>
	// 				{availableBudget}
	// 			</Typography>
	// 			&nbsp;
	// 			{quote}
	// 		</Typography>
	// 	) : (
	// 		<></>
	// 	);
	// };

	useEffect(() => {
		if (selectedStrategyFollower) {
			setBudgets(selectedStrategyFollower?.budgetSettings ?? []);
			addQuoteInfos();
		}
	}, [selectedStrategyFollower]);

	return (
		<DialogContent sx={{ paddingTop: "10vh !important" }} {...contentProps}>
			<Grid container spacing={2} direction="column" alignItems="center" justifyContent="center">
				<Grid item xs={12}>
					<Typography variant="h5">
						{backButton.to === BUDGET ? PAGE_SETTINGS[1].title : PAGE_SETTINGS[0].title}
					</Typography>
				</Grid>
				<Grid item xs={12}>
					{strategyName}
				</Grid>
				<Grid item xs={12}>
					<Typography variant="p">
						{backButton.to === BUDGET ? PAGE_SETTINGS[1].subtitle : PAGE_SETTINGS[0].subtitle}
					</Typography>
				</Grid>
			</Grid>

			{backButton.to === BUDGET ? (
				<SelectQuote
					portfolio={portfolio?.find((x) => x.platformId === strategy?.platform?.id)}
					quotes={quoteInfos}
					addParity={addDifferentParity}
				/>
			) : (
				budgets &&
				budgets.map((item, ix) => (
					<Grid key={ix} spacing={2} style={{ marginTop: "10px" }}>
						<Accordion defaultExpanded={ix === 0}>
							<AccordionSummary aria-controls="panel1a-content" id="panel1a-header">
								<Grid
									spacing={2}
									style={{
										marginTop: 8,
										marginLeft: "auto",
										marginRight: "auto",
										display: "flex",
										flexDirection: "column",
										alignItems: "center",
									}}
								>
									<CoinIcon quote={item.quote} />
									<Typography variant="h5">{QuoteMap[item.quote]}</Typography>
								</Grid>
							</AccordionSummary>

							<AccordionDetails>
								<Grid columns={12}>
									<Grid item spacing={2} xs={12}>
										<TextField
											margin="normal"
											fullWidth
											label={t("workshop_budget_settings_division_budget_title")}
											labelProps={{ sx: { color: (theme) => theme.palette.primary.main } }}
											containerProps={{ sx: { mt: 2 } }}
											type="number"
											value={item.amount}
											helperText={getAvailableBudget({
												portfolio,
												quote: item.quote,
												platform: strategy?.platform,
											})}
											InputProps={{
												inputProps: {
													min: 0,
												},
											}}
											onChange={(e) => {
												const { value: amount } = e.target;

												if (amount < 0) {
													return;
												}

												setBudgets([
													...budgets.slice(0, ix),
													{
														...item,
														amount,
														positionBudget: calculatePositionBudget({ ...item, amount }),
													},
													...budgets.slice(ix + 1),
												]);
											}}
										/>
									</Grid>
								</Grid>

								<Grid container style={{ marginTop: "30px" }}>
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
													{
														...item,
														maximumPositionCount,
														positionBudget: calculatePositionBudget({
															...item,
															maximumPositionCount,
														}),
													},
													...budgets.slice(ix + 1),
												]);
											}}
										></Slider>
									</Grid>
									<Grid container xs={12} direction="row" justifyContent="space-between">
										<Box component="span" sx={{ textOverflow: "clip" }}>
											1
										</Box>
										<Box component="span" sx={{ textOverflow: "ellipsis" }}>
											50
										</Box>
									</Grid>
								</Grid>

								{strategy?.platform?.info?.marketTypes.includes("FUTURES") ? (
									<Grid container style={{ marginTop: "30px" }}>
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
											></Slider>
										</Grid>
										<Grid container xs={12} direction="row" justifyContent="space-between">
											<Box component="span" sx={{ textOverflow: "clip" }}>
												1X
											</Box>
											<Box component="span" sx={{ textOverflow: "ellipsis" }}>
												5X
											</Box>
										</Grid>
									</Grid>
								) : (
									<></>
								)}
								<Result executionType={strategy?.executionType} budget={item} />
							</AccordionDetails>
						</Accordion>
					</Grid>
				))
			)}

			{backButton.to !== BUDGET && (
				<Grid container spacing={2} sx={{ paddingTop: "3vh" }}>
					{quoteInfos?.length > 0 && (
						<Grid item xs={12}>
							<Button
								fullWidth
								variant="outlined"
								startIcon={<AddIcon />}
								onClick={() => {
									setBackButton({
										to: BUDGET,
										label: "Budget Settings",
									});
								}}
							>
								{t("workshop_budget_settings_division_summary_add_another_parity")}
							</Button>
						</Grid>
					)}
					<Grid item xs={12}>
						<Button
							fullWidth
							variant="contained"
							onClick={() => {
								updateBudgets();
							}}
						>
							{t("workshop_budget_settings_division_summary_save_button_title")}
						</Button>
					</Grid>
				</Grid>
			)}
		</DialogContent>
	);
};

export default Budget;
