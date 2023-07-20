import React from "react";
import { Grid, Typography } from "@mui/material";

export default function Date() {
	return (
		<Grid container>
			<Grid item xs={12}>
				<Typography>18 Jul 2022</Typography>
			</Grid>
			<Grid item xs={12}>
				<Typography>10:05:56</Typography>
			</Grid>
		</Grid>
	);
}
