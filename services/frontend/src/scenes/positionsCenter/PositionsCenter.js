import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { omit } from "lodash";
import { useSnackbar } from "notistack";

import { PageCenteredProgress, Positions, RouteLayout } from "components";
import { prepareRateMessage } from "components/Positions/utils";

import { usePlatformApi } from "api/platform";
import { usePositionApi } from "api/position";
import useCatchError from "api/useCatchError";

import { setParities } from "actions/ParityActions";

import ClientFeeder from "services/ClientFeeder";

import queryBuilder from "utils/queryBuilder";
import useQuery from "utils/useQuery";

import { Filter } from "./filter";

const INITIAL_PAGE_COUNT = 10;

export default function ControlPanel() {
	const [processing, setProcessing] = useState();
	const [positions, setPositions] = useState();
	const [count, setCount] = useState();
	const [filter, setFilter] = useState();
	const [filterData, setFilterData] = useState();

	const query = useQuery();
	const { enqueueSnackbar } = useSnackbar();
	const navigate = useNavigate();
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const { getParities } = usePlatformApi();
	const { getPositions, getPositionsCount, getPositionsFilterData } = usePositionApi();
	const catchError = useCatchError();

	const handleOrderChange = (orderBy) => {
		navigate(
			`/positions-center?${queryBuilder({
				...filter?.where,
				...orderBy,
			})}`
		);
	};

	const handlePageChange = (_, newPage) => {
		navigate(
			`/positions-center?${queryBuilder({
				...filter?.where,
				...(filter?.orderBy
					? {
							orderBy: Object.keys(filter?.orderBy)[0],
							orderDirection: Object.values(filter?.orderBy)[0],
					  }
					: {}),
				pageNumber: newPage,
			})}`
		);
	};

	const handleRowsPerPageChange = (event) => {
		navigate(
			`/positions-center?${queryBuilder({
				...filter?.where,
				...(filter?.orderBy
					? {
							orderBy: Object.keys(filter?.orderBy)[0],
							orderDirection: Object.values(filter?.orderBy)[0],
					  }
					: {}),
				pageSize: parseInt(event.target.value, 10),
				pageNumber: 0,
			})}`
		);
	};

	const handleFiltersApply = (data) => {
		navigate(
			`/positions-center?${queryBuilder({
				...(filter?.orderBy
					? {
							orderBy: Object.keys(filter?.orderBy)[0],
							orderDirection: Object.values(filter?.orderBy)[0],
					  }
					: {}),
				pageNumber: 0,
				pageSize: filter?.pageSize,
				status: data.status,
				...(filter?.where?.status === data?.status
					? {
							...(data?.platforms ? { platformIds: data?.platforms.map((x) => x.id).join(",") } : {}),
							...(data?.strategies ? { strategyIds: data?.strategies.map((x) => x.id).join(",") } : {}),
							...(data?.parities?.length ? { symbols: data.parities.map((x) => x.name).join(",") } : {}),
							...(data?.includeVirtual ? { includeVirtual: data.includeVirtual } : {}),
							...(data?.quotes ? { quotes: data.quotes.join(",") } : {}),
					  }
					: {}),
			})}`
		);
	};

	useEffect(() => {
		Promise.all([
			getPositionsFilterData().then((data) => setFilterData(data?.data)),
			getParities().then((data) => dispatch(setParities(data))),
		]).catch((e) => {
			console.log(e);

			catchError(e);
		});
	}, []);

	useEffect(() => {
		const status = query.get("status");
		const pageNumber = query.get("pageNumber");
		const pageSize = query.get("pageSize");
		const platformIds = query.get("platformIds");
		const strategyIds = query.get("strategyIds");
		const quotes = query.get("quotes");
		const symbols = query.get("symbols");
		const includeVirtual = query.get("includeVirtual");
		const orderBy = query.get("orderBy");
		const orderDirection = query.get("orderDirection");

		setFilter({
			where: {
				status: status ?? "OPEN",
				pageNumber: pageNumber ? parseInt(pageNumber) : 0,
				pageSize: pageSize ? parseInt(pageSize) : INITIAL_PAGE_COUNT,
				...(platformIds ? { platformIds } : {}),
				...(strategyIds ? { strategyIds } : {}),
				...(quotes ? { quotes } : {}),
				...(symbols ? { symbols } : {}),
				...(includeVirtual ? { includeVirtual } : {}),
			},
			orderBy: {
				...(orderBy
					? { [orderBy]: orderDirection ? orderDirection : "desc" }
					: { ...(status === "open" ? { enterDate: "desc" } : { exitDate: "desc" }) }),
			},
		});
	}, [query]);

	useEffect(() => {
		if (filter) {
			setProcessing(true);

			Promise.all([
				getPositions(filter).then((data) => setPositions(data)),
				getPositionsCount(
					omit({ ...filter, where: omit(filter?.where, ["pageNumber", "pageSize"]) }, "orderBy")
				).then((data) => setCount(data)),
			])
				.catch(catchError)
				.finally(() => setProcessing(false));
		}
	}, [filter]);

	return (
		<RouteLayout header={t("Positions Center")}>
			{processing && <PageCenteredProgress />}
			{filterData && (
				<Filter
					data={omit(
						{
							...filter.where,
							...(filter?.where?.platformIds
								? {
										platforms: filterData?.platforms.filter((x) =>
											filter?.where?.platformIds
												?.split(",")
												.some((y) => parseInt(y) === parseInt(x.id))
										),
								  }
								: {}),
							...(filter?.where?.strategyIds
								? {
										strategies: filterData?.strategies.filter((x) =>
											filter?.where?.strategyIds
												?.split(",")
												.some((y) => parseInt(y) === parseInt(x.id))
										),
								  }
								: {}),
							...(filter?.where?.quotes && {
								quotes: filter?.where?.quotes.split(","),
							}),
							...(filter?.where?.symbols && {
								symbols: filter?.where?.symbols.split(","),
							}),
						},
						["platformIds", "strategyIds"]
					)}
					filterData={filterData}
					onApplyFilters={handleFiltersApply}
				/>
			)}

			<Positions
				positions={positions}
				count={count}
				filter={filter}
				onPageChange={handlePageChange}
				onRowsPerPageChange={handleRowsPerPageChange}
				onOrderChange={handleOrderChange}
			/>
			{positions?.length && !processing ? (
				<ClientFeeder data={JSON.stringify(prepareRateMessage(positions))} />
			) : (
				<></>
			)}
		</RouteLayout>
	);
}
