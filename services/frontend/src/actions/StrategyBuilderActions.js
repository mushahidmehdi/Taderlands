import { createSlice } from "@reduxjs/toolkit";
import { omit } from "lodash";

import { KEYS, VALUES } from "scenes/strategyBuilder/settings/constants";

// Rule design has two properties: enter and exit
// Under these, there are rule groups
// Each rule group has rules
// Each rule has two sides left and right

const initialState = {
	strategy: null,
	ruleDesign: {
		enter: {
			[KEYS.CLAUSE]: VALUES.AND,
			[KEYS.GROUP]: [
				{
					[KEYS.NAME]: "Rule Group",
					[KEYS.CLAUSE]: VALUES.AND,
					[KEYS.RULES]: [
						{
							[KEYS.LEFT_PAIR]: "PARITY",
						},
					],
				},
			],
		},
		exit: {
			[KEYS.CLAUSE]: VALUES.AND,
			[KEYS.GROUP]: [],
		},
	},
	follower: null,
	activeStep: 0,
	strategies: null,
	config: null,
};

const strategyBuilderSlice = createSlice({
	name: "strategyBuilder",
	initialState,
	reducers: {
		reset: (state, _) => {
			state.strategy = initialState.strategy;
			state.ruleDesign = initialState.ruleDesign;
			state.follower = initialState.follower;
			state.activeStep = initialState.activeStep;
		},
		setStrategy: (state, action) => {
			state.strategy = action.payload;
		},
		setFollower: (state, action) => {
			state.follower = action.payload;
		},
		setRuleDesign: (state, action) => {
			state.ruleDesign = action.payload;
		},
		modifyRules: (state, action) => {
			const ruleDesign = state.ruleDesign;
			const { action: actionType, type, groupIndex, index } = action.payload;

			let groups = [...ruleDesign[type][KEYS.GROUP]];
			const rules = groups[groupIndex][KEYS.RULES];

			if (actionType === "delete") {
				groups[groupIndex][KEYS.RULES] = rules.filter((_, ix) => ix !== index);
			}

			if (actionType == "duplicate") {
				groups[groupIndex][KEYS.RULES] = [...rules.slice(0, index), rules[index], ...rules.slice(index)];
			}

			state.ruleDesign = {
				...ruleDesign,
				[type]: {
					...ruleDesign?.[type],
					[KEYS.GROUP]: groups,
				},
			};
		},
		// This is used to change a property of a single rule
		changeRule: (state, action) => {
			const { type, groupIndex, index, key, value } = action.payload;

			const ruleDesign = state.ruleDesign;

			let groups = [...ruleDesign[type][KEYS.GROUP]];

			groups[groupIndex][KEYS.RULES][index] =
				typeof value !== "undefined" || typeof value !== "null"
					? {
							...groups[groupIndex][KEYS.RULES][index],
							[key]: value,
					  }
					: omit(groups[groupIndex][KEYS.RULES][index], [key]);

			state.ruleDesign = {
				...ruleDesign,
				[type]: {
					...ruleDesign?.[type],
					[KEYS.GROUP]: groups,
				},
			};
		},
		setActiveStep: (state, action) => {
			state.activeStep = action.payload;
		},
		setStrategies: (state, action) => {
			state.strategies = action.payload;
		},
		setConfig: (state, action) => {
			state.config = action.payload;
		},
	},
});

export const {
	modifyRules,
	reset,
	setFollower,
	setStrategy,
	setStrategies,
	setActiveStep,
	setRuleDesign,
	changeRule,
	setConfig,
} = strategyBuilderSlice.actions;

export default strategyBuilderSlice.reducer;
