import React from "react";

import { Typography } from "@mui/material";

export default function Reason({ text }) {
	return <Typography sx={{ color: (theme) => theme.palette.danger.main, fontSize: "12px" }}>{text}</Typography>;
}
