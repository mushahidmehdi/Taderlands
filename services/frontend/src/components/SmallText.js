import React from "react";

import { Typography } from "@mui/material";

export default function SmallText({ children, sx }) {
	return <Typography sx={{ fontSize: "12px", ...sx }}>{children}</Typography>;
}
