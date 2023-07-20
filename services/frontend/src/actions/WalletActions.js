import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	wallet: null,
};

const walletSlice = createSlice({
	name: "wallet",
	initialState,
	reducers: {
		setWallet: (state, action) => {
			state.wallet = action.payload;
		},
	},
});

export const { setWallet } = walletSlice.actions;

export default walletSlice.reducer;
