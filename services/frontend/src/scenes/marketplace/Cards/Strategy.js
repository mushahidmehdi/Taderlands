import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { Box, Button, Card, Typography } from "@mui/material";

import { ExchangeType, TradingType } from "components";

import useQuery from "utils/useQuery";

import Chart from "../chart";

const Strategy = ({ data, timeRange }) => {
	const { profile } = useSelector((state) => state.user);
	const navigate = useNavigate();
	const query = useQuery();

	const metricsData = data?.marketStrategyMetrics?.[0]?.livetestResults?.metrics;

	return (
		<Card
			sx={{
				minWidth: "281.6px",
				maxWidth: "312.6px",
				borderRadius: "0.5rem",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "space-between",
				position: "relative",
				height: "auto",
				flex: 1,
				padding: 3,
				boxSizing: "border-box",
				border: "1px solid transparent",
				"&:hover": {
					borderColor: "#0F20E8",
					cursor: "pointer",
				},
			}}
			onClick={() => navigate(`/marketplace/strategy/${data?.id}`)}
		>
			<Box
				sx={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "space-between",
				}}
			>
				<Typography
					color="primary"
					gutterBottom
					sx={{
						fontWeight: 700,
						maxWidth: "18rem",
						textAlign: "center",
						textOverflow: "hidden",
						fontSize: "1.4rem",
						lineHeight: "1.4rem",
						marginBlockStart: "1rem",
					}}
				>
					{data.name}
				</Typography>

				<Typography
					sx={{
						fontSize: "14px",
						fontWeight: 700,
						color: "#3A3A3A",
						marginBlockStart: "0.5rem",
						marginBlockEnd: "1rem",
					}}
					onClick={(evt) => {
						evt.stopPropagation();
						navigate(`/marketplace/merchant/${data?.merchant?.id}`);
					}}
				>
					{data?.merchant?.nickname}
				</Typography>
			</Box>

			<Box display="flex" width="100%" justifyContent="center">
				<TradingType value={data?.strategy?.executionType} />
				<ExchangeType value={data?.strategy?.platform.exchange} />
			</Box>

			<Box display="flex" justifyContent="space-between" width="100%">
				<Box>
					<Typography
						fontSize="2rem"
						fontWeight={700}
						color={metricsData?.totalProfitPercent > 0 ? "#36B37E" : "red"}
					>
						{metricsData?.totalProfitPercent && metricsData?.totalProfitPercent + "%"}
					</Typography>
					{data?.marketStrategyMetrics?.[0]?.livetestResults?.results?.length && (
						<Typography color={"#3A3A3A"} fontSize={12} fontWeight={500}>
							ROI in last
							<Typography color="primary" display="inline" fontSize={12} fontWeight={500}>
								{" " + query.get("timeRange") === "1M"
									? " 30 "
									: query.get("timeRange") === "3M"
									? " 90 "
									: query.get("timeRange") === "6M"
									? " 180 "
									: query.get("timeRange") === "1Y"
									? " 360 "
									: " 30 "}
							</Typography>
							days
						</Typography>
					)}
					<Box marginTop="1rem" width={"120%"}>
						<Box display="flex">
							<Typography fontWeight={500} fontSize={12} color="#3A3A3A">
								Avg. Profit:
							</Typography>
							<Typography fontWeight={700} fontSize={12} color="primary" marginLeft={1}>
								{metricsData?.averageProfitPercent && metricsData?.averageProfitPercent + "%"}
							</Typography>
						</Box>
						<Box display="flex">
							<Typography fontWeight={500} fontSize={12} color="#3A3A3A">
								Success Rate:
							</Typography>
							<Typography fontWeight={700} fontSize={12} color="primary" marginLeft={1}>
								{metricsData?.successRate && (metricsData?.successRate).toFixed(2) + "%"}
							</Typography>
						</Box>
						<Box display="flex">
							<Typography fontWeight={500} fontSize={12} color="#3A3A3A">
								Total Pos. Count:
							</Typography>
							<Typography fontWeight={700} fontSize={12} color="primary" marginLeft={1}>
								{metricsData?.totalTradeCount ? metricsData?.totalTradeCount : ""}
							</Typography>
						</Box>
						<Box display="flex">
							<Typography fontWeight={500} fontSize={12} color="#3A3A3A">
								User:
							</Typography>
							<Typography fontWeight={700} fontSize={12} color="#FFAB00" marginLeft={1}>
								{data?.followerCount} / {data?.maxFollowerCount}
							</Typography>
						</Box>
					</Box>
				</Box>

				<Box
					sx={{
						width: "50%",
					}}
				>
					<Chart data={data?.marketStrategyMetrics?.[0]?.livetestResults?.results} id={data?.id} />
				</Box>
			</Box>
			<Button
				variant={
					!profile.strategyFollowers?.find((item) => item.strategy?.id === data.strategy?.id) && "contained"
				}
				onClick={() => navigate(`/marketplace/strategy/${data?.id}`, { state: true })}
				sx={{
					width: "100%",
					marginTop: "1rem",
					border:
						profile.strategyFollowers?.find((item) => item.strategy?.id === data.strategy?.id) &&
						"1px solid #36B37E",

					color:
						profile.strategyFollowers?.find((item) => item.strategy?.id === data.strategy?.id) && "#36B37E",
				}}
			>
				{!profile.strategyFollowers?.find((item) => item.strategy?.id === data.strategy?.id) &&
				data?.followerCount < data?.maxFollowerCount
					? "Start"
					: "Settings"}
			</Button>
		</Card>
	);
};

export default Strategy;
