import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	platforms: null,
};

const platformSlice = createSlice({
	name: "platform",
	initialState,
	reducers: {
		setPlatforms: (state, action) => {
			state.platforms = action.payload;
		},
	},
});

export const { setPlatforms } = platformSlice.actions;

export default platformSlice.reducer;
