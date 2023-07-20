import { useTranslation } from "react-i18next";

import { Grid, Typography } from "@mui/material";

export default function PublishState({ isPublished, isMaintenance }) {
	const { t } = useTranslation("expertPanel");
	return (
		<Grid container>
			<Grid item xs={12} width={8}>
				{isPublished ? (
					isMaintenance ? (
						<Typography
							color={"#FFAB00"}
							sx={{
								fontSize: "12px",
								fontWeight: 700,
								lineHeight: "16px",
							}}
						>
							{t("expert_panel_stragies_table_maintenance_text")}
						</Typography>
					) : (
						<Typography
							color={"#36B37E"}
							sx={{
								fontSize: "12px",
								fontWeight: 700,
								lineHeight: "16px",
							}}
						>
							{t("expert_panel_stragies_table_published_text")}
						</Typography>
					)
				) : (
					<Typography
						color={"#AEAEAE"}
						sx={{
							fontSize: "12px",
							fontWeight: 700,
							lineHeight: "16px",
						}}
					>
						{t("expert_panel_stragies_table_unpublished_text")}
					</Typography>
				)}
			</Grid>
		</Grid>
	);
}
