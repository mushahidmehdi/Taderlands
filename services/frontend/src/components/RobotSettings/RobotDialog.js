import { createContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { Dialog, DialogTitle, Grid, IconButton, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { Close as CloseSvg } from "images";

import { Budget } from "./Budget";
import Portfolio from "./Portfolio";
import Position from "./Position";
import Selection from "./Selection";
import Status from "./Status";
import Success from "./Success";
import Unfollow from "./Unfollow";
import { BUDGET, PORTFOLIO, POSITION, SELECTION, STATUS, SUCCESS, UNFOLLOW } from "./utils/constant";

export const RobotContext = createContext();

export default function RobotDialog({
	open,
	onClose,
	selectedStrategyFollower,
	setSelectedStrategyFollower,
	budgetOpen,
	portfolio,
}) {
	const { t } = useTranslation();
	const theme = useTheme();

	const { profile } = useSelector((state) => state.user);
	const [selection, setSelection] = useState(budgetOpen ? BUDGET : SELECTION);
	const [successMessage, setSuccessMessage] = useState({ title: "", subtitle: "" });
	const [backButton, setBackButton] = useState({
		to: SELECTION,
		label: t("control_panel_robot_settings_main_title"),
	});

	const name = selectedStrategyFollower?.strategy?.marketStrategy?.name ?? selectedStrategyFollower?.strategy?.name;

	const SelectionSettings = {
		[SELECTION]: {
			title: t("Bot Durumu"),
			subtitle:
				"Add your exchange's API information so that Traderlands can communicate with your exchange accounts.",
			component: Selection,
		},
		[STATUS]: {
			title: t("control_panel_robot_settings_status_title"),
			subtitle: t("control_panel_robot_settings_status_text", { name }),
			component: Status,
		},
		[BUDGET]: {
			title: t("control_panel_robot_settings_budget_title"),
			subtitle: t("control_panel_robot_settings_budget_text", { name }),
			component: Budget,
		},
		[POSITION]: {
			title: t("control_panel_robot_settings_position_settings_title"),
			subtitle: t("control_panel_robot_settings_position_settings_text", { name }),
			component: Position,
		},
		[PORTFOLIO]: {
			title: t("control_panel_robot_settings_portfolio_settings_title"),
			subtitle: t("control_panel_robot_settings_portfolio_settings_text", { name }),
			component: Portfolio,
		},
		...(selectedStrategyFollower?.strategy?.marketStrategy &&
			profile?.merchant?.id !== selectedStrategyFollower?.strategy?.marketStrategy?.merchant?.id && {
				[UNFOLLOW]: {
					title: t("control_panel_robots_robot_settings_unfollow_button_title"),
					subtitle: t("control_panel_robots_robot_settings_unfollow_button_text"),
					component: Unfollow,
					color: theme.palette.danger.main,
				},
			}),
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
								(backButton.to === BUDGET || backButton.to === POSITION) &&
									setBackButton({
										to: SELECTION,
										label: t("control_panel_robot_settings_status_back_button"),
									});

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
			<RobotContext.Provider
				value={{
					backButton,
					setBackButton,
					onClose,
					selection,
					setSelection,
					successMessage,
					setSuccessMessage,
					SelectionSettings,
					portfolio,
					selectedStrategyFollower,
					setSelectedStrategyFollower,
				}}
			>
				<CurrentComponent
					contentProps={{ sx: { pt: "5vh !important" } }}
					strategyName={
						<Typography
							sx={{ color: (theme) => theme.palette.primary.main, textAlign: "center", fontSize: "14px" }}
						>
							{selectedStrategyFollower?.strategy?.marketStrategy?.name ??
								selectedStrategyFollower?.strategy?.name}
						</Typography>
					}
				></CurrentComponent>
			</RobotContext.Provider>
		</Dialog>
	);
}
