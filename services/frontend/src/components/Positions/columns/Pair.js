import React from "react";

import { Grid, Typography } from "@mui/material";

import { SpotRight } from "images";
import Config from "services/config";

export default function Pair({ parity }) {
	const { base, quote } = parity;

	return (
		<Grid container>
			<Grid item>
				<img
					width="24px"
					height="24px"
					style={{ marginTop: 8, marginRight: 8 }}
					src={`${Config.cdnRoot()}/general/crypto-icons/${base}.png`}
				/>
			</Grid>
			<Grid item>
				<Typography variant="subtitle1" fontWeight="bold">
					{base}
				</Typography>
				<Grid container>
					<Grid item>
						<SpotRight style={{ marginTop: 2, marginRight: 4 }} />
					</Grid>
					<Grid item>
						<Typography variant="p">{quote}</Typography>
					</Grid>
				</Grid>
			</Grid>
		</Grid>
	);
}
