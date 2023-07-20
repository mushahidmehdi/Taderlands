import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	connections: null,
};

const connectionSlice = createSlice({
	name: "connection",
	initialState,
	reducers: {
		setConnections: (state, action) => {
			state.connections = action.payload;
		},
	},
});

export const { setConnections } = connectionSlice.actions;

export default connectionSlice.reducer;
