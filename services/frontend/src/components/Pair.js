import React from "react";

import { Grid, Typography } from "@mui/material";

import { SpotRight } from "images";
import { Config } from "services";

export default function Pair({ base, quote }) {
	return (
		<Grid container spacing={1}>
			<Grid item>
				<img loading="lazy" width="20" src={`${Config.cdnRoot()}/general/crypto-icons/${base}.png`} alt="" />
			</Grid>
			<Grid item>
				<Typography>{base}</Typography>
			</Grid>
			<Grid item>
				<div style={{ marginTop: "4px" }}>
					<SpotRight />
				</div>
			</Grid>
			<Grid item>
				<span style={{ fontSize: "12px", color: "#AEAEAE" }}>{quote}</span>
			</Grid>
		</Grid>
	);
}
