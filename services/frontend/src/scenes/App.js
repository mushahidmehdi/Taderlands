import { Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { CircularProgress } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import "@fontsource/raleway/200.css";
import "@fontsource/raleway/300.css";
import "@fontsource/raleway/400.css";
import "@fontsource/raleway/500.css";
import "@fontsource/raleway/600.css";
import "@fontsource/raleway/700.css";
import "dayjs/locale/en";
import "dayjs/locale/tr";

import reducer from "actions";

import { configureRedux, default as ReduxProvider } from "utils/Redux";

import PrivateRoute from "../components/PrivateRoute";
import { AuthProvider, LanguageProvider, SnackbarProvider } from "../services";
import Main from "./Main";
import {
	AccountCenter,
	AddExchangeLinkInfo,
	AddExchangeLinkInput,
	C2faInfo,
	ExchangeLink,
	KYCInfo,
	Security,
	Settings,
} from "./account";
import { Dashboard } from "./dashboard";
import { ExpertPanel } from "./expertPanel";
import { ExpertApplication } from "./expertPanel/application";
import { Marketplace, Merchant, Strategy as MarketplaceStrategy } from "./marketplace";
import Notification from "./notification";
import { NotificationSettings, TelegramInfo } from "./notification/settings";
import { ChooseAddress, CryptoDeposit, TransactionDetails, Wallet, Withdraw } from "./payment";
import { PositionsCenter } from "./positionsCenter";
import { QuestBox } from "./questBox";
import { QuestBoxDetailView } from "./questBox/detailView";
import { FullList } from "./questBox/leaderboard/FullList";
import { CreateReference, CreateReferenceInfo, ReferenceList } from "./referenceCenter";
import {
	Agreements,
	ForgotPassword,
	Login,
	LoginVerification,
	Register,
	RegisterSuccess,
	RegisterVerification,
} from "./register";
import MobilLoginRedirect from "./register/MobilLoginRedirect";
import { Strategies } from "./strategies";
import { StrategyBuilder, Workshop } from "./strategyBuilder";

const COLOR_PRIMARY = "#0F20E8";
const COLOR_SECONDARY = "#6A1FC2";
const COLOR_LIGHTGRAY = "#F1F1F5";
const COLOR_LIGHTBG = "#F4F5FC";
const COLOR_LIGHTBLUE = "#CFD2FA";
const COLOR_WHITE = "#FFFFFF";
const COLOR_DARK = "#3A3A3A";
const COLOR_GRAY = "#AEAEAE";
const COLOR_SUCCESS = "#36B37E";
const COLOR_DANGER = "#DE350B";
const COLOR_DARKGRAY = "#DDDDDD";

const theme = createTheme({
	status: {
		success: COLOR_SUCCESS,
		danger: COLOR_DANGER,
	},
	palette: {
		primary: {
			main: COLOR_PRIMARY,
			light: COLOR_LIGHTBLUE,
		},
		secondary: {
			main: COLOR_SECONDARY,
		},
		info: {
			main: COLOR_LIGHTGRAY,
			dark: COLOR_GRAY,
			light: COLOR_LIGHTBG,
		},
		success: {
			main: COLOR_SUCCESS,
		},
		danger: {
			main: COLOR_DANGER,
		},
		warning: {
			main: "#FFAB00",
			light: "#FFEECC",
		},
		text: {
			primary: "#444444",
			dark: COLOR_DARK,
		},
		background: {
			default: "#FAFAFE",
		},
	},
	typography: {
		fontFamily: "Comfortaa",
	},
	components: {
		MuiButton: {
			styleOverrides: {
				root: {
					borderRadius: 8,
					textTransform: "none",
				},
			},
		},
		MuiPaper: {
			styleOverrides: {
				root: {
					borderRadius: 8,
					boxShadow: "none",
				},
			},
		},
		MuiSlider: {
			styleOverrides: {
				thumb: {
					boxShadow: "none",
					width: 0,
					height: 0,
				},
			},
		},
		MuiTableCell: {
			styleOverrides: {
				root: {
					"&:first-of-type": {
						border: "1px 0 1px 1px solid",
						borderRadius: "10px 0 0 10px",
					},
					"&:last-child": {
						border: "1px 1px 1px 0 solid",
						borderRadius: "0 10px 10px 0",
					},
				},
			},
		},
	},
});

const { persistor, store } = configureRedux(reducer, {
	key: "paratica:paratica-web",
	whitelist: [
		"jwt",
		"price",
		"parity",
		"master",
		"indicator",
		"platform",
		"strategyBuilder",
		"user",
		"strategy",
		"backtest",
		"wallet",
	],
});

export default function App() {
	return (
		<ReduxProvider persistor={persistor} store={store}>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<LanguageProvider languages={["en", "tr"]}>
					<SnackbarProvider>
						<AuthProvider>
							<Suspense fallback={<CircularProgress />}>
								<Router>
									<Routes>
										<Route path="*" element={<PrivateRoute />}>
											<Route path="*" element={<Main />}>
												<Route path="create-reference-info" element={<CreateReferenceInfo />} />
												<Route path="marketplace" element={<Marketplace />} />

												<Route path="notification" element={<Notification />} />

												<Route path="quest-box" element={<QuestBox />} />

												<Route path="quest-box/:id/details" element={<QuestBoxDetailView />} />

												<Route path="quest-box/:id/full-list" element={<FullList />} />

												<Route
													path="notification-settings"
													element={<NotificationSettings />}
												/>
												<Route
													path="notification-settings/telegram-info"
													element={<TelegramInfo />}
												/>

												<Route
													path="marketplace/strategy/:id"
													element={<MarketplaceStrategy />}
												/>
												<Route path="marketplace/merchant/:id" element={<Merchant />} />
												<Route path="create-reference" element={<CreateReference />} />
												<Route path="reference-list" element={<ReferenceList />} />
												<Route path="dashboard" element={<Dashboard />} />
												<Route path="account-center" element={<AccountCenter />} />
												<Route path="strategy-builder/:id" element={<StrategyBuilder />} />
												<Route path="strategy-builder" element={<StrategyBuilder />} />
												<Route path="workshop" element={<Workshop />} />
												<Route path="strategies" element={<Strategies />} />
												<Route path="positions-center" element={<PositionsCenter />} />
												<Route path="expert-panel/:id" element={<ExpertPanel />} />

												<Route
													path="workshop/expert-application"
													element={<ExpertApplication />}
												/>

												<Route path="security" element={<Security />} />
												<Route path="settings" element={<Settings />} />
												<Route path="security/c2fa-info" element={<C2faInfo />} />
												<Route path="security/kyc-info" element={<KYCInfo />} />
												<Route path="payment" element={<Wallet />} />
												<Route
													path="payment/transaction-details"
													element={<TransactionDetails />}
												/>
												<Route path="payment/choose-address" element={<ChooseAddress />} />
												<Route path="payment/crypto-deposit" element={<CryptoDeposit />} />
												<Route path="payment/withdraw" element={<Withdraw />} />
												<Route path="exchange-link" element={<ExchangeLink />} />
												<Route
													path="exchange-link/add-info"
													element={<AddExchangeLinkInfo />}
												/>
												<Route
													path="exchange-link/add-input"
													element={<AddExchangeLinkInput />}
												/>
												<Route path="" element={<Dashboard />} />
											</Route>
										</Route>
										<Route path="login" element={<Login />} />

										<Route path="mobile-redirect" element={<MobilLoginRedirect />} />
										<Route path="login-verification" element={<LoginVerification />} />
										<Route path="register" element={<Register />} />
										<Route path="register-verification" element={<RegisterVerification />} />
										<Route path="register-success" element={<RegisterSuccess />} />
										<Route path="forgot-password" element={<ForgotPassword />} />
										<Route path="agreements" element={<Agreements />} />
									</Routes>
								</Router>
							</Suspense>
						</AuthProvider>
					</SnackbarProvider>
				</LanguageProvider>
			</ThemeProvider>
		</ReduxProvider>
	);
}
