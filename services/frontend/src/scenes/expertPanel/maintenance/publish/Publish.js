import { useContext } from "react";

import { DialogContent } from "@mui/material";

import { MaintenanceContext } from "../MaintenanceDialog";
import MarketStrategyInfo from "./MarketStrategyInfo";

const Publish = ({ strategyName, contentProps }) => {
	const { selection, selectedStrategy, setSelection, SelectionSettings } = useContext(MaintenanceContext);

	return (
		<DialogContent sx={{ paddingTop: "10vh !important" }} {...contentProps}>
			<MarketStrategyInfo strategy={selectedStrategy} />
		</DialogContent>
	);
};

export default Publish;
