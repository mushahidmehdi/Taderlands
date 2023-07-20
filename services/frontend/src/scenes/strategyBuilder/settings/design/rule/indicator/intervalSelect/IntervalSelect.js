import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { ArrowDown } from "images";
import { KEYS, PLATFORM_INTERVALS } from "scenes/strategyBuilder/settings/constants";
import { RuleGroupContext } from "scenes/strategyBuilder/settings/design/group/RuleGroup";
import { RuleContext } from "scenes/strategyBuilder/settings/design/rule/Rule";
import { RuleDesignContext } from "scenes/strategyBuilder/settings/design/RuleDesign";
import { SettingsContext } from "scenes/strategyBuilder/settings/Settings";

import { Box, Typography, useTheme } from "@mui/material";

import { changeRule } from "actions/StrategyBuilderActions";
import { Select } from "components";

import { RuleIndicatorContext } from "../Indicator";

export default function IntervalSelect() {
	const { t } = useTranslation("workshop");

	const { ruleDesign } = useSelector((state) => state.strategyBuilder);

	const { groupIndex } = useContext(RuleGroupContext);
	const { index } = useContext(RuleContext);
	const { type } = useContext(RuleDesignContext);
	const { error } = useContext(SettingsContext);

	const { indicatorType } = useContext(RuleIndicatorContext);

	const dispatch = useDispatch();
	const theme = useTheme();

	const intervalKey = indicatorType === "LEFT" ? KEYS.LEFT_INTERVAL : KEYS.RIGHT_INTERVAL;

	return (
		<Select
			label={t("workshop_tl_strategy_page_interval_select_label")}
			value={
				PLATFORM_INTERVALS.reduce((acc, curr) => {
					acc[curr.duration] = curr.name;
					return acc;
				}, {})[ruleDesign[type][KEYS.GROUP][groupIndex][KEYS.RULES][index][intervalKey]] ?? "Select"
			}
			onChange={(e) => {
				dispatch(
					changeRule({
						type,
						groupIndex,
						index,
						key: intervalKey,
						value: PLATFORM_INTERVALS.reduce((acc, curr) => {
							acc[curr.name] = curr.duration;
							return acc;
						}, {})[e.target.value],
					})
				);
			}}
			labelProps={{
				sx: {
					fontSize: "12px",
					fontWeight: 700,
					color: (theme) =>
						error?.[`${type}-${groupIndex}-${index}`]?.[intervalKey]
							? theme.palette.danger.main
							: theme.palette.primary.main,
				},
			}}
			formControlProps={{
				fullWidth: true,
				sx: {
					"& .MuiOutlinedInput-notchedOutline": {
						borderColor: (theme) =>
							error?.[`${type}-${groupIndex}-${index}`]?.[intervalKey]
								? theme.palette.danger.main
								: theme.palette.primary.main,
					},
				},
			}}
			selectProps={{
				renderValue: (p) => (
					<Box
						component="span"
						sx={{
							color: (theme) =>
								error?.[`${type}-${groupIndex}-${index}`]?.[intervalKey]
									? theme.palette.danger.main
									: theme.palette.primary.main,
						}}
					>
						{p === "Select"
							? t("workshop_tl_strategy_page_interval_select_placeholder")
							: t(`workshop_tl_strategy_page_interval_select_${p}`)}
					</Box>
				),
			}}
			IconComponent={(props) => (
				<>
					{error?.[`${type}-${groupIndex}-${index}`]?.[intervalKey] ? (
						<ArrowDown color={theme.palette.danger.main} {...props} />
					) : (
						<ArrowDown {...props} />
					)}
				</>
			)}
			containerProps={{ rowSpacing: 0.4 }}
			options={PLATFORM_INTERVALS.map((option) => ({
				value: option.name,
				content: <Typography>{t(`workshop_tl_strategy_page_interval_select_${option.name}`)}</Typography>,
			}))}
		/>
	);
}
