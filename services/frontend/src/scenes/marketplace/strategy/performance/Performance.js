import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";

import { Paper, Tab, Tabs } from "@mui/material";

import PositionHistory from "../PositionHistory";
import { MarketStrategyContext } from "../Strategy";
import Layout from "./Layout";

function a11yProps(index) {
	return {
		id: `simple-tab-${index}`,
		"aria-controls": `simple-tabpanel-${index}`,
	};
}

export default function Performance() {
	const [tab, setTab] = useState(0);
	const { t } = useTranslation("marketplace");

	const { marketStrategy, marketStrategyMetrics, filter, setFilter } = useContext(MarketStrategyContext);

	return (
		<Paper
			sx={{
				padding: "24px",
				borderRadius: "8px",
				minHeight: "70vh",
				marginBottom: "16px",
				backgroundColor: "#FFF",
			}}
		>
			<Tabs
				variant="fullWidth"
				centered
				value={tab}
				onChange={(_, newValue) => {
					setTab(newValue);
				}}
			>
				<Tab
					fullWidth
					sx={{ textTransform: "none" }}
					label={t("marketplace_strategy_page_live_performance_title")}
					{...a11yProps(0)}
				></Tab>
				{false && (
					<Tab
						fullWidth
						sx={{ textTransform: "none" }}
						label={t("marketplace_strategy_page_backtest_title")}
						{...a11yProps(1)}
					></Tab>
				)}
				<Tab
					fullWidth
					sx={{ textTransform: "none" }}
					label={t("marketplace_strategy_page_position_history_title")}
					{...a11yProps(2)}
				></Tab>
			</Tabs>
			{tab === 0 && (
				<Layout
					quotes={marketStrategy?.strategy.parities.quotes}
					filter={filter}
					setFilter={setFilter}
					data={marketStrategyMetrics?.livetestResults}
				/>
			)}
			{false && (
				<Layout
					quotes={marketStrategy?.strategy.parities.quotes}
					filter={filter}
					setFilter={setFilter}
					data={marketStrategyMetrics?.backtestResults}
				/>
			)}
			{tab === 1 && <PositionHistory />}
		</Paper>
	);
}
