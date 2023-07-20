import React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { Info, RadioChecked, RadioUnchecked } from "images";

import { Button, Grid, IconButton, Tooltip, Typography } from "@mui/material";

import { setRuleDesign } from "actions/StrategyBuilderActions";

import { KEYS } from "../../constants";

const clauseMap = {
	1: "AND",
	2: "OR",
};

export default function ClauseSelect({ index, type }) {
	const { ruleDesign } = useSelector((state) => state.strategyBuilder);
	const { t } = useTranslation("workshop");

	const dispatch = useDispatch();

	const handleClick = (value) => {
		const group = [...ruleDesign[type][KEYS.GROUP]];

		group[index] = {
			...group[index],
			[KEYS.CLAUSE]: value,
		};

		dispatch(
			setRuleDesign({
				...ruleDesign,
				[type]: {
					...ruleDesign?.[type],
					[KEYS.GROUP]: group,
				},
			})
		);
	};

	const clause = ruleDesign[type][KEYS.GROUP]?.[index]?.[KEYS.CLAUSE];

	return (
		<Grid item xs={12}>
			<Grid container justifyContent="center" direction="column" alignItems="center" spacing={1}>
				<Grid item xs={12}>
					<Typography sx={{ fontSize: "14px" }}>
						{t("workshop_tl_strategy_page_rule_group_clause_text")}
						<Tooltip
							size="lg"
							title={t("tooltip.Workshop/Strategy Design/Rule connection")}
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
					</Typography>
				</Grid>

				<Grid item xs={12}>
					{[1, 2].map((c) => (
						<Button
							sx={{ width: 75, mr: 1, mb: 2 }}
							onClick={() => {
								handleClick(c);
							}}
							variant={clause == c ? "contained" : "outlined"}
							startIcon={clause == c ? <RadioChecked /> : <RadioUnchecked />}
						>
							{t(`workshop_tl_strategy_page_${clauseMap[c].toLowerCase()}_chip`)}
						</Button>
					))}
				</Grid>
			</Grid>
		</Grid>
	);
}
