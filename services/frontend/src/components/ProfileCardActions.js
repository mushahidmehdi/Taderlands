import React from "react";
import { Grid, CardActions, Button } from "@mui/material";

export default function ProfileCardActions({ buttonText, onClick }) {
	return (
		<CardActions sx={{ paddingBottom: "16px" }}>
			<Grid container justifyContent={"center"}>
				<Grid item xs={6}>
					<Button onClick={onClick} variant="contained" fullWidth>
						{buttonText}
					</Button>
				</Grid>
			</Grid>
		</CardActions>
	);
}
