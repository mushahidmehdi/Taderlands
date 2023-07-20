import * as React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { Box, Button, Grid, Paper, Typography } from "@mui/material";

import { registerSuccess } from "images";

import Copyright from "./Copyright";
import TopBar from "./TopBar";

export default function RegisterSuccess() {
	const { t } = useTranslation();
	const navigate = useNavigate();

	return (
		<React.Fragment>
			<TopBar></TopBar>
			<Grid container sx={{ mt: 20, justifyContent: "center" }}>
				<Paper
					maxWidth="sm"
					sx={{
						padding: 5,
						justifyContent: "center",
						backgroundColor: "#FFFFFF",
						boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 4px",
					}}
				>
					<Box
						sx={{
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
						}}
					>
						<Box component="img" src={registerSuccess} sx={{ mt: 5 }} />
						<Typography sx={{ mt: 2, fontSize: "32px", fontWeight: "bold" }}>
							{t("Welcome to Paratica")}
						</Typography>

						<Typography sx={{ mt: 2, textAlign: "center", width: "60%", fontSize: "16px" }}>
							{t("Your e-mail address has been verified and you trial premium service has started")}
						</Typography>

						<Button
							fullWidth
							variant="contained"
							sx={{ mt: 3, width: "60%", fontSize: "16px" }}
							onClick={() => navigate(`/`)}
						>
							{t("Go to entry page")}
						</Button>
					</Box>
				</Paper>
			</Grid>
			<Copyright></Copyright>
		</React.Fragment>
	);
}
