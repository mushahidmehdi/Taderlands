import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { Box, Grid, IconButton, Paper, Tooltip, Typography } from "@mui/material";

import { InputWithSlider, Slider, TextField } from "components";

import { setStrategy } from "actions/StrategyBuilderActions";

import { Info, Scroll, ScrollUp } from "images";

const marksDecimal = [
	{
		value: 0,
		label: "0.0",
	},
	{
		value: 100,
		label: "100.0",
	},
];

const marksX = [
	{
		value: 1,
		label: "1x",
	},
	{
		value: 5,
		label: "5x",
	},
];

export default function TradeSettings() {
	const { t } = useTranslation("workshop");

	const { strategy } = useSelector((state) => state.strategyBuilder);
	const [open, setOpen] = useState(true);

	const dispatch = useDispatch();

	const TradeSettingsTooltip = ({ label, tooltipText }) => {
		return (
			<Box sx={{ display: "flex", alignItems: "center" }}>
				<Typography>{label}</Typography>
				<Tooltip
					placement="right"
					size="lg"
					title={tooltipText}
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
			</Box>
		);
	};

	const tradeDurationFields = (t) => [
		{
			label: t("workshop_tl_strategy_page_trade_settings_min_dur"),
			tooltipText: t("tooltip.trade_settings_info_minimum_stand_open"),
			key: "minTradeDuration",
		},
		{
			label: t("workshop_tl_strategy_page_trade_settings_max_dur"),
			tooltipText: t("tooltip.trade_settings_info_maximum_stand_open"),
			key: "maxTradeDuration",
		},
		{
			label: t("workshop_tl_strategy_page_trade_settings_interval"),
			tooltipText: t("tooltip.trade_settings_info_minimum_wait_time"),
			key: "newPositionDuration",
		},
	];

	return (
		<div style={{ marginTop: "16px" }}>
			<Paper sx={{ backgroundColor: "white", pl: "16px", pr: "24px", py: "24px" }}>
				<Grid container sx={{ ...(open && { mb: "40px" }) }}>
					<Grid item>
						<IconButton
							variant="text"
							onClick={() => {
								setOpen(!open);
							}}
						>
							{open ? <ScrollUp /> : <Scroll />}
						</IconButton>
					</Grid>
					<Grid item>
						<Box
							sx={{
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
							}}
						>
							<Typography
								sx={{
									color: "#0F20E8",
									fontWeight: "bold",
									fontSize: "1rem",
								}}
							>
								{t("workshop_tl_strategy_page_trade_settings_main_title")}
							</Typography>
						</Box>
					</Grid>
				</Grid>
				{open && (
					<Grid container spacing={6} sx={{ pl: "8px" }}>
						<Grid item xs={12}>
							<div style={{ paddingLeft: "18px" }}>
								<InputWithSlider
									label={
										<TradeSettingsTooltip
											label={t("workshop_tl_strategy_page_trade_settings_stop_loss")}
											tooltipText={t("tooltip.trade_settings_info_stop_loss")}
										/>
									}
									step={0.1}
									min={0.0}
									max={strategy?.tradeSettings?.stopLoss?.steps?.[0]?.amount}
									marksDecimal={marksDecimal}
									value={strategy?.tradeSettings?.stopLoss?.steps?.[0]?.value}
									onSliderChange={(_, value) =>
										dispatch(
											setStrategy({
												...strategy,
												tradeSettings: {
													...strategy?.tradeSettings,
													stopLoss: {
														enabled: value !== 0,
														by: "PERCENT",
														steps: [{ value, amount: 100 }],
													},
												},
											})
										)
									}
									onTextChange={(e) => {
										if (parseFloat(e.target.value) > 100) {
											return;
										}

										dispatch(
											setStrategy({
												...strategy,
												tradeSettings: {
													...strategy?.tradeSettings,
													stopLoss: {
														enabled: e.target.value !== 0,
														by: "PERCENT",
														steps: [{ value: e.target.value, amount: 100 }],
													},
												},
											})
										);
									}}
								/>
							</div>
						</Grid>
						<Grid item xs={12}>
							<div style={{ paddingLeft: "18px" }}>
								<InputWithSlider
									label={
										<TradeSettingsTooltip
											label={t("workshop_tl_strategy_page_trade_settings_take_profit")}
											tooltipText={t("tooltip.trade_settings_info_take_profit")}
										/>
									}
									step={0.1}
									min={0.0}
									max={strategy?.tradeSettings?.takeProfit?.steps?.[0]?.amount}
									marksDecimal={marksDecimal}
									value={strategy?.tradeSettings?.takeProfit?.steps?.[0]?.value}
									onSliderChange={(_, value) =>
										dispatch(
											setStrategy({
												...strategy,
												tradeSettings: {
													...strategy?.tradeSettings,
													takeProfit: {
														enabled: value !== 0,
														by: "PERCENT",
														steps: [{ value, amount: 100 }],
													},
												},
											})
										)
									}
									onTextChange={(e) => {
										dispatch(
											setStrategy({
												...strategy,
												tradeSettings: {
													...strategy?.tradeSettings,
													takeProfit: {
														enabled: e.target.value !== 0,
														by: "PERCENT",
														steps: [{ value: e.target.value, amount: 100 }],
													},
												},
											})
										);
									}}
								/>
							</div>
						</Grid>
						<Grid item xs={12}>
							<div style={{ border: "1px dashed #CFD2FA", borderRadius: "8px", padding: "32px" }}>
								<Grid container spacing={!strategy?.webhookToken && 6}>
									<Grid item xs={strategy?.webhookToken ? 12 : 6}>
										<InputWithSlider
											label={
												<TradeSettingsTooltip
													label={t("workshop_tl_strategy_page_trade_settings_trailing_stop")}
													tooltipText={t("tooltip.trade_settings_info_trailing_stop")}
												/>
											}
											step={0.1}
											min={0.0}
											max={strategy?.tradeSettings?.trailingStop?.steps?.[0]?.amount}
											marksDecimal={marksDecimal}
											value={strategy?.tradeSettings?.trailingStop?.steps?.[0]?.startsAt}
											onSliderChange={(_, value) =>
												dispatch(
													setStrategy({
														...strategy,
														tradeSettings: {
															...strategy?.tradeSettings,
															trailingStop: {
																enabled: Boolean(Number(value)),
																by: "PERCENT",
																steps: [
																	{
																		startsAt: value,
																		amount: 100,
																		followDistance:
																			strategy?.tradeSettings?.trailingStop
																				?.steps?.[0]?.followDistance ?? 0,
																	},
																],
															},
														},
													})
												)
											}
											onTextChange={(e) => {
												const { value } = e.target;
												dispatch(
													setStrategy({
														...strategy,
														tradeSettings: {
															...strategy?.tradeSettings,
															trailingStop: {
																enabled: Boolean(Number(value)),
																by: "PERCENT",
																steps: [
																	{
																		startsAt: value,
																		amount: 100,
																		followDistance:
																			strategy?.tradeSettings?.trailingStop
																				?.steps?.[0]?.followDistance ?? 0,
																	},
																],
															},
														},
													})
												);
											}}
										/>
									</Grid>
									<Grid item xs={strategy?.webhookToken ? 12 : 6}>
										<InputWithSlider
											label={
												<TradeSettingsTooltip
													label={t("workshop_tl_strategy_page_trade_settings_follows_with")}
													tooltipText={t("tooltip.trade_settings_info_following_distance")}
												/>
											}
											step={0.1}
											min={0.0}
											max={strategy?.tradeSettings?.trailingStop?.steps?.[0]?.amount}
											marksDecimal={marksDecimal}
											value={strategy?.tradeSettings?.trailingStop?.steps?.[0]?.followDistance}
											onSliderChange={(_, value) =>
												dispatch(
													setStrategy({
														...strategy,
														tradeSettings: {
															...strategy?.tradeSettings,
															trailingStop: {
																...strategy?.tradeSettings?.trailingStop,
																steps: [
																	{
																		startsAt:
																			strategy?.tradeSettings?.trailingStop
																				?.steps?.[0]?.startsAt ?? 0,
																		amount: 100,
																		followDistance: value,
																	},
																],
															},
														},
													})
												)
											}
											onTextChange={(e) => {
												const { value } = e.target;
												dispatch(
													setStrategy({
														...strategy,
														tradeSettings: {
															...strategy?.tradeSettings,
															trailingStop: {
																...strategy?.tradeSettings?.trailingStop,
																steps: [
																	{
																		startsAt:
																			strategy?.tradeSettings?.trailingStop
																				?.steps?.[0]?.startsAt ?? 0,
																		amount: 100,
																		followDistance: value,
																	},
																],
															},
														},
													})
												);
											}}
										/>
									</Grid>
								</Grid>
							</div>
						</Grid>
						{["SHORT", "LONG"].some((x) => x === strategy?.executionType) && (
							<Grid item xs={12}>
								<Slider
									label={t("workshop_tl_strategy_page_trade_settings_leverage")}
									step={1}
									min={1}
									ß
									max={5}
									valueLabelDisplay="auto"
									valueLabelFormat={(value) => value + "x"}
									marks={marksX}
									value={strategy?.tradeSettings?.leverage}
									onChange={(_, value) =>
										dispatch(
											setStrategy({
												...strategy,
												tradeSettings: {
													...strategy?.tradeSettings,
													leverage: value,
												},
											})
										)
									}
								/>
							</Grid>
						)}
						{strategy && strategy.strategyTypeId === 1 ? (
							<Grid item xs={6}>
								<Grid container>
									{tradeDurationFields(t).map(({ label, key, tooltipText }, ix) => (
										<Grid item xs={12}>
											<TextField
												label={
													<TradeSettingsTooltip
														label={label}
														key={key}
														tooltipText={tooltipText}
													/>
												}
												variant="outlined"
												size="small"
												type="number"
												inputProps={{ min: 0, step: 1 }}
												sx={{
													backgroundColor: "#FFFFFF",
													width: "90%",
													...(ix !== tradeDurationFields.length - 1 && { mb: 2 }),
												}}
												value={strategy?.tradeSettings?.[key]?.value}
												onChange={(e) => {
													const value = e.target.value ? parseInt(e.target.value) : null;

													dispatch(
														setStrategy({
															...strategy,
															tradeSettings: {
																...strategy?.tradeSettings,
																[key]: {
																	enabled: Boolean(value),
																	value,
																},
															},
														})
													);
												}}
											/>
										</Grid>
									))}
								</Grid>
							</Grid>
						) : (
							""
						)}
					</Grid>
				)}
			</Paper>
		</div>
	);
}
