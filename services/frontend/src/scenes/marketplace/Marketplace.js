import { useEffect, useState } from "react";

import { Button } from "@mui/material";
import { Box } from "@mui/system";

import { omit } from "lodash";

import { RouteLayout } from "components";

import { useMarketplaceApi } from "api/marketplace";
import useCatchError from "api/useCatchError";

import useQuery from "utils/useQuery";

import { Sync } from "images";

import Carousel from "./carousel/BannerCarousel";
import { defaultFiltering } from "./config";
import { Filters } from "./filtering";
import Table from "./table";

export default function Marketplace() {
	const [tab, setTab] = useState("STRATEGY");
	const [filter, setFilter] = useState();
	const [pageNumber, setPageNumber] = useState(0);
	const [loadMoreDisabled, setLoadMoreDisabled] = useState(false);
	const [marketPlaceData, setMarketPlaceData] = useState({});
	const [isLoading, setLoading] = useState({});

	const query = useQuery();
	const catchError = useCatchError();

	const { INITIAL_PAGE_NUMBER, FUNNEL_ID, INITIAL_PAGE_SIZE } = defaultFiltering;

	const { searchMerchants, getFunnels, getMarketStrategies, getMarketStrategiesCount } = useMarketplaceApi();

	const { strategies, funnels, merchants, totalNumberOfStrategies } = marketPlaceData ?? {};

	const { processingFunnels, processingMerchants, processingStrategies } = isLoading ?? {};

	useEffect(() => {
		const platformId = parseInt(query.get("platformId"));
		const timeRange = query.get("timeRange");
		const funnelId = query.get("funnelId");
		const search = query.get("search");

		const positionCount = query.get("positionCount");
		const successRate = query.get("successRate");
		const averageProfit = query.get("averageProfit");
		const profitPercent = query.get("profitPercent");
		const followerCount = query.get("followerCount");

		setFilter({
			where: {
				funnelId: funnelId ? parseInt(funnelId) : FUNNEL_ID,
				...(platformId ? { platformId } : {}),
				...(timeRange ? { timeRange } : { timeRange: "1M" }),
				...(search ? { search } : {}),
			},
			orderBy: {
				...(!successRate && !averageProfit && !followerCount && !profitPercent
					? { profitPercent: "desc" }
					: {}),
				...(positionCount ? { positionCount } : {}),
				...(successRate ? { successRate } : {}),
				...(averageProfit ? { averageProfit } : {}),
				...(followerCount ? { followerCount } : {}),
				...(profitPercent ? { profitPercent } : {}),
			},
		});

		setPageNumber(0);
		setLoadMoreDisabled(false);
	}, [query, FUNNEL_ID, INITIAL_PAGE_NUMBER, INITIAL_PAGE_SIZE]);

	useEffect(() => {
		if (filter) {
			setLoading((prev) => ({
				...prev,
				processingStrategies: true,
			}));

			Promise.all([
				getMarketStrategies({
					...filter,
					where: { ...filter?.where, pageNumber: INITIAL_PAGE_NUMBER, pageSize: INITIAL_PAGE_SIZE },
				}).then((data) =>
					setMarketPlaceData((prev) => ({
						...prev,
						strategies: data,
					}))
				),
				getMarketStrategiesCount(omit(filter, "orderBy")).then((data) =>
					setMarketPlaceData((prev) => ({
						...prev,
						totalNumberOfStrategies: data,
					}))
				),
			])
				.catch(catchError)
				.finally(() =>
					setLoading((prev) => ({
						...prev,
						processingStrategies: false,
					}))
				);
		}
	}, [filter]);

	useEffect(() => {
		if (tab === "EXPERT") {
			setLoading((prev) => ({
				...prev,
				processingMerchants: true,
			}));

			searchMerchants(query.get("merchant"))
				.then((data) =>
					setMarketPlaceData((prev) => ({
						...prev,
						merchants: data.data?.merchants,
					}))
				)
				.catch(catchError)
				.finally(() =>
					setLoading((prev) => ({
						...prev,
						processingMerchants: false,
					}))
				);
		}
	}, [tab, query.get("merchant")]);

	useEffect(() => {
		setLoading((prev) => ({
			...prev,
			processingFunnels: true,
		}));
		getFunnels()
			.then((data) =>
				setMarketPlaceData((prev) => ({
					...prev,
					funnels: data?.data.funnels,
				}))
			)
			.finally(() =>
				setLoading((prev) => ({
					...prev,
					processingFunnels: false,
				}))
			);
	}, []);

	const handleLoadMore = () => {
		getMarketStrategies({
			...filter,
			where: { ...filter?.where, pageNumber: pageNumber + 1, pageSize: INITIAL_PAGE_SIZE },
		}).then((data) => {
			if (!data?.length) {
				setLoadMoreDisabled(true);
				return;
			}

			setMarketPlaceData({
				...marketPlaceData,
				strategies: [...(strategies ?? []), ...data],
			});
			setPageNumber(pageNumber + 1);
		});
	};

	return (
		<RouteLayout>
			<Box sx={{ marginInlineEnd: "4rem", width: "97%" }}>
				<Box
					sx={{
						display: "flex",
						width: "100%",
						marginBlockEnd: "2rem",
					}}
				>
					<Carousel processingFunnels={processingFunnels} filter={filter} funnels={funnels} />
				</Box>

				<Box>{<Filters tab={tab} setTab={setTab} filter={filter} />}</Box>

				<Box>
					<Table
						tab={tab}
						merchants={merchants}
						strategies={strategies}
						marketPlaceData={marketPlaceData}
						processingMerchants={processingMerchants}
						processingStrategies={processingStrategies}
						timeRange={filter?.where?.timeRange}
					/>
				</Box>

				<Box
					display="flex"
					justifyContent="center"
					sx={{
						paddingBlockStart: "4rem",
						paddingBlockEnd: "1.5rem",
					}}
				>
					<Button
						variant="outlined"
						onClick={() => handleLoadMore()}
						disabled={processingStrategies || loadMoreDisabled}
						sx={{
							paddingInline: "5rem",
						}}
						startIcon={
							<Sync {...(processingStrategies || loadMoreDisabled ? { style: { opacity: 0.3 } } : {})} />
						}
					>
						{processingStrategies ? "Loading..." : "Load More"}
					</Button>
				</Box>
			</Box>
		</RouteLayout>
	);
}
