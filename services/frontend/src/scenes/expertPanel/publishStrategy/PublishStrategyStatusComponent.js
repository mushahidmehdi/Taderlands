import { useTranslation } from "react-i18next";

import {
	PublishStrategyButton,
	PublishStrategyParagraphText,
	PublishStrategyStatusTable,
	StrategyPublishStatusResult,
} from "./styles";

const PublishStrategyStatusComponent = ({ strategy, onClose, setStrategyStatus }) => {
	const { t } = useTranslation("expertPanel");

	return (
		<>
			<PublishStrategyParagraphText>
				{t("expert_panel_evaluate_strategy_audit_result_page_main_text")}
			</PublishStrategyParagraphText>
			<PublishStrategyStatusTable data={strategy.strategySuccesses?.[0]} />
			<StrategyPublishStatusResult>{strategy.strategySuccesses[0].status.reason}</StrategyPublishStatusResult>
			<PublishStrategyButton variant="outlined" handleOnClick={onClose}>
				{t("expert_panel_evaluate_strategy_audit_result_page_close_button_text")}
			</PublishStrategyButton>

			{strategy.strategySuccesses?.[0].status.result === "REJECTED" ? (
				<PublishStrategyButton variant="contained" handleOnClick={() => setStrategyStatus("Publish")}>
					{t("expert_panel_evaluate_strategy_audit_result_page_retry_button_text")}
				</PublishStrategyButton>
			) : (
				strategy.strategySuccesses?.[0].status.result === "ACCEPTED" && (
					<PublishStrategyButton variant="contained" handleOnClick={() => setStrategyStatus("Settings")}>
						{t("expert_panel_evaluate_strategy_audit_result_page_continue_button_text")}
					</PublishStrategyButton>
				)
			)}
		</>
	);
};

export default PublishStrategyStatusComponent;
