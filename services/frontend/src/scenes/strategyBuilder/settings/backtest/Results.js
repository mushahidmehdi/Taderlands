import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import { Circle as CircleIcon } from "@mui/icons-material";
import { Button, Grid, Typography } from "@mui/material";

import { BacktestChart } from "components";
import SmallText from "components/SmallText";

import { MaximumDrawdown, PositionsCount, SharpeRatio, SuccessRate, TotalProfitPercent } from "images";

import { BacktestContext } from "./Dialog";
import Info from "./Info";
import Positions from "./Positions";
import YieldCurve from "./YieldCurve";

const SummaryItem = ({ icon, label, value }) => {
	return (
		<Grid item>
			<Grid
				container
				sx={{
					backgroundColor: "white",
					p: 2,
					borderRadius: "8px",
					textAlign: "center",
					width: "174px",
					height: "151px",
				}}
			>
				<Grid item xs={12}>
					{icon}
				</Grid>
				<Grid item xs={12}>
					<Typography sx={{ fontSize: "16px", fontWeight: 700 }}>{label}</Typography>
				</Grid>
				<Grid item xs={12}>
					<Typography
						sx={{ fontSize: "18px", fontWeight: 700, color: (ahmet) => ahmet.palette.primary.main }}
					>
						{value}
					</Typography>
				</Grid>
			</Grid>
		</Grid>
	);
};

const ResultSummary = () => {
	const { backtest } = useContext(BacktestContext);
	const { positions } = useSelector((state) => state.backtest);
	const { t } = useTranslation("workshop");

	const summaryMap = {
		totalProfitPercent: {
			icon: <TotalProfitPercent />,
			label: t("workshop_backtest_result_sub_table_text_1"),
		},
		successRate: {
			icon: <SuccessRate />,
			label: t("workshop_backtest_result_sub_table_text_7"),
		},
		averageProfitPercent: {
			icon: <SharpeRatio />,
			label: t("workshop_backtest_result_sub_table_text_6"),
		},
		profitFactor: {
			icon: <TotalProfitPercent />,
			label: t("workshop_backtest_result_sub_table_text_2_1"),
		},
		sharpeRatio: {
			icon: <SharpeRatio />,
			label: t("workshop_backtest_result_sub_table_text_2"),
		},
	};

	const summary = {
		...Object.keys(summaryMap)
			.filter((x) => backtest?.summary.hasOwnProperty(x))
			.map((x) => ({ ...summaryMap[x], value: backtest.summary[x] })),
		positionsCount: {
			value: positions.length,
			icon: <PositionsCount />,
			label: t("workshop_backtest_result_sub_table_text_5"),
		},
		maxDrawUp: {
			icon: <SharpeRatio />,
			label: t("workshop_backtest_result_sub_table_text_3"),
			value: backtest?.summary.maxDrawUp,
		},
		maxDrawDown: {
			icon: <MaximumDrawdown />,
			label: t("workshop_backtest_result_sub_table_text_4"),
			value: backtest?.summary.maxDrawDown,
		},
		averagePositionDuration: {
			icon: <TotalProfitPercent />,
			label: t("workshop_backtest_result_sub_table_text_8"),
			value: backtest?.summary.averagePositionDuration,
		},
		maxReturnDrawUp: {
			icon: (
				<>
					<SharpeRatio />
					<SharpeRatio />
				</>
			),
			label: t("workshop_backtest_result_sub_table_text_3_1"),
			value: backtest?.summary.maxReturnDrawUp,
		},
		maxReturnDrawDown: {
			icon: (
				<>
					<MaximumDrawdown />
					<MaximumDrawdown />
				</>
			),
			label: t("workshop_backtest_result_sub_table_text_4_1"),
			value: backtest?.summary.maxReturnDrawDown,
		},
	};

	return (
		<Grid container>
			<Grid item xs={12}>
				<Typography sx={{ fontSize: "12px" }}>{t("workshop_backtest_result_sub_text")}</Typography>
			</Grid>
			<Grid item xs={12} sx={{ mt: 1 }}>
				<Grid
					container
					justifyContent="space-between"
					sx={{ px: backtest?.summary.hasOwnProperty("sharpeRatio") ? 20 : 2 }}
					spacing={2}
				>
					{Object.values(summary).map(
						({ icon, label, value }, ix) =>
							(value || value === 0) && <SummaryItem key={ix} icon={icon} label={label} value={value} />
					)}
				</Grid>
			</Grid>
		</Grid>
	);
};

export default function Results() {
	const { t } = useTranslation("workshop");

	const { backtest } = useContext(BacktestContext);
	const [tab, setTab] = useState(t("workshop_backtest_result_sub_title"));

	return (
		<Grid container sx={{ backgroundColor: "#F4F5FC", p: 2, borderRadius: "8px", mx: 4, mt: 2 }}>
			<Grid item xs={12}>
				<Typography textAlign="center" sx={{ fontSize: "32px", fontWeight: 700 }}>
					{t("workshop_backtest_result_page_main_title")}
				</Typography>
			</Grid>
			<Grid item xs={12}>
				<SmallText sx={{ textAlign: "center" }}>{t("workshop_backtest_result_page_main_text")}</SmallText>
			</Grid>
			<Grid
				item
				xs={12}
				sx={{
					border: "1px solid #0F20E8",
					borderRadius: "8px",
					padding: "8px",
					backgroundColor: "white",
					mt: 2,
				}}
			>
				<Grid container spacing={1} justifyContent="space-between">
					<Info backtest={backtest} />
				</Grid>
			</Grid>
			<Grid item xs={12} sx={{ mt: 2 }}>
				<BacktestChart
					id={backtest.id}
					symbol={backtest.parity.symbol}
					interval="1H"
					to={new Date(backtest?.endDate).getTime() / 1000}
					from={new Date(backtest?.startDate).getTime() / 1000}
				/>
			</Grid>
			<Grid item xs={12} sx={{ mt: 2 }}>
				<Grid container>
					<Grid item xs={12}>
						<Grid container direction={"row"}>
							{[
								t("workshop_backtest_result_sub_title"),
								t("workshop_backtest_positions_sub_title"),
								"Yield Curve",
							].map((currentTab) => (
								<Grid key={currentTab} item>
									<Button
										size="large"
										sx={{
											fontSize: "1.25rem",
											...(currentTab !== tab ? { color: "#AEAEAE" } : {}),
										}}
										startIcon={
											currentTab === tab ? <CircleIcon sx={{ width: 8, height: 8 }} /> : <></>
										}
										onClick={() => setTab(currentTab)}
									>
										{currentTab}
									</Button>
								</Grid>
							))}
						</Grid>
					</Grid>
					<Grid item xs={12}>
						{tab === t("workshop_backtest_result_sub_title") && <ResultSummary />}
						{tab === t("workshop_backtest_positions_sub_title") && <Positions />}
						{tab === t("Yield Curve") && <YieldCurve backtest={backtest} />}
					</Grid>
				</Grid>
			</Grid>
		</Grid>
	);
}
