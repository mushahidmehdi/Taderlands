import { createContext, useContext } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { KeyboardArrowLeft } from "@mui/icons-material";
import { Chip, Divider, Grid, IconButton, Paper } from "@mui/material";

import { modifyRules } from "actions/StrategyBuilderActions";
import { Duplicate, Plus, Trash } from "images";
import useScroll from "utils/useScroll";

import { KEYS, REVERSE_OPERATION_MAP } from "../../constants";
import { RuleGroupContext } from "../group/RuleGroup";
import { RuleDesignContext } from "../RuleDesign";
import { Indicator } from "./indicator";
import { Operator } from "./operator";
import { Range } from "./range";
import { Value } from "./value";

const clauseMap = {
	1: "AND",
	2: "OR",
};

const EmptyRightRule = (t) => {
	return (
		<Grid item xs={5.3}>
			<div
				style={{
					padding: "60px",
					marginTop: "40px",
					marginRight: "16px",
					marginLeft: "16px",
					height: "155px",
					border: "1px dashed #AEAEAE",
					borderRadius: "8px",
				}}
			>
				<div
					style={{
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						flexWrap: "wrap",
						color: "#AEAEAE",
						fontSize: "14px",
						fontWeight: 700,
					}}
				>
					<KeyboardArrowLeft />
					<span>{t("strategy_builder_rule_design_operator_select_operator_text")}</span>
				</div>
			</div>
		</Grid>
	);
};

export const RuleContext = createContext();

export default function Rule({ index, addRule }) {
	const { groupIndex, helper, setHelper } = useContext(RuleGroupContext);
	const { type } = useContext(RuleDesignContext);

	const { ruleDesign } = useSelector((state) => state.strategyBuilder);
	const dispatch = useDispatch();
	const scrollById = useScroll();
	const { t } = useTranslation("workshop");

	const operation =
		REVERSE_OPERATION_MAP[ruleDesign[type][KEYS.GROUP][groupIndex][KEYS.RULES][index][KEYS.OPERATOR]]?.type;

	return (
		<RuleContext.Provider value={{ index }}>
			<div
				onMouseOver={() => {
					setHelper([...helper.slice(0, index), true, ...helper.slice(index + 1)]);
				}}
				onMouseOut={() => {
					setHelper([...helper.slice(0, index), false, ...helper.slice(index + 1)]);
				}}
			>
				<Grid container sx={{ ml: 2 }}>
					<Grid item xs={11.5}>
						<Paper sx={{ backgroundColor: "#FAFAFE", pb: 2 }}>
							<Grid container>
								<Indicator type="LEFT" />

								<Operator />

								{!operation && EmptyRightRule(t)}

								{operation === "Indicator" && <Indicator type="RIGHT" />}
								{operation === "Range" && <Range />}
								{operation === "Value" && <Value />}
							</Grid>
						</Paper>
					</Grid>
					{helper[index] && (
						<Grid item xs={0.5}>
							<Grid container direction="column" sx={{ ml: 1, mt: 10 }}>
								<Grid item>
									<IconButton
										onClick={() => {
											dispatch(modifyRules({ action: "delete", type, groupIndex, index }));

											scrollById(`${type}-${groupIndex}-${index}`, -280);
										}}
									>
										<Trash />
									</IconButton>
								</Grid>
								<Grid item>
									<IconButton
										onClick={() => {
											dispatch(modifyRules({ action: "duplicate", type, groupIndex, index }));

											scrollById(`${type}-${groupIndex}-${index}`, 270);
										}}
									>
										<Duplicate />
									</IconButton>
								</Grid>
								<Grid item>
									<IconButton onClick={() => addRule()}>
										<Plus />
									</IconButton>
								</Grid>
							</Grid>
						</Grid>
					)}
				</Grid>
			</div>

			{index !== 0 && false && (
				<Grid item xs={12} sx={{ mt: 4, mb: 4 }}>
					<Divider>
						<Chip
							sx={{
								backgroundColor: "#CFD2FA",
								color: "#0F20E8",
								fontSize: "12px",
								width: "32px",
								borderRadius: "32px",
								"& .MuiChip-label": {
									p: 0,
								},
							}}
							label={t(
								`workshop_tl_strategy_page_${clauseMap[
									ruleDesign[type][KEYS.GROUP]?.[groupIndex]?.[KEYS.CLAUSE]
								].toLowerCase()}_chip`
							)}
						/>
					</Divider>
				</Grid>
			)}
		</RuleContext.Provider>
	);
}
