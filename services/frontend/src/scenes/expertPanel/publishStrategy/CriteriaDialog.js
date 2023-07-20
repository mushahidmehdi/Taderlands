import { useState } from "react";

import { Dialog } from "components";

import MarketStrategyInfo from "./MarketStrategyInfo";
import ExpertFlowAuditStrategy from "./PublishStrategyAuditComponent";
import ExpertFlowStartStrategy from "./PublishStrategyStartComponent";
import ExpertFlowStatus from "./PublishStrategyStatusComponent";

const PublishStrategyDialog = ({
	open,
	onClose,
	selectedStrategy,
	strategyStatus,
	setStrategyStatus,
	handleRefreshStategies,
}) => {
	const [auditTrue, setAuditTrue] = useState(false);

	return (
		<Dialog
			dialogProps={{
				open: open,
				onClose: onClose,
				sx: {
					"& .MuiPaper-root": {
						margin: "0 0 0 auto",
						height: "100%",
						maxHeight: "none",
						maxWidth: "600px",
						minWidth: "540px",
					},
				},
			}}
			contentProps={{
				sx: {
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
				},
			}}
			content={
				strategyStatus === "ViewResult" ? (
					<ExpertFlowStatus
						strategy={selectedStrategy}
						onClose={onClose}
						setStrategyStatus={setStrategyStatus}
					/>
				) : strategyStatus === "Settings" ? (
					<MarketStrategyInfo
						strategy={selectedStrategy}
						onClose={onClose}
						handleRefreshStategies={handleRefreshStategies}
					/>
				) : auditTrue ? (
					<ExpertFlowAuditStrategy onClose={onClose} />
				) : (
					strategyStatus === "Publish" && (
						<ExpertFlowStartStrategy
							strategy={selectedStrategy}
							onClose={onClose}
							setAuditTrue={setAuditTrue}
							handleRefreshStategies={handleRefreshStategies}
						/>
					)
				)
			}
		/>
	);
};

export default PublishStrategyDialog;
