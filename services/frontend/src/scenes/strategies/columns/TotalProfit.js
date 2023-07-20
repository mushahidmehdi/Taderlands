import React from "react";

import { Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

export default function TotalProfit({ profit }) {
	const theme = useTheme();

	return (
		<>
			{profit ? (
				<>
					<Typography
						variant="subtitle1"
						sx={{
							fontSize: "1.15rem",
							...(profit < 0
								? { color: theme.palette.danger.main }
								: { color: theme.palette.primary.main }),
						}}
					>
						{`${profit < 0 ? "-" : ""}$${profit < 0 ? Math.abs(profit).toFixed(2) : profit.toFixed(2)}`}
					</Typography>
				</>
			) : (
				<div>-</div>
			)}
		</>
	);
}
