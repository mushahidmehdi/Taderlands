import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	parities: null,
};

const paritySlice = createSlice({
	name: "parity",
	initialState,
	reducers: {
		setParities: (state, action) => {
			state.parities = action.payload;
		},
	},
});

export const { setParities } = paritySlice.actions;

export default paritySlice.reducer;
