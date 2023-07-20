import { useContext } from "react";
import { useTranslation } from "react-i18next";

import { Button, DialogContent, Grid, Typography } from "@mui/material";

import { Success as SuccessSvg } from "images";

import { RobotContext } from "./RobotDialog";

const Success = () => {
	const { t } = useTranslation();

	const { onClose, successMessage } = useContext(RobotContext);

	return (
		<>
			<DialogContent sx={{ paddingTop: "10vh !important" }}>
				<Grid container spacing={2} direction="column" alignItems="center" justifyContent="center">
					<Grid item xs={12}>
						<SuccessSvg />
					</Grid>
					<Grid item xs={12}>
						<Typography variant="p" style={{ fontWeight: "bold", color: "#3A3A3A" }}>
							{t("control_panel_robot_settings_success_title")}
						</Typography>
					</Grid>
					<Grid item xs={12}>
						<Typography variant="span" style={{ color: "#3A3A3A" }}>
							{t("control_panel_robot_settings_success_text")}
						</Typography>
					</Grid>
				</Grid>
				<Grid item xs={12} style={{ marginTop: "20px" }}>
					<Button
						fullWidth
						variant="contained"
						onClick={() => {
							onClose();
						}}
					>
						{t("common:Close")}
					</Button>
				</Grid>
			</DialogContent>
		</>
	);
};

export default Success;
