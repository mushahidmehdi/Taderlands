import { Box } from "@mui/material";

import ExpertCard from "../Cards/Expert";
import StrategyCard from "../Cards/Strategy";
import { ExpertSkeleton, StrategySkeleton } from "../skeleton";

const Table = ({
	merchants,
	strategies,
	setExpertDetail,
	processingMerchants,
	processingStrategies,
	timeRange,
	tab,
}) => {
	return (
		<>
			<Box
				sx={{
					display: "flex",
					gap: "1rem",
					flexWrap: "wrap",
					justifyContent: "flex-start",
				}}
			>
				{tab === "EXPERT" && processingMerchants ? (
					<ExpertSkeleton />
				) : (
					tab === "EXPERT" &&
					merchants?.map((item) => (
						<div style={{ flex: 1 }} key={item.id} onClick={() => setExpertDetail(item)}>
							<ExpertCard data={item} />
						</div>
					))
				)}

				{tab === "STRATEGY" && processingStrategies ? (
					<StrategySkeleton />
				) : (
					tab === "STRATEGY" &&
					strategies?.map((item) => <StrategyCard key={item.id} data={item} timeRange={timeRange} />)
				)}
			</Box>
		</>
	);
};

export default Table;
