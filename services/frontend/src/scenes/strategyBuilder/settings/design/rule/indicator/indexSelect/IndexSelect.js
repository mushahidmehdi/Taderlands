import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { Box, Typography, useTheme } from "@mui/material";

import { SettingsContext } from "scenes/strategyBuilder/settings/Settings";
import { INDEX_TEXT, INDEX_TEXT_RENDER, KEYS } from "scenes/strategyBuilder/settings/constants";
import { RuleDesignContext } from "scenes/strategyBuilder/settings/design/RuleDesign";
import { RuleGroupContext } from "scenes/strategyBuilder/settings/design/group/RuleGroup";
import { RuleContext } from "scenes/strategyBuilder/settings/design/rule/Rule";

import { Select } from "components";

import { changeRule } from "actions/StrategyBuilderActions";

import { ArrowDown } from "images";

import { RuleIndicatorContext } from "../Indicator";

export default function IndexSelect() {
	const { ruleDesign } = useSelector((state) => state.strategyBuilder);
	const { indicators } = useSelector((state) => state.indicator);

	const { groupIndex } = useContext(RuleGroupContext);
	const { index } = useContext(RuleContext);
	const { type } = useContext(RuleDesignContext);
	const { error } = useContext(SettingsContext);
	const { indicatorType } = useContext(RuleIndicatorContext);

	const dispatch = useDispatch();
	const theme = useTheme();
	const { t } = useTranslation("workshop");

	const indexKey = indicatorType === "LEFT" ? KEYS.LEFT_INDEX : KEYS.RIGHT_INDEX;

	const selectedIndicator = indicators?.find(
		(x) =>
			x.name ===
			ruleDesign[type][KEYS.GROUP][groupIndex][KEYS.RULES][index][
				indicatorType === "LEFT" ? KEYS.LEFT_INDICATOR : KEYS.RIGHT_INDICATOR
			]
	);

	return (
		<Select
			label={t("workshop_tl_strategy_page_index_select_label")}
			value={
				ruleDesign[type][KEYS.GROUP][groupIndex][KEYS.RULES][index][
					indicatorType === "LEFT" ? KEYS.LEFT_INDEX : KEYS.RIGHT_INDEX
				] ?? t("workshop_tl_strategy_page_index_select_placeholder")
			}
			onChange={(e) => {
				dispatch(
					changeRule({
						type,
						groupIndex,
						index,
						key: indicatorType === "LEFT" ? KEYS.LEFT_INDEX : KEYS.RIGHT_INDEX,
						value: e.target.value,
					})
				);
			}}
			labelProps={{
				sx: {
					fontSize: "12px",
					fontWeight: 700,
					color: (theme) =>
						error?.[`${type}-${groupIndex}-${index}`]?.[indexKey]
							? theme.palette.danger.main
							: theme.palette.primary.main,
				},
			}}
			options={(selectedIndicator ? selectedIndicator?.availableIndexes : []).map((x) => ({
				value: x,
				content: <Typography>{INDEX_TEXT[x]}</Typography>,
			}))}
			formControlProps={{
				fullWidth: true,
				sx: {
					sx: {
						"& .MuiOutlinedInput-notchedOutline": {
							borderColor: (theme) =>
								error?.[`${type}-${groupIndex}-${index}`]?.[indexKey]
									? theme.palette.danger.main
									: theme.palette.primary.main,
						},
					},
				},
			}}
			containerProps={{ rowSpacing: 0.4 }}
			selectProps={{
				renderValue: (p) => (
					<Box
						component="span"
						sx={{
							color: (theme) =>
								error?.[`${type}-${groupIndex}-${index}`]?.[indexKey]
									? theme.palette.danger.main
									: theme.palette.primary.main,
						}}
					>
						{INDEX_TEXT_RENDER[p]}
					</Box>
				),
				...(indicators &&
				indicators?.find(
					(x) =>
						x.name ===
						ruleDesign[type][KEYS.GROUP][groupIndex][KEYS.RULES][index][
							indicatorType === "LEFT" ? KEYS.LEFT_INDICATOR : KEYS.RIGHT_INDICATOR
						]
				)
					? { disabled: false }
					: { disabled: true }),
			}}
			IconComponent={(props) => (
				<>
					{error?.[`${type}-${groupIndex}-${index}`]?.[indexKey] ? (
						<ArrowDown color={theme.palette.danger.main} {...props} />
					) : (
						<ArrowDown {...props} />
					)}
				</>
			)}
		/>
	);
}
