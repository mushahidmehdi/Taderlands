import React from "react";

import { Grid, Typography } from "@mui/material";

import { ArrowRight } from "images";

export default function Breadcrumbs({ paths }) {
	return (
		<Grid container spacing={1} sx={{ mt: 1 }}>
			{paths.map((path, ix) => (
				<>
					{ix !== paths.length - 1 && (
						<>
							<Grid item>
								<Typography
									sx={{
										color: (theme) => theme.palette.info.dark,
										fontSize: "24px",
										fontWeight: 700,
										cursor: "pointer",
										":hover": {
											textDecoration: "underline",
										},
									}}
									onClick={path.onClick}
								>
									{path.text}
								</Typography>
							</Grid>
							<Grid item>
								<ArrowRight style={{ marginTop: "10px" }} />
							</Grid>
						</>
					)}
					{ix === paths.length - 1 && (
						<Grid item>
							<Typography sx={{ color: "#3A3A3A", fontSize: "24px", fontWeight: 700 }}>
								{path.text}
							</Typography>
						</Grid>
					)}
				</>
			))}
		</Grid>
	);
}
