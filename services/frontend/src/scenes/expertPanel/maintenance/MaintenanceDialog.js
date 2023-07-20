import { createContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { Dialog, DialogTitle, Grid, IconButton, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { Close as CloseSvg } from "images";

import Selection from "./Selection";
import Status from "./Status";
import Success from "./Success";
import { Publish } from "./publish";
import { PUBLISH, SELECTION, STATUS, SUCCESS } from "./utils/constant";

export const MaintenanceContext = createContext();

export default function MaintenanceDialog({ open, onClose, selectedStrategy, setSelectedStrategy }) {
	const { t } = useTranslation("expertPanel");
	const theme = useTheme();

	const { profile } = useSelector((state) => state.user);
	const [selection, setSelection] = useState(SELECTION);
	const [successMessage, setSuccessMessage] = useState({ title: "", subtitle: "" });
	const [backButton, setBackButton] = useState({
		to: SELECTION,
		label: t("expert_panel_market_strategy_settings_main_title"),
	});

	const name = selectedStrategy?.marketStrategy?.name ?? selectedStrategy?.name;

	const SelectionSettings = {
		[SELECTION]: {
			title: t("Bot Durumu"),
			subtitle:
				"Add your exchange's API information so that Traderlands can communicate with your exchange accounts.",
			component: Selection,
		},
		[PUBLISH]: {
			title: t("expert_panel_market_strategy_settings_publish_title"),
			subtitle: t("expert_panel_market_strategy_settings_publis_text"),
			component: Publish,
		},
		[STATUS]: {
			title: t("expert_panel_market_strategy_settings_status_title"),
			subtitle: t("expert_panel_market_strategy_settings_status_text"),
			component: Status,
		},

		[SUCCESS]: {
			component: Success,
		},
	};

	const CurrentComponent = SelectionSettings[selection].component;

	return (
		<Dialog
			open={open}
			onClose={onClose}
			sx={{
				"& .MuiPaper-root": {
					margin: "0 0 0 auto",
					height: "100%",
					maxHeight: "none",
					maxWidth: "568px",
				},
			}}
		>
			<DialogTitle sx={{ fontSize: 24 }}>
				{selection !== SELECTION ? (
					<Grid container xs={12} direction="row">
						<IconButton
							color="primary"
							onClick={() => {
								setSelection(backButton.to);
							}}
						>
							<KeyboardBackspaceIcon />
						</IconButton>

						<Typography style={{ color: "#3A3A3A", marginLeft: "5px", marginTop: "10px" }}>
							{backButton.label}
						</Typography>
					</Grid>
				) : (
					<></>
				)}

				<IconButton
					aria-label="close"
					onClick={onClose}
					sx={{
						position: "absolute",
						right: 8,
						top: 8,
						color: (theme) => theme.palette.grey[500],
					}}
				>
					<CloseSvg />
				</IconButton>
			</DialogTitle>
			<MaintenanceContext.Provider
				value={{
					backButton,
					setBackButton,
					onClose,
					selection,
					setSelection,
					successMessage,
					setSuccessMessage,
					SelectionSettings,
					selectedStrategy,
					setSelectedStrategy,
				}}
			>
				<CurrentComponent
					contentProps={{ sx: { pt: "5vh !important" } }}
					strategyName={
						<Typography
							sx={{ color: (theme) => theme.palette.primary.main, textAlign: "center", fontSize: "14px" }}
						>
							{selectedStrategy?.marketStrategy?.name ?? selectedStrategy?.name}
						</Typography>
					}
				></CurrentComponent>
			</MaintenanceContext.Provider>
		</Dialog>
	);
}
