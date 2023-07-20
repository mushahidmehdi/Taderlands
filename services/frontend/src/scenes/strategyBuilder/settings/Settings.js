import { createContext, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { Button, Chip, Grid, IconButton, Paper, Tooltip, Typography } from "@mui/material";

import { useSnackbar } from "notistack";

import { useStrategyApi } from "api/strategy";
import useCatchError from "api/useCatchError";

import { setRuleDesign, setStrategy } from "actions/StrategyBuilderActions";

import { Config, useFetchAuthorized } from "services";

import { Info, SpotDown, SpotUp } from "images";

import { StrategyBuilderContext } from "../StrategyBuilder";
import { KEYS, OPERATION_MAP, VALUES } from "./constants";
import { RuleDesign } from "./design";
import { TradeSettings } from "./tradeSettings";

const GroupHeader = ({ type, label, clauses, disabled, onClick, selected, tooltipType }) => {
	const { ruleDesign } = useSelector((state) => state.strategyBuilder);

	const { t } = useTranslation("workshop");

	return (
		<Grid container sx={{ mt: 2 }} justifyContent="space-between">
			<Grid item>
				<Grid container spacing={1}>
					{type === "exit" && (
						<Grid item>
							<div style={{ paddingTop: "2px" }}>
								<SpotDown width={13.47} height={12.7} color="#0F20E8" />
							</div>
						</Grid>
					)}
					<Grid item>
						<Typography
							sx={{
								color: (theme) => theme.palette.primary.main,
								fontSize: "16px",
								fontWeight: 700,
								pt: 0.5,
							}}
						>
							{label}
						</Typography>
					</Grid>
					{type === "enter" && (
						<Grid item>
							<div style={{ paddingTop: "2px" }}>
								<SpotUp width={13.47} height={12.7} color="#0F20E8" />
							</div>
						</Grid>
					)}
					<Grid item>
						<div style={{ paddingTop: "2px" }}>
							{clauses.map((clause, ix) => (
								<Chip
									key={ix}
									label={t(`workshop_tl_strategy_page_${clause}_chip`)}
									onClick={() => onClick(clause)}
									sx={{
										backgroundColor: (theme) => theme.palette.primary.main,
										p: 0,
										mr: 1,
										color: "white",
										fontSize: "12px",
										fontWeight: 700,
										width: "40px",
										height: "17px",
										borderRadius: "4px",
										"& .MuiChip-label": {
											p: 0,
										},
										...(!disabled && { cursor: "pointer" }),
										...(onClick
											? selected === clause
												? {
														color: "white",
														backgroundColor: (theme) => theme.palette.primary.main,
												  }
												: {
														backgroundColor: "#AEAEAE",
														color: "#3A3A3A",
												  }
											: {}),
									}}
								/>
							))}

							<Tooltip
								size="lg"
								title={tooltipType}
								componentsProps={{
									tooltip: {
										sx: {
											backgroundColor: "#fff",
											color: "#000",
											display: "flex",
											justifyContent: "space-evenly",
											textAlign: "justify",
											padding: "1rem",
											boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
										},
									},
								}}
							>
								<IconButton>
									<Info style={{ width: "16px", height: "16px" }} />
								</IconButton>
							</Tooltip>
						</div>
					</Grid>
				</Grid>
			</Grid>
			{type === "enter" && (
				<Grid item>
					<Grid container spacing={1}>
						<Grid item>
							<Button
								variant="contained"
								sx={{
									background: (theme) => theme.palette.primary.main,
									color: "white",
									"&:hover": {
										background: (theme) => theme.palette.primary.main,
										color: "white",
									},
									cursor: "auto",
								}}
							>
								{`${ruleDesign[type]?.[KEYS.GROUP]?.length ?? 0} ${t(
									"workshop_tl_strategy_page_rule_groups_summary_text"
								)}`}
							</Button>
						</Grid>
					</Grid>
				</Grid>
			)}
		</Grid>
	);
};

export const SettingsContext = createContext();

export default function Settings() {
	const { strategy, ruleDesign } = useSelector((state) => state.strategyBuilder);

	const { statusMap, status, setStatus } = useContext(StrategyBuilderContext);

	const [exitClause, setExitClause] = useState("and");
	const [error, setError] = useState();

	const { t } = useTranslation("workshop");
	const { enqueueSnackbar } = useSnackbar();
	const fetchAuthorized = useFetchAuthorized();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { createRuleDesign } = useStrategyApi();
	const catchError = useCatchError();

	const enterGroups = ruleDesign?.enter?.[KEYS.GROUP];
	const exitGroups = ruleDesign?.exit?.[KEYS.GROUP];

	const enterRuleExist = enterGroups?.length && enterGroups?.[0]?.[KEYS.RULES]?.length;
	const exitRuleExist = exitGroups?.length && exitGroups?.[0]?.[KEYS.RULES]?.length;
	const tradeSettingsExist = [
		"stopLoss",
		"leverage",
		"takeProfit",
		"trailingStop",
		"minTradeDuration",
		"maxTradeDuration",
	].some((x) => strategy?.tradeSettings?.[x]);
	const tradingViewSignalExist = strategy?.strategyTypeId === 2;

	const createEnterRule = () =>
		fetchAuthorized(`${Config.apiRoot()}/strategy/rule-design`, {
			headers: {
				"Content-type": "application/json",
			},
			method: "POST",
			body: JSON.stringify({
				strategyId: strategy?.id,
				type: "ENTER",
				name: ruleDesign.enter[KEYS.GROUP][0][KEYS.NAME],
				rules: ruleDesign.enter,
			}),
		})
			.then((data) => data.json())
			.then((data) => {
				dispatch(
					setStrategy({
						...strategy,
						ruleDesignEnterId: data?.data?.ruleDesign?.id,
					})
				);
			});

	const createExitRule = () =>
		fetchAuthorized(`${Config.apiRoot()}/strategy/rule-design`, {
			headers: {
				"Content-type": "application/json",
			},
			method: "POST",
			body: JSON.stringify({
				strategyId: strategy?.id,
				type: "EXIT",
				name: ruleDesign.exit[KEYS.GROUP][0][KEYS.NAME],
				rules: ruleDesign.exit,
			}),
		})
			.then((data) => data.json())
			.then((data) => {
				dispatch(
					setStrategy({
						...strategy,
						ruleDesignExitId: data?.data?.ruleDesign?.id,
					})
				);
			});

	// transform trade settings before sending to backend
	const createTradeSettings = () =>
		fetchAuthorized(`${Config.apiRoot()}/strategy/strategy/${strategy.id}`, {
			headers: {
				"Content-type": "application/json",
			},
			method: "PUT",
			body: JSON.stringify({
				tradeSettings: {
					leverage: 1,
					...strategy?.tradeSettings,
				},
			}),
		}).then((data) => data.json());

	const clearExitRule = () =>
		fetchAuthorized(`${Config.apiRoot()}/strategy/strategy/${strategy.id}`, {
			headers: {
				"Content-type": "application/json",
			},
			method: "PUT",
			body: JSON.stringify({
				ruleDesignExitId: 2, // predefined empty exit rule
			}),
		}).then((data) => data.json());

	const validate = () => {
		// for every group, if there is a rule, it should have valid left and right
		if (tradingViewSignalExist) return;
		let err = {};

		let errCount = 0;

		if (tradeSettingsExist) {
			if (
				!["minTradeDuration", "maxTradeDuration", "newPositionDuration"].every((x) =>
					strategy?.tradeSettings?.[x]?.enabled
						? strategy?.tradeSettings?.[x]?.value > 0 && strategy?.tradeSettings?.[x]?.value < 999999
						: true
				)
			) {
				return t(
					"Minimum Stand Open Time, Maximum Stand Open Time, Minimum Wait Time For New Trade fields should be between 0 and 999999."
				);
			}
		}

		// check enter rule design exists
		if (!enterRuleExist && !tradingViewSignalExist) {
			return t("error.Enter algorithm should not be empty");
		}

		// check exit rule design or trade settings is full
		if (!exitRuleExist && !tradeSettingsExist && !tradingViewSignalExist) {
			return t("error.Exit algorithm or trade settings should not be empty");
		}

		["enter", "exit"].forEach((type) => {
			ruleDesign?.[type]?.[KEYS.GROUP]?.map((group, groupIndex) => {
				group?.[KEYS.RULES]?.map((rule, ruleIndex) => {
					err[`${type}-${groupIndex}-${ruleIndex}`] = {
						...[
							...(rule?.[KEYS.LEFT_PAIR] !== "PARITY" ? [KEYS.LEFT_EXCHANGE] : []),
							...(rule?.[KEYS.LEFT_INDEX] !== 0 ? [KEYS.LEFT_INDEX] : []),
							KEYS.LEFT_INDICATOR,
							KEYS.LEFT_INTERVAL,
							KEYS.LEFT_PAIR,
							KEYS.LEFT_PARAMS,
							KEYS.OPERATOR,
						].reduce((acc, curr) => {
							if (!rule?.[curr]) {
								acc[curr] = true;
								errCount++;
							}

							return acc;
						}, {}),
						...(Object.values(OPERATION_MAP.Indicator).includes(rule[KEYS.OPERATOR]) &&
							[
								...(rule?.[KEYS.RIGHT_PAIR] !== "PARITY" ? [KEYS.RIGHT_EXCHANGE] : []),
								...(rule?.[KEYS.RIGHT_INDEX] !== 0 ? [KEYS.RIGHT_INDEX] : []),
								KEYS.RIGHT_INDICATOR,
								KEYS.RIGHT_INTERVAL,
								KEYS.RIGHT_PAIR,
								KEYS.RIGHT_PARAMS,
							].reduce((acc, curr) => {
								if (!rule?.[curr]) {
									acc[curr] = true;
									errCount++;
								}
								return acc;
							}, {})),
						...(Object.values(OPERATION_MAP.Range).includes(rule[KEYS.OPERATOR]) &&
							[KEYS.RIGHT_RANGE_MIN, KEYS.RIGHT_RANGE_MAX].reduce((acc, curr) => {
								if (rule?.[curr] === null || rule?.[curr] === undefined) {
									acc[curr] = true;
									errCount++;
								}
								return acc;
							}, {})),
						...(Object.values(OPERATION_MAP.Value).includes(rule[KEYS.OPERATOR]) &&
							[KEYS.RIGHT_VALUE].reduce((acc, curr) => {
								if (rule?.[curr] === null || rule?.[curr] === undefined) {
									acc[curr] = true;
									errCount++;
								}
								return acc;
							}, {})),
					};
				});
			});
		});

		setError(err);

		return errCount ? t("common.One or more field is not valid") : null;
	};

	useEffect(() => {
		async function exec() {
			try {
				!tradingViewSignalExist &&
					(await createRuleDesign({
						strategyId: strategy?.id,
						type: "ENTER",
						name: ruleDesign.enter[KEYS.GROUP][0][KEYS.NAME],
						rules: ruleDesign.enter,
					}));
				!tradingViewSignalExist &&
					exitRuleExist &&
					(await createRuleDesign({
						strategyId: strategy?.id,
						type: "EXIT",
						name: ruleDesign.exit[KEYS.GROUP][0][KEYS.NAME],
						rules: ruleDesign.exit,
					}));
				await createTradeSettings();
				!exitRuleExist && (await clearExitRule());

				enqueueSnackbar("All information saved successfully.", { variant: "success" });
				setStatus(statusMap[status]);
			} catch (e) {
				catchError(e);
				setStatus();
			}
		}

		if (["continue", "save"].some((x) => x === status)) {
			const validationResult = validate();
			if (validationResult) {
				setStatus();
				enqueueSnackbar(validationResult ?? t("common:Bir hata ile karşılaşıldı"), { variant: "error" });
				return;
			}

			exec();
		}
	}, [status]);

	useEffect(() => {
		if (!strategy?.id) {
			navigate("/strategy-builder#presets");
		}
	}, []);

	useEffect(() => {
		if (
			!ruleDesign?.enter?.[KEYS.GROUP]?.[0]?.[KEYS.RULES] ||
			ruleDesign?.enter?.[KEYS.GROUP]?.[0]?.[KEYS.RULES]?.length === 0
		) {
			dispatch(
				setRuleDesign({
					...ruleDesign,
					enter: {
						[KEYS.CLAUSE]: VALUES.AND,
						[KEYS.GROUP]: [
							{
								[KEYS.CLAUSE]: VALUES.AND,
								[KEYS.NAME]: "Rule Group",
								[KEYS.RULES]: [
									{
										[KEYS.LEFT_PAIR]: "PARITY",
									},
								],
							},
						],
					},
				})
			);
		}
	}, [ruleDesign]);

	return (
		<>
			<Paper
				sx={{ padding: "24px", mb: "16px", mt: "16px", backgroundColor: (theme) => theme.palette.info.light }}
			>
				<Typography sx={{ fontSize: "24px", fontWeight: 700, marginBottom: "8px" }}>
					{t("workshop_tl_strategy_page_main_title")}
				</Typography>
				<Typography variant="p" sx={{ color: "#3A3A3A", fontSize: "14px" }}>
					{t("workshop_tl_strategy_page_main_text")}
				</Typography>

				{strategy?.strategyTypeId !== 2 && (
					<SettingsContext.Provider value={{ error, setError }}>
						<GroupHeader
							type="enter"
							tooltipType={t("tooltip.Enter Algorithm info")}
							label={t("workshop_tl_strategy_page_enter_algo_text")}
							clauses={["and"]}
							disabled
						/>

						<RuleDesign type="enter" />

						<GroupHeader
							type="exit"
							label={t("workshop_tl_strategy_page_exit_algo_text")}
							clauses={["and", "or"]}
							onClick={(clause) =>
								dispatch(
									setRuleDesign({
										...ruleDesign,
										exit: {
											...ruleDesign?.exit,
											[KEYS.CLAUSE]: VALUES?.[clause.toUpperCase()],
										},
									})
								)
							}
							selected={ruleDesign?.exit?.[KEYS.CLAUSE] === VALUES.AND ? "and" : "or"}
							tooltipType={t("tooltip.Exit Algorithm info")}
						/>

						<RuleDesign type="exit" clause={exitClause} />
					</SettingsContext.Provider>
				)}

				<TradeSettings />
			</Paper>
		</>
	);
}
