import React from "react";

import { Box, Tooltip, Typography } from "@mui/material";

export default function ExploreModeTooltip({ enabled, title, children, ...rest }) {
	if (!enabled) return children;

	return (
		<Tooltip
			componentsProps={{
				tooltip: {
					sx: {
						backgroundColor: "white",
						borderRadius: "8px",
						padding: 2,
						maxWidth: "400px",
						color: "#000",
						boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
					},
				},
			}}
			title={
				title ?? (
					<Box>
						<Typography sx={{ fontSize: "14px", fontWeight: "bold", mb: 1 }}>Explore Mode</Typography>
						<Typography sx={{ fontSize: "14px" }}>
							*You are in Explorer Mode, to start using strategies, please upgrade your status to "Full
							Access" by entering a referral code. This will enable you to take full advantage of the
							platform's features.
						</Typography>
					</Box>
				)
			}
			{...rest}
		>
			{children}
		</Tooltip>
	);
}
