import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { CircularProgress, FormControl, FormControlLabel, Grid, Radio, RadioGroup, Typography } from "@mui/material";

import { omit } from "lodash";

import { Positions } from "components";
import { prepareRateMessage } from "components/Positions/utils";

import { usePositionApi } from "api/position";
import useCatchError from "api/useCatchError";

import ClientFeeder from "services/ClientFeeder";

import { MarketStrategyContext } from "./Strategy";

const PAGE_COUNT = 5;

export default function PositionHistory() {
	const { t } = useTranslation("marketplace");

	const { marketStrategy } = useContext(MarketStrategyContext);

	const [processing, setProcessing] = useState(true);
	const [filter, setFilter] = useState({
		where: {
			status: "OPEN",
			pageNumber: 0,
			pageSize: PAGE_COUNT,
			strategyPositions: true,
			strategyIds: `${marketStrategy.strategy.id}`,
		},
	});
	const [positions, setPositions] = useState();
	const [count, setCount] = useState();

	const { getPositions, getPositionsCount } = usePositionApi();
	const catchError = useCatchError();

	const refresh = () => {
		setProcessing(true);

		Promise.all([
			getPositions(filter).then((data) => {
				setPositions(data);
			}),
			getPositionsCount({ ...filter, where: omit(filter.where, ["pageSize", "pageNumber"]) }).then((data) => {
				setCount(data);
			}),
		])
			.then(() => {
				setProcessing(false);
			})
			.catch((e) => {
				catchError(e);
			});
	};

	const handlePageChange = (_, newPage) => {
		setFilter({
			...filter,
			where: {
				...filter?.where,
				pageNumber: newPage,
			},
		});
	};
	const handleTabChange = (e) => {
		setFilter({
			...filter,
			where: {
				...filter?.where,
				pageNumber: 0,
				status: e.target.value,
			},
		});
	};

	useEffect(() => {
		if (filter) {
			refresh();
		}
	}, [filter]);

	return (
		<>
			{processing ? (
				<CircularProgress />
			) : (
				<Grid container>
					<Grid item xs={12}>
						<Grid container direction={"row"} justifyContent="center">
							<FormControl>
								<RadioGroup row value={filter?.status} onChange={handleTabChange}>
									{["OPEN", "CLOSED"].map((item, ix) => (
										<FormControlLabel
											key={ix}
											sx={{
												fontSize: "14px",
												fontWeight: 700,
												color: (theme) =>
													item === filter?.where?.status
														? theme.palette.primary.main
														: theme.palette.info.dark,
											}}
											value={item}
											control={<Radio checked={filter?.where?.status === item} />}
											label={
												item === "OPEN"
													? t("marketplace_strategy_page_position_ongoing_tab")
													: t("marketplace_strategy_page_position_completed_tab")
											}
										/>
									))}
								</RadioGroup>
							</FormControl>
						</Grid>
					</Grid>
					<Grid item xs={12}>
						{!positions?.length ? (
							<Typography sx={{ textAlign: "center" }}>
								{t("marketplace_strategy_page_position_no_ongoing_strategy_text_1")}
								{filter?.status === "OPEN"
									? t("marketplace_strategy_page_position_no_ongoing_strategy_text_2")
									: t("marketplace_strategy_page_position_no_ongoing_strategy_text_3")}
								{t("marketplace_strategy_page_position_no_ongoing_strategy_text_4")}
							</Typography>
						) : (
							<>
								<Positions
									positions={positions}
									hideLookup={{ side: true, exchange: true, expertStrategy: true }}
									filter={filter}
									count={count}
									onPageChange={handlePageChange}
								/>
								<ClientFeeder data={JSON.stringify(prepareRateMessage(positions))} />
							</>
						)}
					</Grid>
				</Grid>
			)}
		</>
	);
}
