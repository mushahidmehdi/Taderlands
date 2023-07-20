import React from "react";
import { useNavigate } from "react-router-dom";

import { Box, Grid, Typography } from "@mui/material";

import RankIcon from "./RankIcon";

const ListItem = ({ leaderboard, tierList }) => {
	const { rank, score, email, previousRank, tier, totalVolume } = leaderboard ?? {};

	return (
		<Grid
			item
			xs={12}
			sx={{
				border: "1px solid #0F20E8",
				borderRadius: "28px",
				height: "56px",
				px: "32px",
				pt: "8px",
				mb: "16px",
			}}
		>
			<Grid container justifyContent="space-between">
				<Grid item>
					<Grid container>
						<Grid item xs={3}>
							<div style={{ marginTop: "4px" }}>
								<Grid container spacing={1}>
									<Grid item>
										<div style={{ width: "16px" }}>
											<RankIcon previousRank={previousRank} rank={rank} />
										</div>
									</Grid>
									<Grid item>
										<Typography sx={{ fontSize: "18px", fontWeight: 700, width: "18px" }}>
											{rank}
										</Typography>
									</Grid>
								</Grid>
							</div>
						</Grid>
						<Grid item xs={3}>
							<img src={`https://cdn2.paratica.com/general/dashboard-icons/ori_tier_${tier}.svg`} />
						</Grid>
						<Grid item xs={6}>
							<Typography color="primary" sx={{ fontSize: "14px" }}>
								{email}
							</Typography>
							<Typography sx={{ fontSize: "10px", fontWeight: 500 }}>{`Score: ${
								score ? Number(score).toFixed(4) : "-"
							} `}</Typography>
						</Grid>
					</Grid>
				</Grid>
				<Grid item>
					<Typography
						sx={{
							color: (theme) => theme.palette.success.main,
							fontSize: "16px",
							fontWeight: 700,
							textAlign: "right",
						}}
					>
						{tierList[tier]?.reward}
					</Typography>
					<Typography sx={{ fontSize: "10px", fontWeight: 500, color: "#3A3A3A" }}>
						Volume: ${totalVolume}
					</Typography>
				</Grid>
			</Grid>
		</Grid>
	);
};

export default function List({ top5, tierList, id }) {
	const navigate = useNavigate();

	return (
		<Grid item xs={12}>
			<Box sx={{ minWidth: "375px" }}>
				<Grid container>
					{top5 && top5.map((item, ix) => <ListItem key={ix} leaderboard={item} tierList={tierList} />)}
					<Grid item xs={12}>
						<Typography
							color="primary"
							onClick={() => navigate(`/quest-box/${id}/full-list`)}
							sx={{
								textAlign: "center",
								fontWeight: 700,
								textDecoration: "underline",
								cursor: "pointer",
							}}
						>
							See full list
						</Typography>
						<Typography sx={{ fontSize: "10px", textAlign: "center", mt: 2 }}>
							*Values refreshed on hourly basis
						</Typography>
					</Grid>
				</Grid>
			</Box>
		</Grid>
	);
}
