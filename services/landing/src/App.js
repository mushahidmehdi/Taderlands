import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";

import { Footer } from "components/Footer";
import Header from "components/Header";
import { HowItWork, Invest, LogosSlider, Main, MarketPlace, StrategyTools } from "components/pages";

import { Container } from "styles/shared";

import { CookiePolicy } from "./components/cookies";

export default function App() {
	const [userType, setUserType] = useState(0);

	return (
		<>
			<Helmet>
				<title>Traderlands </title>
				<meta
					charSet="utf-8"
					name="description"
					content="Home Page of Traderlands. Traderlands allow to turn their trading strategies into automated bots, backtesting and sharing their strategies on the marketplace."
				/>
				<link rel="icon" href="/favicon.ico" />
			</Helmet>
			<Header />
			<Main />
			<LogosSlider />
			<Container>
				<Invest setUserType={setUserType} userType={userType} />
				<HowItWork />
				<StrategyTools userType={userType} />
				<MarketPlace userType={userType} />
			</Container>
			<Footer userType={userType} />
			<CookiePolicy />
		</>
	);
}
