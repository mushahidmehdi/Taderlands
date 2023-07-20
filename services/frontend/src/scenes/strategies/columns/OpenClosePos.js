import React from "react";

import { Typography } from "@mui/material";

export default function OpenClosePos({ successInfo }) {
	return (
		<Typography>
			<span style={{ color: "#CFD2FA" }}>{successInfo?.openPositionsCount}</span>&nbsp;-&nbsp;
			<span style={{ color: "#0F20E8" }}>{successInfo?.closedPositionsCount}</span>
		</Typography>
	);
}
