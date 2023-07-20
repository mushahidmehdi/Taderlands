import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";

import { Button, Card, CardContent, CardHeader, DialogContent, Grid, Typography } from "@mui/material";

import { MaintenanceContext } from "./MaintenanceDialog";
import { SELECTION, SUCCESS } from "./utils/constant";

const Actions = ({ selected, type, title, subtitle, onClick, color }) => {
	return (
		<Grid item xs={12} sx={{ mt: 2 }} style={{ marginBottom: "5px" }}>
			<Card
				sx={{
					borderRadius: 2,
					border: "1px solid",
					borderColor: (theme) => (color ? color : theme.palette.primary.light),
					backgroundColor: `${selected === true ? (color ? color : "blue") : "white"}`,
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
									`${selected === true ? "white" : color ? color : theme.palette.primary.main}`,
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
							style={{ fontSize: "12px", color: `${selected === true ? "white" : "black"}` }}
						>
							{subtitle}
						</Grid>
					</Grid>
				</CardContent>
			</Card>
		</Grid>
	);
};

const Selection = ({ children, contentProps }) => {
	const [selectedAction, setSelectedAction] = useState();
	const { selection, selectedStrategy, setSelection, SelectionSettings } = useContext(MaintenanceContext);

	const { t } = useTranslation("expertPanel");

	const handleActionClick = (type) => {
		setSelectedAction(type);
	};

	return (
		<>
			<DialogContent sx={{ paddingTop: "10vh !important" }} {...contentProps}>
				<Grid container spacing={2} direction="column" alignItems="center" justifyContent="center">
					<Grid item xs={12}>
						<Typography variant="h5">{t("expert_panel_market_strategy_settings_main_title")}</Typography>
					</Grid>
					<Grid item xs={12}>
						<Typography variant="p">{t(`expert_panel_market_strategy_settings_main_text`)}</Typography>
					</Grid>
				</Grid>

				{children}

				<Grid sx={{ paddingTop: "2vh" }}>
					{Object.keys(SelectionSettings)
						.filter((x) => ![SELECTION, SUCCESS].includes(x))
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
							{t("expert_panel_market_strategy_settings_next_button_text")}
						</Button>
					</Grid>
				</Grid>
			</DialogContent>
		</>
	);
};

export default Selection;
