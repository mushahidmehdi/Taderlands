import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";

import { ThemeProvider } from "styled-components";

import reducer from "actions";

import SnackbarProvider from "services/SnackbarProvider";
import Config from "services/config";

import GlobalStyle from "styles/Global";
import theme from "styles/Theme";
import "styles/global.css";

import AppErrorBoundary from "utility/ErrorBoundary";
import { configureRedux, default as ReduxProvider } from "utility/Redux";

import App from "./App";
import "./i18n";

if (Config.environment() !== "production") {
	document.head.innerHTML = document.head.innerHTML + '<meta name="robots" content="noindex, nofollow">';
}

const root = ReactDOM.createRoot(document.getElementById("root"));

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
	],
});

root.render(
	<React.StrictMode>
		<ReduxProvider persistor={persistor} store={store}>
			<SnackbarProvider>
				<ThemeProvider theme={theme}>
					<GlobalStyle />
					<AppErrorBoundary>
						<Suspense fallback="loading">
							<App />
						</Suspense>
					</AppErrorBoundary>
				</ThemeProvider>
			</SnackbarProvider>
		</ReduxProvider>
	</React.StrictMode>
);
