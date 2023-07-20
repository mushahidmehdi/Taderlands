import React from "react";

import { Chip as MuiChip } from "@mui/material";

export default function Chip({ icon, backgroundColor, label, fontSize, sx, ...rest }) {
	const Icon = icon ?? null;

	return (
		<MuiChip
			icon={Icon ? <Icon /> : null}
			label={label}
			size="small"
			sx={{
				...(icon ? { paddingLeft: 0.5 } : {}),
				...(fontSize ? { fontSize } : {}),
				borderRadius: 2,
				color: "white",
				backgroundColor,
				...sx,
			}}
			{...rest}
		/>
	);
}
