import { useTranslation } from "react-i18next";

import { Circle } from "@mui/icons-material";
import { Grid, Typography } from "@mui/material";
import { useTheme } from "@mui/system";

import dayjs from "dayjs";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import shortenNumber from "utils/shortenNumber";

const CustomizedAxisTick = ({ x, y, payload }) => {
	return (
		<g transform={`translate(${x},${y})`}>
			<text x={18} y={2} dy={18} textAnchor="end" fill="#666" style={{ fontSize: "0.85rem" }}>
				{dayjs(payload.value).format("MMM D")}
			</text>
		</g>
	);
};

export default function Results({ results }) {
	const { t } = useTranslation("marketplace");
	const theme = useTheme();

	const yAxisWidth = Math.max(Math.max(...results.map((x) => x.value.toString().length)) * 10, 60);

	const chartInfo = [
		{
			name: "Strategy Performance",
			stroke: theme.palette.primary.main,
			dataKey: "value",
		},
		{
			name: "BTC Change",
			stroke: theme.palette.warning.main,
			dataKey: "btc",
		},
		{
			name: "Total Cap Change",
			stroke: theme.palette.secondary.main,
			dataKey: "tot",
		},
	];

	const renderLegend = (props) => {
		const { payload } = props;

		const colors = {
			"Strategy Performance": "primary",
			"BTC Change": "warning",
			"Total Cap Change": "secondary",
		};

		return (
			<Grid container sx={{ mt: 2 }} spacing={2} direction="row" alignItems="center" justifyContent="center">
				{payload.map((entry, index) => (
					<Grid item key={`item-${index}`}>
						<Grid container spacing={0.4}>
							<Grid item>
								<Circle color={colors[entry.value]} sx={{ width: 10 }} />
							</Grid>
							<Grid item>
								<Typography sx={{ fontSize: "10px", color: "#000", mt: 0.7 }}>{entry.value}</Typography>
							</Grid>
						</Grid>
					</Grid>
				))}
			</Grid>
		);
	};

	return (
		<div
			style={{
				marginTop: "3rem",
				position: "relative",
				height: 400,
			}}
		>
			<div
				style={{
					position: "absolute",
					top: "0",
					left: "0",
					width: "100%",
					height: "100%",
				}}
			>
				<ResponsiveContainer width="100%" height="100%">
					<LineChart
						data={results}
						margin={{
							top: 5,
							right: 20,
							bottom: 40,
						}}
					>
						<CartesianGrid strokeDasharray="3" vertical={false} stroke="#E3EAEF" />

						<XAxis dataKey="date" tick={<CustomizedAxisTick />} />
						<YAxis
							type="number"
							domain={["dataMin", "auto"]}
							width={yAxisWidth}
							tickFormatter={(value) => shortenNumber(value)}
							allowDecimals={true}
							tickLine={{ stroke: "none" }}
						/>
						<Tooltip />

						{chartInfo.map((item, ix) => (
							<Line
								key={ix}
								name={item.name}
								type="monotone"
								dataKey={item.dataKey}
								stroke={item.stroke}
								strokeWidth={4}
								dot={false}
							/>
						))}

						<Legend content={renderLegend} />
					</LineChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
}
