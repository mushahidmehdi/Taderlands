import { combineReducers } from "@reduxjs/toolkit";

import BacktestReducer from "./BacktestActions";
import ConnectionReducer from "./ConnectionActions";
import ExampleReducer from "./ExampleActions";
import IndicatorSlice from "./IndicatorActions";
import jwtActions from "./jwtActions";
import MasterReducer from "./MasterActions";
import ParityReducer from "./ParityActions";
import PlatformReducer from "./PlatformActions";
import PriceReducer from "./PriceActions";
import StrategyReducer from "./StrategyActions";
import StrategyBuilderReducer from "./StrategyBuilderActions";
import UserReducer from "./UserActions";
import WalletReducer from "./WalletActions";

export default combineReducers({
	example: ExampleReducer,
	jwt: jwtActions,
	price: PriceReducer,
	parity: ParityReducer,
	platform: PlatformReducer,
	strategyBuilder: StrategyBuilderReducer,
	indicator: IndicatorSlice,
	user: UserReducer,
	strategy: StrategyReducer,
	backtest: BacktestReducer,
	connection: ConnectionReducer,
	master: MasterReducer,
	wallet: WalletReducer,
});
