import React from "react";

import { Grid, Paper, Skeleton } from "@mui/material";

const StrategiesSkeleton = () => {
	return (
		<Paper
			elevation={0}
			sx={{
				mt: 2,
				overflow: "hidden",
				padding: "2rem",
			}}
		>
			<Grid container justifyContent={"space-between"} alignItems={"center"}>
				<Grid item xs={3}>
					<Skeleton variant="text" sx={{ fontSize: "2rem", width: "60%" }} />
				</Grid>

				<Grid item xs={2}>
					<Skeleton variant="text" sx={{ fontSize: "2rem", width: "60%" }} />
				</Grid>

				<Grid item xs={2}>
					<Skeleton variant="text" sx={{ fontSize: "2rem", width: "60%" }} />
				</Grid>
				<Grid item xs={1.5}>
					<Skeleton variant="text" sx={{ fontSize: "2rem", width: "60%" }} />
				</Grid>

				<Grid item xs={2} textAlign="center">
					<Skeleton variant="text" sx={{ fontSize: "2rem", width: "60%" }} />
				</Grid>
			</Grid>
		</Paper>
	);
};

export default StrategiesSkeleton;
