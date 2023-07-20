import { useContext } from "react";

import { Grid, Paper, Typography } from "@mui/material";

import { explorerMode1, explorerMode2 } from "images";

import { ReferralContext } from "../Main";

export const Right = () => {
	const { setOpen } = useContext(ReferralContext);

	return (
		<Paper
			sx={{
				borderRadius: "8px",
				padding: "1.2rem",
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				textAlign: "center",
				verticalAlign: "middle",
			}}
		>
			<Grid container spacing={2}>
				<Grid item xs={12}>
					<img src={explorerMode2} alt="explorerMode2" />
				</Grid>
				<Grid item xs={12}>
					<Typography color="primary" sx={{ fontSize: "16px", fontWeight: "bold" }}>
						Full Access
					</Typography>
				</Grid>
				<Grid item xs={12}>
					<Typography fontSize={14}>
						Experience Traderlands features in full before the mass launch as one of our valued early
						adopters!
					</Typography>
				</Grid>
				<Grid item xs={12}>
					<Typography
						color="primary"
						fontWeight="bold"
						fontSize={14}
						sx={{ cursor: "pointer", textDecoration: "underline" }}
						onClick={() => setOpen(true)}
					>
						Enter Referral Code
					</Typography>
				</Grid>
			</Grid>
		</Paper>
	);
};

export const Left = () => {
	const list = [
		"View Strategy Performances on Marketplace",
		"Explore Strategy Creators' Profiles",
		"Check out QuestBox for upcoming campaigns",
		"Access your Account Dashboard and Profile Settings",
		"Stay updated with Notifications",
	];

	return (
		<Paper sx={{ borderRadius: "8px", padding: "1.2rem", height: "100%" }}>
			<Typography sx={{ fontWeight: "bold", fontSize: "18px" }}>Explorer Mode</Typography>

			<Typography sx={{ mt: 1, fontSize: "14px", width: "90%", lineHeight: "1.5rem" }}>
				Embark on Your Traderlands Adventure in Explorer Mode. Get a sneak peek of Traderlands before the
				official launch in just a few weeks! Experience a limited version of our platform or upgrade your status
				to Referral-Only Mode with a referral code.
			</Typography>

			<Typography sx={{ mt: 2, fontSize: "14px" }}>In Explorer Mode you can:</Typography>

			<Grid container>
				<Grid item xs={10}>
					<ul style={{ marginTop: "16px" }}>
						{list.map((item, ix) => (
							<li key={ix} style={{ fontWeight: "bold", fontSize: "14px", marginTop: "8px" }}>
								{item}
							</li>
						))}
					</ul>
				</Grid>
				<Grid item xs={2}>
					<img src={explorerMode1} alt="explorerMode1" />
				</Grid>
			</Grid>
		</Paper>
	);
};
