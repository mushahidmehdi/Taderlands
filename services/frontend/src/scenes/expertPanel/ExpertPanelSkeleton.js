import React from "react";

import { Grid, Skeleton } from "@mui/material";
import { Box } from "@mui/system";

import EditProfileSkeleton from "./editProfile/EditProfileSkeleton";
import StrategiesSkeleton from "./strategies/StrategiesSkeleton";

const ExpertPanelSkeleton = () => {
	return (
		<Grid container justifyContent={"space-between"} spacing={2}>
			<Grid item xs={7.5}>
				<Box>
					<Skeleton variant="text" sx={{ fontSize: "2rem", width: "40%" }} />
					<Skeleton variant="text" sx={{ fontSize: "1rem", width: "100%" }} />
					<Skeleton variant="text" sx={{ fontSize: "1rem", width: "100%" }} />
					<Skeleton variant="text" sx={{ fontSize: "1rem", width: "50%" }} />
				</Box>
				{Array.from({ length: 10 }, (_, i) => i + 1).map(() => (
					<StrategiesSkeleton />
				))}
			</Grid>

			<Grid item xs={4.5}>
				<EditProfileSkeleton />
			</Grid>
		</Grid>
	);
};

export default ExpertPanelSkeleton;
