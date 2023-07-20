import { useTranslation } from "react-i18next";

import { SharpeRatio, SuccessRate, TotalProfitPercent } from "images";

export default function useStatisticsMap() {
	const { t } = useTranslation("marketplace");

	const statisticsMap = {
		totalVolume: {
			icon: <TotalProfitPercent />,
			label: t("marketplace_strategy_page_follow_modal_total_volume_title"),
			price: true,
		},
		successRatio: {
			icon: <SuccessRate />,
			label: t("marketplace_strategy_page_follow_modal_success_rate_title"),
			multiplier: 100,
			percent: true,
		},
		averagePositionDuration: {
			label: t("marketplace_strategy_page_follow_modal_avg_duration_title"),
		},
		averageProfit: {
			icon: <TotalProfitPercent />,
			label: t("marketplace_strategy_page_follow_modal_avg_profit_title"),
			price: true,
		},
		totalProfit: {
			icon: <SharpeRatio />,
			label: t("marketplace_strategy_page_follow_modal_total_profit_title"),
			price: true,
		},
	};

	return { statisticsMap };
}
