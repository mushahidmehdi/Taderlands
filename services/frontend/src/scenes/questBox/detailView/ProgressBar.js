import React from "react";

import { Box } from "@mui/system";

const ProgressBar = ({ barColor }) => {
	return (
		<Box
			sx={{
				background: `${barColor ? "#12c15a" : "#CFD2FA"}`,
				borderRadius: "2rem",
				height: "0.9rem",
				width: "22rem",
			}}
		/>
	);
};

export default ProgressBar;
