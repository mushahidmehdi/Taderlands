import { createContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { Backdrop, Button, CircularProgress, Grid, Paper, Step, StepButton, Stepper, Typography } from "@mui/material";

import { omit } from "lodash";

import { RouteLayout } from "components";

import { useDashboardApi } from "api/dashboard";

import { setIndicators } from "actions/IndicatorActions";
import { setParities } from "actions/ParityActions";
import { setPlatforms } from "actions/PlatformActions";
import {
	reset,
	setActiveStep,
	setConfig,
	setFollower,
	setRuleDesign,
	setStrategy,
} from "actions/StrategyBuilderActions";
import { setConnections, setProfile } from "actions/UserActions";

import { Config, useFetchAuthorized } from "services";

import useQuery from "utils/useQuery";

import { BacktestIcon, Continue, Done, Help, Save } from "images";

import { Budget } from "./budgetSettings";
import { Presets } from "./presets";
import WebhookSettings from "./presets/WebhookSettings";
import { RobotStatus } from "./robotStatus";
import { Settings } from "./settings";
import BacktestDialog from "./settings/backtest/Dialog";

export const StrategyBuilderContext = createContext();

export default function StrategyBuilder() {
	const { t } = useTranslation("workshop");

	const { activeStep = 0, follower, strategy } = useSelector((state) => state.strategyBuilder);

	// undefined, continue, save, save-finished, continue-finished
	// this will be used to handle continue and save actions
	const [status, setStatus] = useState();
	const [portfolio, setPortfolio] = useState();
	const [openBacktest, setOpenBacktest] = useState();
	const [openWebhook, setOpenWebhook] = useState();
	const [steps, setSteps] = useState([
		{
			label: t("workshop_menu_item_1"),
			component: Presets,
			hash: "#presets",
		},
		{
			label: t("workshop_menu_item_2"),
			component: Settings,
			hash: "#settings",
		},
		{
			label: t("workshop_menu_item_3"),
			component: RobotStatus,
			hash: "#robot-status",
		},
		{
			label: t("workshop_menu_item_4"),
			component: Budget,
			hash: "#budget",
		},
	]);

	const dispatch = useDispatch();
	const fetchAuthorized = useFetchAuthorized();
	const location = useLocation();
	const navigate = useNavigate();
	const query = useQuery();
	const { id: strategyId } = useParams();

	const { getPortfolio } = useDashboardApi();

	useEffect(() => {
		if (query.get("initial")) {
			dispatch(reset());
			dispatch(setStrategy({ strategyTypeId: 1 }));
		}

		if (query.get("initial-tv")) {
			dispatch(reset());
			dispatch(setStrategy({ strategyTypeId: 2 }));
		}

		fetchAuthorized(`${Config.apiRoot()}/dashboard/config?title=MAX_PARITY_COUNT`, {
			headers: {
				"Content-type": "application/json",
			},
			method: "GET",
		})
			.then((data) => data.json())
			.then((data) => {
				dispatch(setConfig(data?.data?.config));
			});

		fetchAuthorized(`${Config.apiRoot()}/user/profile`, {
			headers: {
				"Content-type": "application/json",
			},
			method: "GET",
		})
			.then((data) => data.json())
			.then((data) => {
				dispatch(setProfile(data?.data?.profile));
			});

		fetchAuthorized(`${Config.apiRoot()}/platform/platforms`, {
			headers: {
				"Content-type": "application/json",
			},
			method: "GET",
		})
			.then((data) => data.json())
			.then((data) => {
				dispatch(setPlatforms(data?.data?.platforms));
			});

		fetchAuthorized(`${Config.apiRoot()}/strategy/indicators`, {
			headers: {
				"Content-type": "application/json",
			},
			method: "GET",
		})
			.then((data) => data.json())
			.then((data) => {
				dispatch(
					setIndicators(
						data?.data?.indicators
							.sort((a, b) => a.name.localeCompare(b.name))
							.reduce((acc, curr) => {
								if (curr.returnValues?.length) {
									curr.returnValues.forEach((x) => {
										acc.push({ ...curr, name: `${curr.name}.${x}` });
									});
								} else {
									acc.push(curr);
								}

								return acc;
							}, [])
					)
				);
			});

		fetchAuthorized(`${Config.apiRoot()}/platform/parities?status=ACTIVE`, {
			headers: {
				"Content-type": "application/json",
			},
			method: "GET",
		})
			.then((data) => data.json())
			.then((data) => {
				dispatch(setParities([...data?.data?.parities].sort((a, b) => a.symbol.localeCompare(b.symbol))));
			});

		fetchAuthorized(`${Config.apiRoot()}/platform/connections`, {
			headers: {
				"Content-type": "application/json",
			},
			method: "GET",
		})
			.then((data) => data.json())
			.then((data) => {
				dispatch(setConnections(data?.data?.connections));
			});

		getPortfolio().then((data) => setPortfolio(data));
	}, []);

	useEffect(() => {
		if (location?.hash) {
			const foundIndex = steps.findIndex((x) => x.hash === location.hash);

			dispatch(setActiveStep(foundIndex !== -1 && foundIndex));
		}
	}, [location]);

	useEffect(() => {
		if (status === "save-finished") {
			setStatus();
		}

		if (status === "continue-finished") {
			setStatus();

			if (activeStep === steps.length - 1) {
				navigate(`/workshop?t=strategies`);
				return;
			}

			strategyId
				? navigate(`/strategy-builder/${strategyId}${steps[activeStep + 1].hash}`)
				: navigate(`/strategy-builder${steps[activeStep + 1].hash}`);
		}
	}, [status]);

	useEffect(() => {
		if (strategyId) {
			fetchAuthorized(
				`${Config.apiRoot()}/strategy/strategy/${strategyId}?checkUser=true&openPositionsCount=true`,
				{
					headers: {
						"Content-type": "application/json",
					},
					method: "GET",
				}
			)
				.then((data) => data.json())
				.then((data) => {
					if (!data?.data?.strategy) {
						navigate("/workshop");
						return;
					}

					dispatch(setStrategy(omit(data?.data?.strategy, ["ruleDesignEnter", "ruleDesignExit"])));

					dispatch(
						setRuleDesign({
							enter: data?.data?.strategy?.ruleDesignEnter?.rules,
							exit: data?.data?.strategy?.ruleDesignExit?.rules,
						})
					);
				})
				.then(() =>
					fetchAuthorized(`${Config.apiRoot()}/strategy/strategy-follower/${strategyId}`, {
						headers: {
							"Content-type": "application/json",
						},
						method: "GET",
					})
				)
				.then((data) => data.json())
				.then((data) => {
					dispatch(setFollower(data?.data?.strategyFollower));
				});
		}
	}, [strategyId]);

	useEffect(() => {
		if (follower?.virtual) {
			setSteps([
				{
					label: t("workshop_menu_item_1"),
					component: Presets,
					hash: "#presets",
				},
				{
					label: t("workshop_menu_item_2"),
					component: Settings,
					hash: "#settings",
				},
				{
					label: t("workshop_menu_item_3"),
					component: RobotStatus,
					hash: "#robot-status",
				},
			]);
		} else {
			setSteps([
				{
					label: t("workshop_menu_item_1"),
					component: Presets,
					hash: "#presets",
				},
				{
					label: t("workshop_menu_item_2"),
					component: Settings,
					hash: "#settings",
				},
				{
					label: t("workshop_menu_item_3"),
					component: RobotStatus,
					hash: "#robot-status",
				},
				{
					label: t("workshop_menu_item_4"),
					component: Budget,
					hash: "#budget",
				},
			]);
		}
	}, [follower?.virtual]);

	const CurrentStep = steps[activeStep].component;

	return (
		<StrategyBuilderContext.Provider
			value={{
				status,
				setStatus,
				statusMap: {
					continue: "continue-finished",
					save: "save-finished",
				},
				portfolio,
			}}
		>
			<Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={status === "processing"}>
				<CircularProgress color="inherit" />
			</Backdrop>
			<RouteLayout header={t("strategy_builder_header_main")}>
				<div style={{ marginRight: "4vw" }}>
					<Paper
						sx={{
							padding: "24px",
							marginBottom: "12px",
							alignSelf: "flex-start",
							position: "-webkit-sticky",
							position: "sticky",
							top: 0,
							bottom: 20,
							zIndex: 1,
						}}
					>
						<Grid container justifyContent="space-between" spacing={2}>
							<Grid item>
								<Stepper
									sx={{ mt: 1 }}
									activeStep={activeStep}
									orientation="horizontal"
									nonLinear={Boolean(strategy?.id && follower?.strategyId)}
								>
									{steps.map(({ label, hash }, ix) => (
										<Step key={label}>
											<StepButton
												onClick={() =>
													strategyId
														? navigate(`/strategy-builder/${strategyId}${hash}`)
														: navigate(`/strategy-builder${hash}`)
												}
											>
												<Typography
													sx={{
														...(ix === activeStep
															? {
																	color: "#0F20E8",
																	fontSize: "16px",
																	fontWeight: 700,
															  }
															: {
																	color: "#AEAEAE",
																	fontSize: "14px",
															  }),
													}}
												>
													{t(`workshop_menu_item_${ix + 1}`)}
												</Typography>
											</StepButton>
										</Step>
									))}
								</Stepper>
							</Grid>
							<Grid item>
								<Grid container>
									<Grid item>
										<Button
											href="https://help.traderlands.com/en/collections/3915860-workshop"
											target="_blank"
											variant="text"
											startIcon={<Help />}
										>
											{t("workshop_menu_item_5")}
										</Button>
									</Grid>
									{activeStep !== 0 && strategy?.strategyTypeId !== 2 && (
										<Grid item>
											<Button
												variant="text"
												startIcon={<BacktestIcon width={16} height={12.21} color="#0F20E8" />}
												onClick={() => {
													setOpenBacktest(true);
												}}
											>
												{t("workshop_menu_item_8")}
											</Button>
											{openBacktest && (
												<BacktestDialog
													open={openBacktest}
													onClose={() => setOpenBacktest(false)}
												/>
											)}
										</Grid>
									)}
									<Grid item>
										<Button variant="text" startIcon={<Save />} onClick={() => setStatus("save")}>
											{t("workshop_menu_item_6")}
										</Button>
									</Grid>
									<Grid item>
										<Button
											variant="text"
											startIcon={<Continue />}
											onClick={() => {
												setStatus("continue");
											}}
										>
											{t("workshop_menu_item_7")}
										</Button>
									</Grid>
								</Grid>
							</Grid>
						</Grid>
					</Paper>
					<Grid container>
						<Grid item xs={12}>
							{strategy?.strategyTypeId === 2 && strategy?.webhookToken && (
								<Paper sx={{ padding: "24px", marginBottom: "16px", backgroundColor: "#F4F5FC" }}>
									<Grid container spacing={2}>
										<Grid item xs={1}>
											<Done style={{ marginTop: "16px" }} />
										</Grid>
										<Grid item>
											<Typography
												sx={{ fontWeight: 500, color: (theme) => theme.palette.success.main }}
											>
												{t("workshop_webhook_connection_title")}
											</Typography>
											<Button
												variant="text"
												onClick={() => setOpenWebhook(true)}
												sx={{
													color: "#6A1FC2",
													px: 0,
													textDecoration: "underline",
													"&:hover": {
														backgroundColor: "#F4F5FC !important",
														textDecoration: "underline",
													},
												}}
											>
												{t("common:View Details")}
											</Button>
										</Grid>
									</Grid>
									{openWebhook && (
										<WebhookSettings open={openWebhook} onClose={() => setOpenWebhook(false)} />
									)}
								</Paper>
							)}
						</Grid>
						<Grid item xs={12}>
							<CurrentStep />
						</Grid>
					</Grid>
				</div>
			</RouteLayout>
		</StrategyBuilderContext.Provider>
	);
}
