import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	strategies: null,
};

const strategySlice = createSlice({
	name: "strategy",
	initialState,
	reducers: {
		setStrategies: (state, action) => {
			state.strategies = action.payload;
		},
	},
});

export const { setStrategies } = strategySlice.actions;

export default strategySlice.reducer;
