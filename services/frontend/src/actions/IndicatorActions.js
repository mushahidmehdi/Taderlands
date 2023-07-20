import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	indicators: null,
};

const indicatorSlice = createSlice({
	name: "indicator",
	initialState,
	reducers: {
		setIndicators: (state, action) => {
			state.indicators = action.payload;
		},
	},
});

export const { setIndicators } = indicatorSlice.actions;

export default indicatorSlice.reducer;
