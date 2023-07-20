import { useTranslation } from "react-i18next";

import { Box, Typography } from "@mui/material";

import { useStrategyApi } from "api/strategy";

import { IslemSirasi } from "images";

import { tradingQualityRatios } from "./config";
import { PublishStrategyButton, PublishStrategyParagraphText, PublishStrategyTitle } from "./styles";

const PublishStrategyStartComponent = ({ strategy, setAuditTrue, handleRefreshStategies }) => {
	const { startStrategyEvaluation } = useStrategyApi();

	const { t } = useTranslation("expertPanel");

	const handleOnClick = () => {
		startStrategyEvaluation(strategy.id).then((data) => {
			if (data.strategy_success_id) {
				setAuditTrue(true);
				handleRefreshStategies();
			}
		});
	};

	return (
		<>
			<IslemSirasi style={{ marginBlockEnd: "2rem" }} />

			{strategy.strategyTypeId === 1 ? (
				<PublishStrategyTitle>
					{t("expert_panel_evaluate_traderlands_strategy_main_title")}
				</PublishStrategyTitle>
			) : (
				<PublishStrategyTitle>{t("expert_panel_evaluate_tv_strategy_main_title")}</PublishStrategyTitle>
			)}

			{strategy.strategyTypeId === 1 ? (
				<PublishStrategyParagraphText>
					{t("expert_panel_evaluate_traderlands_strategy_main_text")}
				</PublishStrategyParagraphText>
			) : (
				<PublishStrategyParagraphText>
					{t("expert_panel_evaluate_tv_strategy_main_text")}
				</PublishStrategyParagraphText>
			)}

			{strategy.strategyTypeId === 2 && (
				<>
					<Typography
						sx={{
							fontSize: "14px",
							fontWeight: 400,
							lineHeight: "18px",
							textAlign: "center",
							paddingInline: "1rem",
							marginTop: "1rem",
							marginBlockEnd: "0.4rem",
						}}
					>
						{t("expert_panel_evaluate_tv_strategy_sub_title")}
					</Typography>
					<Typography
						sx={{
							fontSize: "14px",
							fontWeight: 400,
							lineHeight: "15.1px",
							textAlign: "center",
							paddingInline: "1rem",
							marginBlockEnd: "0.8rem",
							color: "#0F20E8",
						}}
					>
						@traderlands
					</Typography>
				</>
			)}

			<Box
				sx={{
					backgroundColor: "#FAFAFE",
					width: "88%",
					padding: "1rem",
					borderRadius: "0.3rem",
					justifyContent: "space-between",
				}}
			>
				{tradingQualityRatios.map((item, index) => (
					<Box
						key={index}
						display="flex"
						justifyContent="space-between"
						sx={{
							padding: "0.3rem",
							backgroundColor: "#FAFAFE",
							borderRadius: "0.3rem",
						}}
					>
						<Typography
							sx={{
								fontSize: "14px",
								fontWeight: 700,
							}}
						>
							{item.title}
						</Typography>

						<Typography
							sx={{
								color: "#898989",
								fontSize: "14px",
								fontWeight: 700,
							}}
						>
							{item.value}
						</Typography>
					</Box>
				))}
			</Box>

			<PublishStrategyButton variant="contained" handleOnClick={handleOnClick}>
				{strategy.strategyTypeId === 1
					? t("expert_panel_evaluate_traderlands_strategy_button_text")
					: t("expert_panel_evaluate_tv_strategy_button_text")}
			</PublishStrategyButton>
		</>
	);
};

export default PublishStrategyStartComponent;
