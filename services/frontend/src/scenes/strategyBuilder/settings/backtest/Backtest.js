import React, { useState } from "react";

import { Button, Grid, Typography } from "@mui/material";

import { BacktestBackground, BacktestIcon } from "images";

import BacktestDialog from "./Dialog";

export default function Backtest() {
	const [open, setOpen] = useState(false);

	return (
		<div
			style={{
				borderRadius: "8px",
				height: "170px",
				backgroundImage: `linear-gradient(89.98deg, #131722 0.01%, rgba(19, 23, 34, 0.94) 50.73%, rgba(19, 23, 34, 0.754323) 74.02%, rgba(19, 23, 34, 0.47) 99.38%), url(${BacktestBackground})`,
			}}
		>
			<Grid container justifyContent={"space-between"}>
				<Grid item sx={{ mt: "30px", ml: "25px" }}>
					<BacktestIcon />
					<Typography sx={{ color: "white", fontSize: "24px", fontWeight: 700, mt: "16px" }}>
						{t("workshop_backtest_settings_main_title")}
					</Typography>
					<Typography sx={{ color: "white", fontWeight: 700 }}>
						{t("workshop_backtest_settings_main_text")}
					</Typography>
				</Grid>
				<Grid item>
					<Button
						variant="contained"
						color="primary"
						sx={{ mt: "110px", mr: "24px" }}
						onClick={() => setOpen(true)}
					>
						Let's begin
					</Button>
					{open && <BacktestDialog open={open} onClose={() => setOpen(false)} />}
				</Grid>
			</Grid>
		</div>
	);
}
