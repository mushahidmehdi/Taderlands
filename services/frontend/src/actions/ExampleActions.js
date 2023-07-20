import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	example: null,
};

const exampleSlice = createSlice({
	name: "example",
	initialState,
	reducers: {
		setExample: (state, action) => {
			state.example = action.payload;
		},
	},
});

export const { setExample } = exampleSlice.actions;

export default exampleSlice.reducer;
