import { Typography } from "@mui/material";
import { Box } from "@mui/system";

import dayjs from "dayjs";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const CustomizedAxisTick = ({ x, y, payload }) => {
	return (
		<g transform={`translate(${x},${y})`}>
			<text x={18} y={2} dy={18} textAnchor="end" fill="#666" style={{ fontSize: "0.85rem" }}>
				{dayjs(payload.value).format("MMM D")}
			</text>
		</g>
	);
};

const YieldCurve = ({ backtest }) => {
	const handleStrokeColor = () => {
		const len = backtest?.summary?.results?.length;
		if (!len) {
			return;
		}
		if (backtest?.summary?.results?.[len - 1].value < 0) {
			return "red";
		}
		return "#36B37E";
	};
	if (backtest?.summary?.results) {
		return (
			<ResponsiveContainer width="100%" height={400}>
				<AreaChart data={backtest?.summary?.results}>
					<Area
						dataKey="value"
						fillOpacity={0.05}
						baseValue="dataMin"
						isBelow={true}
						type="monotone"
						stroke={handleStrokeColor()}
						fill={handleStrokeColor()}
					/>
					<CartesianGrid opacity={0.1} vertical={false} />
					<Tooltip />
					<YAxis />

					<XAxis dataKey="date" tick={<CustomizedAxisTick />} />
				</AreaChart>
			</ResponsiveContainer>
		);
	}

	return (
		<Box height={120} width="100%" display="flex" justifyContent="center" alignItems="center">
			<Typography fontWeight={700} color="red">
				No Data Available
			</Typography>
		</Box>
	);
};

export default YieldCurve;
