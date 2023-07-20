import { useTranslation } from "react-i18next";

import { Box, CardContent, Grid, Typography } from "@mui/material";

export default function ProfileCardBio({ bioContent, merchantStatistics }) {
	const { t } = useTranslation("expertPanel");

	return (
		<>
			<CardContent>
				<Grid
					container
					sx={{
						display: "flex",
						alignContent: "center",
						justifyContent: "space-evenly",
					}}
				>
					<Grid item>
						<Box
							sx={{
								textAlign: "center",
							}}
						>
							<Typography fontWeight={"Bold"}>{merchantStatistics?.positionsCount}</Typography>
							<Typography>{t("expert_panel_profile_card_positions_count")}</Typography>
						</Box>
					</Grid>
					<Grid item>
						<Box
							sx={{
								padding: "0 24px",
								textAlign: "center",
								borderInline: "1px solid #AEAEAE",
							}}
						>
							<Typography fontWeight={"Bold"}> {merchantStatistics?.successRate} % </Typography>
							<Typography>{t("expert_panel_profile_card_success_rate")}</Typography>
						</Box>
					</Grid>
					<Grid item>
						<Box
							sx={{
								textAlign: "center",
							}}
						>
							<Typography fontWeight={"Bold"}>{merchantStatistics?.followersCount}</Typography>
							<Typography>{t("expert_panel_profile_card_follower_count")}</Typography>
						</Box>
					</Grid>
				</Grid>
			</CardContent>
			<CardContent sx={{ padding: "16px 30px" }}>
				<Typography
					textAlign={"center"}
					whiteSpace={"pre-wrap"}
					dangerouslySetInnerHTML={{
						__html: bioContent,
					}}
				></Typography>
			</CardContent>
		</>
	);
}
