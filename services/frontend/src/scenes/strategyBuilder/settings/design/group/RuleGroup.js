import { createContext, useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { Delete } from "@mui/icons-material";
import { Button, Card, CardContent, CardHeader, Grid, IconButton, Typography } from "@mui/material";

import { TextField } from "components";

import { setRuleDesign } from "actions/StrategyBuilderActions";

import useScroll from "utils/useScroll";

import { Duplicate, Plus, Scroll, ScrollUp, Uri, UriPrime } from "images";

import { KEYS } from "../../constants";
import { RuleDesignContext } from "../RuleDesign";
import { Rule } from "../rule";
import ClauseSelect from "./ClauseSelect";

const clauseMap = {
	1: "AND",
	2: "OR",
};

export const RuleGroupContext = createContext();

export default function RuleGroup({ index }) {
	const { type } = useContext(RuleDesignContext);

	const { ruleDesign } = useSelector((state) => state.strategyBuilder);

	const dispatch = useDispatch();
	const scrollById = useScroll();
	const { t } = useTranslation("workshop");

	const [editOpen, setEditOpen] = useState();
	const [name, setName] = useState(ruleDesign[type]?.[KEYS.GROUP]?.[index]?.[KEYS.NAME]);
	const [groupOpen, setGroupOpen] = useState(true);
	const [helper, setHelper] = useState(Array.from(ruleDesign[type][KEYS.GROUP].map((_) => false)));

	const handleNameSave = () => {
		const group = [...ruleDesign[type][KEYS.GROUP]];

		group[index] = {
			...group[index],
			[KEYS.NAME]: name,
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

		setEditOpen(false);
	};

	const handleGroupAction = (action) => {
		const groups = [...ruleDesign[type][KEYS.GROUP]];

		if (action === "add-rule") {
			groups[index] = {
				...groups[index],
				[KEYS.RULES]: [
					...(groups[index]?.[KEYS.RULES] ?? []),
					{
						[KEYS.LEFT_PAIR]: "PARITY",
					},
				],
			};

			dispatch(
				setRuleDesign({
					...ruleDesign,
					[type]: {
						...ruleDesign?.[type],
						[KEYS.GROUP]: groups,
					},
				})
			);

			scrollById(`${type}-${index}-${ruleDesign[type]?.[KEYS.GROUP]?.[index]?.[KEYS.RULES].length - 1}`, 270);
		}

		if (action === "delete") {
			dispatch(
				setRuleDesign({
					...ruleDesign,
					[type]: {
						...ruleDesign[type],
						[KEYS.GROUP]: groups.filter((_, ix) => ix !== index),
					},
				})
			);
		}

		if (action === "duplicate") {
			dispatch(
				setRuleDesign({
					...ruleDesign,
					[type]: {
						...ruleDesign[type],
						[KEYS.GROUP]: [...groups.slice(0, index), groups[index], ...groups.slice(index)],
					},
				})
			);
		}
	};

	return (
		<RuleGroupContext.Provider value={{ groupIndex: index, helper, setHelper }}>
			<Card sx={{ backgroundColor: "#F0F0F5", mb: 2 }}>
				<CardHeader
					sx={{ backgroundColor: "white" }}
					avatar={
						<>
							{type === "exit" && <UriPrime width={36} height={36} color="#3A3A3A" />}
							{type === "enter" && <Uri width={36} height={36} active={true} />}
						</>
					}
					title={
						<>
							{editOpen ? (
								<Grid container sx={{ mb: "2px" }}>
									<Grid item>
										<TextField
											value={name}
											margin="dense"
											sx={{
												py: 0,
												px: "4px",
												"& .MuiOutlinedInput-input": {
													p: "0px 2px",
												},
											}}
											onChange={(e) => {
												setName(e.target.value);
											}}
										/>
									</Grid>
									<Grid item>
										<Button
											onClick={() => {
												handleNameSave();
											}}
										>
											{t("common:Save")}
										</Button>
									</Grid>
								</Grid>
							) : (
								<>
									<Typography sx={{ color: "#3A3A3A", fontSize: "16px" }}>
										{ruleDesign[type][KEYS.GROUP]?.[index]?.[KEYS.NAME]}
									</Typography>
									<Typography
										style={{ color: "#6A1FC2", fontSize: "10px", width: "42px", cursor: "pointer" }}
										onClick={() => setEditOpen(true)}
									>
										{t("common:Rename")}
									</Typography>
								</>
							)}
						</>
					}
					action={
						<Grid>
							<Button
								startIcon={<Plus />}
								variant="text"
								onClick={() => {
									handleGroupAction("add-rule");
								}}
							>
								{t("workshop_tl_strategy_page_add_rule_button")}
							</Button>
							<Button
								startIcon={<Duplicate />}
								variant="text"
								onClick={() => handleGroupAction("duplicate")}
							>
								{t("workshop_tl_strategy_page_duplicate_button")}
							</Button>
							<Button startIcon={<Delete />} variant="text" onClick={() => handleGroupAction("delete")}>
								{t("workshop_tl_strategy_page_delete_button")}
							</Button>
							<IconButton
								onClick={() => {
									setGroupOpen(!groupOpen);
								}}
							>
								{groupOpen ? <ScrollUp /> : <Scroll />}
							</IconButton>
						</Grid>
					}
				/>
				{groupOpen && (
					<CardContent sx={{ backgroundColor: "white" }}>
						<Grid container>
							<Grid item xs={12}>
								<Grid container>
									<ClauseSelect type={type} index={index} />
								</Grid>
							</Grid>
							<Grid item xs={12}>
								{ruleDesign[type]?.[KEYS.GROUP]?.[index]?.[KEYS.RULES]?.map((_, ix) => (
									<div id={`${type}-${index}-${ix}`}>
										<Rule
											index={ix}
											addRule={() => {
												handleGroupAction("add-rule");
											}}
										/>
										{ix !== ruleDesign[type]?.[KEYS.GROUP]?.[index]?.[KEYS.RULES]?.length - 1 && (
											<>
												<div style={{ textAlign: "center", color: "#0F20E8" }}>|</div>
												<div
													style={{
														borderRadius: "4px",
														backgroundColor: "#CFD2FA",
														color: "#0F20E8",
														width: "40px",
														marginLeft: "auto",
														marginRight: "auto",
														fontSize: "12px",
														fontWeight: 700,
														textAlign: "center",
													}}
												>
													{clauseMap[
														ruleDesign[type][KEYS.GROUP]?.[index]?.[KEYS.CLAUSE]
													]?.toLowerCase()}
												</div>
												<div style={{ textAlign: "center", color: "#0F20E8" }}>|</div>
											</>
										)}
									</div>
								))}
							</Grid>
						</Grid>
					</CardContent>
				)}
			</Card>
		</RuleGroupContext.Provider>
	);
}
