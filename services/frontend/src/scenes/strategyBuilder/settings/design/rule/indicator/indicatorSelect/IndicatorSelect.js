import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import { Grid, IconButton, Typography } from "@mui/material";

import { SettingsContext } from "scenes/strategyBuilder/settings/Settings";
import { KEYS } from "scenes/strategyBuilder/settings/constants";
import { RuleDesignContext } from "scenes/strategyBuilder/settings/design/RuleDesign";
import { RuleGroupContext } from "scenes/strategyBuilder/settings/design/group/RuleGroup";
import { RuleContext } from "scenes/strategyBuilder/settings/design/rule/Rule";

import { TextField } from "components";

import { Settings as SettingIcon } from "images";

import { RuleIndicatorContext } from "../Indicator";
import ParametersDialog from "./ParametersDialog";
import SelectionDialog from "./SelectionDialog";

export default function IndicatorSelect() {
	const { t, i18n } = useTranslation("workshop");

	const { indicators } = useSelector((state) => state.indicator);
	const { ruleDesign } = useSelector((state) => state.strategyBuilder);

	const { groupIndex } = useContext(RuleGroupContext);
	const { index } = useContext(RuleContext);
	const { type } = useContext(RuleDesignContext);
	const { indicatorType } = useContext(RuleIndicatorContext);
	const { error } = useContext(SettingsContext);

	const [openSelection, setOpenSelection] = useState(false);
	const [openParameters, setOpenParameters] = useState(false);

	const indicatorKey = indicatorType === "LEFT" ? KEYS.LEFT_INDICATOR : KEYS.RIGHT_INDICATOR;
	const selectedIndicatorName = ruleDesign[type][KEYS.GROUP][groupIndex][KEYS.RULES][index][indicatorKey];
	const selectedIndicator = indicators?.find((x) => x.name === selectedIndicatorName);

	return (
		<>
			{openParameters && (
				<ParametersDialog
					open={openParameters}
					onClose={() => {
						setOpenParameters(false);
					}}
					indicator={selectedIndicator}
					value={
						ruleDesign[type][KEYS.GROUP][groupIndex][KEYS.RULES][index][
							indicatorType === "LEFT" ? KEYS.LEFT_PARAMS : KEYS.RIGHT_PARAMS
						]
					}
				/>
			)}
			<TextField
				label={t("workshop_tl_strategy_page_indicator_select_label")}
				labelProps={{
					sx: {
						fontSize: "12px",
						fontWeight: 700,
						color: (theme) =>
							error?.[`${type}-${groupIndex}-${index}`]?.[indicatorKey]
								? theme.palette.danger.main
								: theme.palette.primary.main,
					},
				}}
				sx={{
					color: (theme) =>
						error?.[`${type}-${groupIndex}-${index}`]?.[indicatorKey]
							? theme.palette.danger.main
							: theme.palette.primary.main,
					borderColor: (theme) =>
						error?.[`${type}-${groupIndex}-${index}`]?.[indicatorKey]
							? theme.palette.danger.main
							: theme.palette.primary.main,
				}}
				containerProps={{ rowSpacing: 0.4 }}
				fullWidth
				readOnly
				onClick={() => setOpenSelection(true)}
				value={
					selectedIndicator?.translation?.[i18n.resolvedLanguage] ??
					t("workshop_tl_strategy_page_indicator_select_placeholder")
				}
			/>

			{selectedIndicator?.parameters?.length ? (
				<Grid container justifyContent="space-between">
					<Grid item></Grid>
					<Grid item>
						<Grid container>
							<Grid item>
								<Typography
									sx={{
										color: (theme) => theme.palette.primary.main,
										fontWeight: 700,
										fontSize: "12px",
										mr: 1,
									}}
								>
									{`(${Object.values(
										ruleDesign[type][KEYS.GROUP][groupIndex][KEYS.RULES][index][
											indicatorType === "LEFT" ? KEYS.LEFT_PARAMS : KEYS.RIGHT_PARAMS
										]
									).join(", ")})`}
								</Typography>
							</Grid>
							<Grid item>
								<IconButton sx={{ mt: -1 }} onClick={(e) => setOpenParameters(true)}>
									<SettingIcon />
								</IconButton>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			) : (
				<> </>
			)}

			{openSelection && (
				<SelectionDialog
					open={openSelection}
					onClose={() => {
						setOpenSelection(false);
					}}
				/>
			)}
		</>
	);
}
