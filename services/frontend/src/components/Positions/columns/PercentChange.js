import React from "react";

import { Grid, Typography } from "@mui/material";

import { SpotDown, SpotUp } from "images";

export default function PercentChange({ label, value }) {
	return (
		<Grid item>
			<Typography sx={{ fontSize: "12px", fontWeight: 700 }}>{label}</Typography>
			<Typography
				variant="subtitle1"
				sx={{
					fontSize: "16px",
					fontWeight: 700,
					color: (theme) =>
						parseFloat(value) < 0
							? theme.palette.danger.main
							: parseFloat(value) === 0
							? theme.palette.primary.main
							: theme.palette.success.main,
				}}
			>
				{`${value}%`}
				{parseFloat(value) < 0 ? <SpotDown /> : parseFloat(value) === 0 ? "-" : <SpotUp />}
			</Typography>
		</Grid>
	);
}
