import React from "react";
import { Provider } from "react-redux";

import { configureStore } from "@reduxjs/toolkit";

import jwtReducer from "actions/jwtActions";

export default function setupTestStore(preloadedState) {
	const refObj = {};

	beforeEach(() => {
		const store = configureStore({ reducer: { jwt: jwtReducer }, preloadedState });
		refObj.store = store;
		refObj.Wrapper = function Wrapper({ children }) {
			return <Provider store={store}>{children}</Provider>;
		};
	});

	return refObj;
}
