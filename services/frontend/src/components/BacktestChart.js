import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

import { Config } from "services";
import { UDFCompatibleDatafeed } from "services/datafeed";

import { widget } from "../charting_library";

let tvWidget = null;

export default function BacktestChart({ id, symbol, interval, from, to }) {
	const ref = useRef();
	const { jwt: selectedJWT } = useSelector((state) => state.jwt);

	const [ready, setReady] = useState();

	useEffect(() => {
		const widgetOptions = {
			symbol,
			// BEWARE: no trailing slash is expected in feed URL
			datafeed: new UDFCompatibleDatafeed(`${Config.apiRoot()}/backtest/chart/${id}`, {
				Authorization: `Bearer ${selectedJWT.accessToken}`,
			}),
			interval,
			container: ref.current,
			library_path: "../charting_library/",
			locale: "en",
			disabled_features: ["use_localstorage_for_settings"],
			enabled_features: ["study_templates"],
			charts_storage_url: "https://saveload.tradingview.com",
			charts_storage_api_version: "1.1",
			client_id: "tradingview.com",
			user_id: "public_user_id",
			fullscreen: false,
			autosize: true,
			studies_overrides: {},
			timezone: Intl.DateTimeFormat().resolvedOptions()?.timeZone,
			// timeframe: JSON.stringify({ from, to }),
		};

		tvWidget = new widget(widgetOptions);

		tvWidget.onChartReady(() => {
			setReady(true);
		});

		return () => {
			if (tvWidget !== null) {
				tvWidget.remove();
				tvWidget = null;
			}
		};
	}, []);

	return (
		<div
			style={{ width: "100%", height: "80vh", borderRadius: "8px" }}
			ref={ref}
			className={"backtest-chart-container"}
		/>
	);
}
