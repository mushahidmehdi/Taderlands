import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { Grid, IconButton, Tooltip, Typography } from "@mui/material";

import { setRuleDesign } from "actions/StrategyBuilderActions";
import { Select } from "components";
import { Info } from "images";

import { KEYS, OPERATION_MAP, REVERSE_OPERATION_MAP } from "../../../constants";
import { RuleGroupContext } from "../../group/RuleGroup";
import { RuleDesignContext } from "../../RuleDesign";
import { RuleContext } from "../Rule";

const Operations = () => {
	const { t } = useTranslation("common");

	return Object.keys(OPERATION_MAP).map((type) => ({
		type,
		options: Object.keys(OPERATION_MAP[type]).map((op) => ({
			value: op,
			content: <Typography>{t(op)}</Typography>,
		})),
	}));
};

export default function Operator() {
	const { ruleDesign } = useSelector((state) => state.strategyBuilder);

	const { groupIndex } = useContext(RuleGroupContext);
	const { index } = useContext(RuleContext);
	const { type: designType } = useContext(RuleDesignContext);

	const dispatch = useDispatch();
	const { t } = useTranslation();

	const handleChange = (e) => {
		const value = e.target.value;

		const type = value.split(",")[0];

		const operation = value.split(",")[1];

		let groups = [...ruleDesign[designType][KEYS.GROUP]];

		let rules = [...groups[groupIndex][KEYS.RULES]];

		rules[index] = {
			...rules[index],
			[KEYS.OPERATOR]: OPERATION_MAP[type][operation],
			...(type === "Indicator" ? { [KEYS.RIGHT_PAIR]: "PARITY" } : {}),
		};

		groups[groupIndex] = {
			...groups[groupIndex],
			[KEYS.RULES]: rules,
		};

		dispatch(
			setRuleDesign({
				...ruleDesign,
				[designType]: {
					...ruleDesign[designType],
					[KEYS.GROUP]: groups,
				},
			})
		);
	};

	const operatorKey = ruleDesign[designType][KEYS.GROUP][groupIndex][KEYS.RULES][index][KEYS.OPERATOR];

	const operator = operatorKey
		? `${REVERSE_OPERATION_MAP?.[operatorKey]?.type},${REVERSE_OPERATION_MAP?.[operatorKey]?.value}`
		: "Select";

	return (
		<Grid item xs={1.4}>
			<Select
				key={operator}
				label={
					<>
						{t("strategy_builder_rule_design_operator_button_title")}
						<Tooltip
							size="lg"
							title={t("tooltip.Workshop/Strategy Design/Operators")}
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
								<Info />
							</IconButton>
						</Tooltip>
					</>
				}
				labelProps={{ sx: { fontSize: "12px", fontWeight: 700, textAlign: "center" } }}
				onChange={handleChange}
				value={operator}
				placeHolder
				containerProps={{
					sx: { mt: 7 },
					rowSpacing: 0.2,
				}}
				formControlProps={{
					sx: {
						"& .MuiOutlinedInput-root": {
							borderRadius: "100px",
							color: "white",
						},
					},
					fullWidth: true,
				}}
				selectProps={{
					renderValue: (p) => {
						if (p === "Select") {
							return t("strategy_builder_rule_design_operator_select_operator_button");
						}

						const type = p.split(",")[0];
						const value = p.split(",")[1];

						const key = OPERATION_MAP[type][value];

						return t(`common:${REVERSE_OPERATION_MAP[key]?.label}`);
					},
					sx: {
						"& .MuiSelect-select": { fontSize: "14px" },
						"& .MuiSelect-icon": { width: "10px", height: "10px" },
						"& .MuiOutlinedInput-notchedOutline": {
							borderColor: (theme) => theme.palette.primary.main,
						},
						backgroundColor: (theme) => theme.palette.primary.main,
						textAlign: "center",
					},
				}}
				//IconComponent={ArrowDownWhite}
				grouped
				options={Operations()}
			/>
		</Grid>
	);
}
