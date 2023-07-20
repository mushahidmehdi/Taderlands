import { Settings as SettingsSvg } from "images";
import { Grid, Button } from "@mui/material";

import React from "react";

export default function Settings() {
	return (
		<Grid container>
			<Grid item xs={12}>
				<Button variant="text">
					<SettingsSvg width={24} height={24} />
				</Button>
			</Grid>
		</Grid>
	);
}
