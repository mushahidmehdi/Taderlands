import { combineReducers } from "@reduxjs/toolkit";

import MasterReducer from "./MasterActions";

export default combineReducers({
	master: MasterReducer,
});
