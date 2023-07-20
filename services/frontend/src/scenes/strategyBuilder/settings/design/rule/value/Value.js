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

export default function RuleWithValue() {
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
				<TextField
					labelProps={{ sx: { fontSize: "12px", fontWeight: 700 } }}
					fullWidth
					error={error?.[`${type}-${groupIndex}-${index}`]?.[KEYS.RIGHT_VALUE]}
					label={t("workshop_tl_strategy_page_value_label")}
					value={ruleDesign[type][KEYS.GROUP][groupIndex][KEYS.RULES][index][KEYS.RIGHT_VALUE]}
					onChange={(e) => {
						dispatch(
							changeRule({
								type,
								groupIndex,
								index,
								key: KEYS.RIGHT_VALUE,
								value: e.target.value,
							})
						);
					}}
				/>
			</div>
		</Grid>
	);
}
