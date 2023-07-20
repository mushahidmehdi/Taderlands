import React from "react";

import { Box, Grid, Typography } from "@mui/material";

import RankIcon from "./RankIcon";

export default function SelfRank({ score, rank, previousRank }) {
	return (
		<Grid item xs={12}>
			<Box
				sx={{
					height: "46px",
					borderRadius: "23px",
					backgroundColor: (theme) => theme.palette.primary.main,
					color: "#fff",
					px: "32px",
					pt: "6px",
					mr: "auto",
					ml: "auto",
				}}
			>
				<Grid container justifyContent="space-between">
					<Grid item>
						<Typography sx={{ fontSize: "14px", fontWeight: 400 }}>Your Rank</Typography>
						<Typography sx={{ fontSize: "10px", fontWeight: 500 }}>{`Score: ${
							score ? Number(score).toFixed(4) : "-"
						} `}</Typography>
					</Grid>
					<Grid item>
						<Grid container spacing={1}>
							<Grid item>
								<Typography sx={{ fontSize: "18px", fontWeight: 700 }}>{rank}</Typography>
							</Grid>
							<Grid item>
								<RankIcon previousRank={previousRank} rank={rank} />
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</Box>
		</Grid>
	);
}
