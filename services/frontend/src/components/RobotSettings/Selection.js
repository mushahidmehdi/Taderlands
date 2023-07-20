import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";

import { Button, Card, CardContent, CardHeader, DialogContent, Grid, Typography } from "@mui/material";

import { RobotContext } from "./RobotDialog";
import { BUDGET, SELECTION, SUCCESS } from "./utils/constant";

const Actions = ({ selected, type, title, subtitle, onClick, color }) => {
	return (
		<Grid item xs={12} sx={{ mt: 2 }} style={{ marginBottom: "5px" }}>
			<Card
				sx={{
					borderRadius: 2,
					border: "1px solid",
					borderColor: (theme) => (color ? color : theme.palette.primary.light),
					backgroundColor: `${selected == true ? (color ? color : "blue") : "white"}`,
					cursor: "pointer",
				}}
				onClick={() => {
					onClick(type);
				}}
			>
				<CardHeader
					title={
						<Typography
							sx={{
								color: (theme) =>
									`${selected == true ? "white" : color ? color : theme.palette.primary.main}`,
								fontSize: "1rem",
								fontWeight: 700,
							}}
						>
							{title}
						</Typography>
					}
					sx={{
						paddingBottom: "0",
					}}
				/>
				<CardContent>
					<Grid container spacing={1}>
						<Grid
							item
							xs={12}
							style={{ fontSize: "12px", color: `${selected == true ? "white" : "black"}` }}
						>
							{subtitle}
						</Grid>
					</Grid>
				</CardContent>
			</Card>
		</Grid>
	);
};

const Selection = ({ children, contentProps, selectedStrategy }) => {
	const [selectedAction, setSelectedAction] = useState();
	const { selection, selectedStrategyFollower, setSelection, SelectionSettings } = useContext(RobotContext);

	const { t } = useTranslation();

	const handleActionClick = (type) => {
		setSelectedAction(type);
	};

	return (
		<>
			<DialogContent sx={{ paddingTop: "10vh !important" }} {...contentProps}>
				<Grid container spacing={2} direction="column" alignItems="center" justifyContent="center">
					<Grid item xs={12}>
						<Typography variant="h5">{t("control_panel_robot_settings_main_title")}</Typography>
					</Grid>
					<Grid item xs={12}>
						<Typography variant="p">
							{t(`control_panel_robot_settings_main_text`, {
								name:
									selectedStrategyFollower?.strategy?.marketStrategy?.name ??
									selectedStrategyFollower?.strategy?.name,
							})}
						</Typography>
					</Grid>
				</Grid>

				{children}

				<Grid sx={{ paddingTop: "2vh" }}>
					{Object.keys(SelectionSettings)
						.filter(
							(x) =>
								![
									SELECTION,
									SUCCESS,
									...(selectedStrategyFollower?.strategy?.virtual ? [BUDGET] : []),
								].includes(x)
						)
						.map((key) => (
							<Actions
								type={key}
								title={SelectionSettings[key].title}
								subtitle={SelectionSettings[key].subtitle}
								selected={selectedAction === key}
								color={SelectionSettings[key].color}
								onClick={handleActionClick}
							/>
						))}
				</Grid>
				<Grid container spacing={2} sx={{ paddingTop: "3vh" }}>
					<Grid item xs={12}>
						<Button
							fullWidth
							variant="contained"
							onClick={() => {
								setSelection(selectedAction);
							}}
							disabled={!selectedAction}
						>
							{t("control_panel_robot_settings_status_button_next")}
						</Button>
					</Grid>
				</Grid>
			</DialogContent>
		</>
	);
};

export default Selection;
