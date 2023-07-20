import React from "react";

import { Box, Grid, Typography } from "@mui/material";

import { DoubleEllipse, SpotRight, Uri } from "images";

export default function Info({ virtual, name, quotes, hideIcon }) {
	return (
		<Grid
			container
			justifyContent={"center"}
			alignItems="center"
			width={"12rem"}
			maxWidth={"100%"}
			textOverflow="ellipsis"
			overflow={"hidden"}
		>
			{!hideIcon && (
				<Grid item xs={2}>
					{virtual === false ? (
						<Uri width="22" height="22" active={true} />
					) : (
						<DoubleEllipse width="22" height="22" />
					)}
				</Grid>
			)}

			<Grid item xs={8}>
				<Typography
					sx={{
						fontSize: "16px",
						fontWeight: 700,
						lineHeight: "18px",
					}}
				>
					{name}
				</Typography>
				<Typography sx={{ fontSize: "12px", color: "#AEAEAE", fontWeight: 700, lineHeight: "16px" }}>
					<SpotRight />
					<Box component="span">{quotes?.map((quote) => quote)}</Box>
				</Typography>
			</Grid>
		</Grid>
	);
}
