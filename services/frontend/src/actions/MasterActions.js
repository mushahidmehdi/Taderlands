import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	master: null,
};

const masterSlice = createSlice({
	name: "master",
	initialState,
	reducers: {
		setMaster: (state, action) => {
			state.master = action.payload;
		},
	},
});

export const { setMaster } = masterSlice.actions;

export default masterSlice.reducer;
