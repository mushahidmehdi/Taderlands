import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { KEYS } from "scenes/strategyBuilder/settings/constants";
import { RuleGroupContext } from "scenes/strategyBuilder/settings/design/group/RuleGroup";
import { RuleContext } from "scenes/strategyBuilder/settings/design/rule/Rule";
import { RuleDesignContext } from "scenes/strategyBuilder/settings/design/RuleDesign";
import { SettingsContext } from "scenes/strategyBuilder/settings/Settings";

import { Grid } from "@mui/material";

import { changeRule } from "actions/StrategyBuilderActions";
import { TextField } from "components";

export default function RuleWithRange() {
	const { ruleDesign } = useSelector((state) => state.strategyBuilder);

	const { groupIndex } = useContext(RuleGroupContext);
	const { index } = useContext(RuleContext);
	const { type } = useContext(RuleDesignContext);
	const { error } = useContext(SettingsContext);

	const dispatch = useDispatch();
	const { t } = useTranslation("workshop");

	return (
		<Grid item xs={5.3}>
			<div style={{ marginLeft: "12px", marginRight: "12px", marginTop: "60px" }}>
				<Grid container spacing={1}>
					<Grid item xs={0.49 * 12}>
						<TextField
							label={t("workshop_tl_strategy_page_range_minimum_label")}
							error={error?.[`${type}-${groupIndex}-${index}`]?.[KEYS.RIGHT_RANGE_MIN]}
							labelProps={{ sx: { fontSize: "12px", fontWeight: 700 } }}
							fullWidth
							value={ruleDesign[type][KEYS.GROUP][groupIndex][KEYS.RULES][index][KEYS.RIGHT_RANGE_MIN]}
							onChange={(e) => {
								dispatch(
									changeRule({
										type,
										groupIndex,
										index,
										key: KEYS.RIGHT_RANGE_MIN,
										value: e.target.value,
									})
								);
							}}
						/>
					</Grid>
					<Grid item xs={0.49 * 12}>
						<TextField
							label={t("workshop_tl_strategy_page_range_maximum_label")}
							labelProps={{ sx: { fontSize: "12px", fontWeight: 700 } }}
							error={error?.[`${type}-${groupIndex}-${index}`]?.[KEYS.RIGHT_RANGE_MAX]}
							fullWidth
							value={ruleDesign[type][KEYS.GROUP][groupIndex][KEYS.RULES][index][KEYS.RIGHT_RANGE_MAX]}
							onChange={(e) => {
								dispatch(
									changeRule({
										type,
										groupIndex,
										index,
										key: KEYS.RIGHT_RANGE_MAX,
										value: e.target.value,
									})
								);
							}}
						/>
					</Grid>
				</Grid>
			</div>
		</Grid>
	);
}
