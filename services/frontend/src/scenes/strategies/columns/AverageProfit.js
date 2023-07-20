import { Grid, Typography } from "@mui/material";
import { SpotDown, SpotUp } from "images";

import React from "react";

export default function Profit({ profit }) {
	return (
		<Grid container>
			<Grid item>
				<Typography sx={{ ...(profit && { color: profit < 0 ? "#DE350B" : "#36B37E" }) }}>
					{`${
						profit
							? profit < 0
								? "-" + parseFloat(profit.toString().substring(1)).toFixed(2) + "%"
								: profit.toFixed(2) + "%"
							: "-"
					}`}
				</Typography>
			</Grid>
			<Grid item>{profit ? profit < 0 ? <SpotDown /> : <SpotUp /> : <></>}</Grid>
		</Grid>
	);
}
