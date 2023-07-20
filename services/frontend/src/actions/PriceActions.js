import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	price: null,
};

const priceSlice = createSlice({
	name: "price",
	initialState,
	reducers: {
		setPrice: (state, action) => {
			state.price = { ...state.price, ...action.payload };
		},
		reset: (state) => {
			state.price = null;
		},
	},
});

export const { setPrice, reset } = priceSlice.actions;

export default priceSlice.reducer;
