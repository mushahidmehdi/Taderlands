import { createContext } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { Add } from "@mui/icons-material";
import { Button, Grid } from "@mui/material";

import { setRuleDesign } from "actions/StrategyBuilderActions";

import { KEYS, VALUES } from "../constants";
import { RuleGroup } from "./group";

export const RuleDesignContext = createContext();

export default function RuleDesign({ type }) {
	const { ruleDesign } = useSelector((state) => state.strategyBuilder);

	const dispatch = useDispatch();
	const { t } = useTranslation("workshop");

	const addRuleGroup = () => {
		dispatch(
			setRuleDesign({
				...ruleDesign,
				[type]: {
					[KEYS.CLAUSE]: VALUES.AND,
					...ruleDesign?.[type],
					[KEYS.GROUP]: [
						...(ruleDesign?.[type]?.[KEYS.GROUP] ?? []),
						{
							[KEYS.CLAUSE]: VALUES.AND,
							[KEYS.NAME]: ruleDesign?.[type]?.[KEYS.GROUP]?.length
								? t("workshop_strategy_settings_create_rule_group_default_name") +
								  `${ruleDesign?.[type]?.[KEYS.GROUP].length}`
								: t("workshop_strategy_settings_create_rule_group_default_name"),
							[KEYS.RULES]: [],
						},
					],
				},
			})
		);
	};

	return (
		<RuleDesignContext.Provider value={{ type }}>
			<Grid container spacing={1} sx={{ mt: 1 }}>
				<Grid item xs={12}>
					{ruleDesign?.[type]?.[KEYS.GROUP]?.map((_, index) => (
						<RuleGroup type={type} index={index} />
					))}
				</Grid>
				<Grid item xs={12}>
					<Grid container justifyContent="center">
						<Button onClick={addRuleGroup} startIcon={<Add />}>
							{t("workshop_tl_strategy_page_add_rule_group_button")}
						</Button>
					</Grid>
				</Grid>
			</Grid>
		</RuleDesignContext.Provider>
	);
}
