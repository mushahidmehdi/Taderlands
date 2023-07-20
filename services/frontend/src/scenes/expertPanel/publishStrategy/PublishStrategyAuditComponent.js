import React from "react";
import { useTranslation } from "react-i18next";

import { IslemSirasi } from "images";

import { PublishStrategyButton, PublishStrategyParagraphText, PublishStrategyTitle } from "./styles";

const PublishStrategyAuditComponent = ({ onClose }) => {
	const { t } = useTranslation("expertPanel");
	const handleOnClick = () => {
		onClose();
	};
	return (
		<>
			<IslemSirasi style={{ marginBlockEnd: "2rem" }} />
			<PublishStrategyTitle>{t("expert_panel_evaluate_strategy_audit_title")}</PublishStrategyTitle>
			<PublishStrategyParagraphText>
				{t("expert_panel_evaluate_strategy_audit_text")}
			</PublishStrategyParagraphText>
			<PublishStrategyButton variant="outlined" handleOnClick={handleOnClick}>
				{t("expert_panel_evaluate_strategy_audit_button_text")}
			</PublishStrategyButton>
		</>
	);
};

export default PublishStrategyAuditComponent;
