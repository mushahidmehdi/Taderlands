import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	connections: null,
	profile: null,
};

const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		setConnections: (state, action) => {
			state.connections = action.payload;
		},
		setProfile: (state, action) => {
			state.profile = action.payload;
		},
	},
});

export const { setConnections, setProfile } = userSlice.actions;

export default userSlice.reducer;
