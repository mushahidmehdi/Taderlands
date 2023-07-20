import { createContext, useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { omit } from "lodash";

import { Grid, IconButton, Typography } from "@mui/material";

import { changeRule } from "actions/StrategyBuilderActions";
import { CustomButton, Dialog } from "components";
import Pair from "components/Pair";
import Platform from "components/Platform";
import { ArrowLeft } from "images";
import { KEYS } from "scenes/strategyBuilder/settings/constants";
import { RuleGroupContext } from "scenes/strategyBuilder/settings/design/group/RuleGroup";
import { RuleContext } from "scenes/strategyBuilder/settings/design/rule/Rule";
import { RuleDesignContext } from "scenes/strategyBuilder/settings/design/RuleDesign";
import { SettingsContext } from "scenes/strategyBuilder/settings/Settings";

import { RuleIndicatorContext } from "../Indicator";
import DialogContent from "./DialogContent";

export const PairSelectContext = createContext();

export default function PairSelect() {
	const { parities } = useSelector((state) => state.parity);
	const { platforms } = useSelector((state) => state.platform);
	const { strategy, ruleDesign } = useSelector((state) => state.strategyBuilder);

	const { groupIndex } = useContext(RuleGroupContext);
	const { index } = useContext(RuleContext);
	const { type } = useContext(RuleDesignContext);
	const { indicatorType } = useContext(RuleIndicatorContext);
	const { error, setError } = useContext(SettingsContext);
	const { t } = useTranslation("workshop");

	const dispatch = useDispatch();

	const pairKey = indicatorType === "LEFT" ? KEYS.LEFT_PAIR : KEYS.RIGHT_PAIR;
	const platformKey = indicatorType === "LEFT" ? KEYS.LEFT_EXCHANGE : KEYS.RIGHT_EXCHANGE;

	const selectedPairSymbol = ruleDesign[type][KEYS.GROUP][groupIndex][KEYS.RULES][index][pairKey];
	const selectedPlatformId = ruleDesign[type][KEYS.GROUP][groupIndex][KEYS.RULES][index][platformKey];
	const selectedPair = parities.find((x) => x.symbol === selectedPairSymbol && x.platformId === selectedPlatformId);
	const selectedPlatform = platforms.find((x) => x.id === selectedPair?.platformId);

	const [open, setOpen] = useState();
	const [search, setSearch] = useState();
	const [pairs, setPairs] = useState(["Runtime", ...parities.filter((x) => x.platformId === strategy?.platformId)]);
	const [selectExchange, setSelectExchange] = useState();
	const [platform, setPlatform] = useState();

	return (
		<PairSelectContext.Provider
			value={{
				search,
				setSearch,
				pairs,
				setPairs,
				selectExchange,
				setSelectExchange,
				platform,
				setPlatform,
			}}
		>
			<CustomButton
				label={
					<Grid
						container
						justifyContent="space-between"
						sx={{
							height: "27px",
						}}
					>
						<Grid item>
							<Typography
								component="span"
								sx={{
									color: (theme) =>
										error?.[`${type}-${groupIndex}-${index}`]?.[pairKey]
											? theme.palette.danger.main
											: theme.palette.primary.main,
									fontWeight: 700,
									fontSize: "12px",
								}}
							>
								{t("strategy_builder_rule_design_pair_title")}
							</Typography>
						</Grid>
						{selectedPair && (
							<Grid item>
								<Platform
									platform={selectedPlatform}
									containerProps={{ sx: {}, spacing: "2px" }}
									labelProps={{
										sx: {
											fontSize: "12px",
											fontWeight: 700,
											color: (theme) =>
												error?.[`${type}-${groupIndex}-${index}`]?.[pairKey]
													? theme.palette.danger.main
													: theme.palette.primary.main,
										},
									}}
								/>
							</Grid>
						)}
					</Grid>
				}
				text={
					<>
						{!selectedPairSymbol && (
							<Typography
								sx={{
									alignItems: "left",
									fontSize: "16px",
									color: (theme) =>
										error?.[`${type}-${groupIndex}-${index}`]?.[pairKey]
											? theme.palette.danger.main
											: "#000",
								}}
							>
								{t("strategy_builder_rule_design_pair_title")}
							</Typography>
						)}
						{selectedPairSymbol === "PARITY" && (
							<Typography sx={{ alignItems: "left", fontSize: "16px" }}>
								{t("strategy_builder_rule_design_pair_runtime")}
							</Typography>
						)}
						{selectedPair && selectedPairSymbol !== "PARITY" && (
							<Pair base={selectedPair?.base} quote={selectedPair?.quote} />
						)}
					</>
				}
				onClick={() => setOpen(true)}
				containerProps={{ sx: { mr: 1 } }}
				buttonProps={{
					sx: {
						height: "56px",
						paddingTop: "12px",
						backgroundColor: "white",
						boxShadow: "none",
						justifyContent: "flex-start",
						"&.MuiButton-root": {
							border: (theme) => `1px solid`,
							borderColor: (theme) =>
								error?.[`${type}-${groupIndex}-${index}`]?.[pairKey]
									? theme.palette.danger.main
									: theme.palette.primary.main,
						},
						"&:hover": {
							backgroundColor: "white",
							boxShadow: "none",
						},
					},
					fullWidth: true,
				}}
			/>

			{open && (
				<Dialog
					dialogProps={{
						open,
						onClose: () => {
							setOpen(false);
						},
						maxWidth: "md",
						fullWidth: true,
					}}
					title={
						<>
							{selectExchange ? (
								<>
									<IconButton
										aria-label="select-exchange"
										onClick={() => {
											setSelectExchange(false);
										}}
										sx={{
											position: "absolute",
											left: 8,
											top: 8,
											color: (theme) => theme.palette.grey[500],
										}}
									>
										<ArrowLeft />
									</IconButton>
									<span>{t("workshop_tl_strategy_page_pair_select_exchange")}</span>
								</>
							) : (
								<span>{t("workshop_tl_strategy_page_pair_select_title")}</span>
							)}
						</>
					}
					content={
						<DialogContent
							onClose={() => setOpen(false)}
							onChange={(item) => {
								const errorKey = `${type}-${groupIndex}-${index}`;

								setError({
									...error,
									[errorKey]: omit(error?.[errorKey], [pairKey]),
								});

								dispatch(
									changeRule({
										type,
										groupIndex,
										index,
										key: pairKey,
										value: item === "Runtime" ? "PARITY" : item.symbol,
									})
								);

								dispatch(
									changeRule({
										type,
										groupIndex,
										index,
										key: platformKey,
										value: item !== "Runtime" ? item.platformId : null,
									})
								);
							}}
						/>
					}
				/>
			)}
		</PairSelectContext.Provider>
	);
}
