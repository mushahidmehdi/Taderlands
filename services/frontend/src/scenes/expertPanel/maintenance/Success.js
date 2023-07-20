import { useContext } from "react";
import { useTranslation } from "react-i18next";

import { Button, DialogContent, Grid, Typography } from "@mui/material";

import { Success as SuccessSvg } from "images";

import { MaintenanceContext } from "./MaintenanceDialog";

const Success = () => {
	const { t } = useTranslation("expertPanel");

	const { onClose, successMessage } = useContext(MaintenanceContext);

	return (
		<>
			<DialogContent sx={{ paddingTop: "10vh !important" }}>
				<Grid container spacing={2} direction="column" alignItems="center" justifyContent="center">
					<Grid item xs={12}>
						<SuccessSvg />
					</Grid>
					<Grid item xs={12}>
						<Typography variant="p" style={{ fontWeight: "bold", color: "#3A3A3A" }}>
							{t("expert_panel_market_status_settings_success_title")}
						</Typography>
					</Grid>
					<Grid item xs={12}>
						<Typography variant="span" style={{ color: "#3A3A3A" }}>
							{t("expert_panel_market_status_settings_success_text")}
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
						{t("expert_panel_market_status_settings_success_close")}
					</Button>
				</Grid>
			</DialogContent>
		</>
	);
};

export default Success;
