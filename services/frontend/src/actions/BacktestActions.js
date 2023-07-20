import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	backtests: null,
	positions: null,
};

const backtestSlice = createSlice({
	name: "backtest",
	initialState,
	reducers: {
		setBacktests: (state, action) => {
			state.backtests = action.payload;
		},
		setPositions: (state, action) => {
			state.positions = action.payload;
		},
	},
});

export const { setBacktests, setPositions } = backtestSlice.actions;

export default backtestSlice.reducer;
