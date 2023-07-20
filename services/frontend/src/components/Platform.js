import React from "react";

import { Grid, Typography } from "@mui/material";

import { Config } from "services";

export default function Platform({ platform, labelProps, containerProps }) {
	const { exchange, name } = platform;

	return (
		<Grid container {...containerProps}>
			<Grid item>
				<img
					src={`${Config.cdnRoot()}/general/exchange-icons/${exchange}.png`}
					alt="-"
					style={{
						width: "24px",
						borderRadius: "24px",
					}}
				/>
			</Grid>
			<Grid item>
				<Typography {...labelProps} sx={{ pt: "4px", ...labelProps?.sx }}>
					{name}
				</Typography>
			</Grid>
		</Grid>
	);
}
