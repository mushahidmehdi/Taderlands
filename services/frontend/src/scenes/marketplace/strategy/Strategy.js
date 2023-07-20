import { createContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { Grid } from "@mui/material";

import dayjs from "dayjs";
import minMax from "dayjs/plugin/minMax";

import { Breadcrumbs, PageCenteredProgress, RouteLayout } from "components";

import { useDashboardApi } from "api/dashboard";
import { useMarketplaceApi } from "api/marketplace";
import { usePlatformApi } from "api/platform";
import { useStrategyApi } from "api/strategy";
import useCatchError from "api/useCatchError";
import { useUserApi } from "api/user";

import { setParities } from "actions/ParityActions";
import { setProfile } from "actions/UserActions";

import Header from "./Header";
import Info from "./Info";
import { Performance } from "./performance";

dayjs.extend(minMax);

export const MarketStrategyContext = createContext();

export default function Strategy() {
	const [marketStrategy, setMarketStrategy] = useState();
	const [marketStrategyMetrics, setMarketStrategyMetrics] = useState();
	const [generalMarketMetrics, setGeneralMarketMetrics] = useState();
	const [followedStrategy, setFollowedStrategy] = useState();
	const [portfolio, setPortfolio] = useState();
	const [filter, setFilter] = useState();
	const [processing, setProcessing] = useState(true);
	const { profile } = useSelector((state) => state.user);

	const { getMarketStrategy, getMarketStrategyMetrics, getGeneralMarketMetrics } = useMarketplaceApi();
	const { getFollowedStrategies } = useStrategyApi();
	const { getParities } = usePlatformApi();
	const { getProfile } = useUserApi();
	const { getPortfolio } = useDashboardApi();

	const { id } = useParams();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const catchError = useCatchError();
	const { t } = useTranslation("marketplace");

	useEffect(() => {
		Promise.all([
			getParities().then((data) => dispatch(setParities(data))),
			getMarketStrategy(id).then((data) => {
				setMarketStrategy(data);

				setFilter({
					quote: data.strategy.parities.quotes[0],
					timeRange: "3M",
					marketStrategyId: data.id,
				});
			}),
			getProfile().then((data) => dispatch(setProfile(data?.data?.profile))),
			getPortfolio().then((data) => setPortfolio(data)),
		])
			.catch(catchError)
			.finally(() => {
				setProcessing(false);
			});
	}, []);

	useEffect(() => {
		getMarketStrategyMetrics(filter).then((data) => {
			const { marketStrategyMetric } = data?.data;

			setMarketStrategyMetrics(data?.data?.marketStrategyMetric);

			const { backtestResults, livetestResults } = data?.data?.marketStrategyMetric;

			const startDate = dayjs
				.min([
					...(backtestResults?.results?.length ? [dayjs(backtestResults?.results?.[0].date)] : []),
					...(livetestResults?.results?.length ? [dayjs(livetestResults?.results?.[0].date)] : []),
				])
				.format("YYYY-MM-DD");

			const endDate = dayjs
				.max([
					...(backtestResults?.results?.length
						? [dayjs(backtestResults?.results?.[backtestResults?.results?.length - 1].date)]
						: []),
					...(livetestResults?.results?.length
						? [dayjs(livetestResults?.results?.[livetestResults?.results?.length - 1].date)]
						: []),
				])
				.format("YYYY-MM-DD");

			Promise.all([
				getGeneralMarketMetrics({ title: "TOT", startDate, endDate }),
				getGeneralMarketMetrics({ title: "BTC", startDate, endDate }),
			]).then((values) => {
				const tot = values[0].data.series;
				const btc = values[1].data.series;

				setGeneralMarketMetrics({ tot, btc });

				setMarketStrategyMetrics({
					...marketStrategyMetric,
					backtestResults: {
						...marketStrategyMetric?.backtestResults,
						results: marketStrategyMetric?.backtestResults?.results?.map(({ date, value }) => ({
							date,
							value,
							tot: tot[date],
							btc: btc[date],
						})),
					},
					livetestResults: {
						...marketStrategyMetric?.livetestResults,
						results: marketStrategyMetric?.livetestResults?.results?.map(({ date, value }) => ({
							date,
							value,
							tot: tot[date],
							btc: btc[date],
						})),
					},
				});
			});
		});
	}, [filter]);

	useEffect(() => {
		if (profile?.strategyFollowers?.find((item) => item.strategy?.id == marketStrategy?.strategyId)) {
			getFollowedStrategies(marketStrategy?.strategyId).then((data) => {
				setFollowedStrategy(data[0]);
			});
		}
	}, [marketStrategy, profile]);

	const location = useLocation();

	const data = location.state;

	return (
		<RouteLayout
			headerComp={
				<Breadcrumbs
					paths={[
						{
							text: t("marketplace_main_title"),
							onClick: () => navigate("/marketplace"),
						},
						{
							text: t("marketplace_strategy_page_title"),
						},
					]}
				/>
			}
		>
			<MarketStrategyContext.Provider
				value={{
					marketStrategy,
					setMarketStrategy,
					marketStrategyMetrics,
					generalMarketMetrics,
					filter,
					setFilter,
					followedStrategy,
					setFollowedStrategy,
					portfolio,
				}}
			>
				{processing ? (
					<PageCenteredProgress />
				) : (
					<Grid container spacing={2} sx={{ pt: 2 }}>
						<Grid item md={4} xs={12}>
							<Grid container>
								<Grid item xs={12}>
									<Header />
								</Grid>
								<Grid item xs={12}>
									<Info />
								</Grid>
							</Grid>
						</Grid>
						<Grid item md={8} xs={12}>
							<Performance />
						</Grid>
					</Grid>
				)}
			</MarketStrategyContext.Provider>
		</RouteLayout>
	);
}
