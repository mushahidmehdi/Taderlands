import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { Button, Grid, Paper, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

const CreateTypeCard = ({ title, text, color, comingSoon, actions }) => {
	const navigate = useNavigate();

	return (
		<Paper sx={{ mt: 2, backgroundColor: color, padding: 2 }} variant="outlined">
			<Grid container>
				<Grid item xs={6}>
					<Typography sx={{ mt: 2, fontSize: "16px", color: (theme) => theme.palette.primary.main }}>
						{title}
					</Typography>
				</Grid>
				<Grid item xs={6}>
					{comingSoon && <Typography sx={{ mt: 2, fontSize: "16px" }}>Coming Soon</Typography>}
				</Grid>
				<Grid item xs={12}>
					<Typography sx={{ mt: 1, fontSize: "14px" }}>{text} </Typography>
				</Grid>
				<Grid item xs={12} sx={{ mt: 2 }}>
					{actions.map((action) => (
						<Button
							variant={action?.variant ?? "contained"}
							color={comingSoon ? "secondary" : "primary"}
							sx={{ mr: 2, fontSize: "14px" }}
							disabled={comingSoon}
							onClick={() => navigate(action?.to)}
						>
							{action?.label}
						</Button>
					))}
				</Grid>
			</Grid>
		</Paper>
	);
};

export default function CreateStrategy() {
	const { strategy } = useSelector((state) => state.strategyBuilder);
	const { t } = useTranslation();

	const cards = [
		{
			title: t("workshop:workshop_main_page_option_1_title"),
			text: t("workshop:workshop_main_page_option_1_text"),
			color: "#F4F5FC",
			actions: [
				{
					label: t("workshop:workshop_main_page_option_1_button"),
					to: "/strategy-builder?initial=true",
				},
				...(strategy && strategy.strategyTypeId === 1
					? [
							{
								variant: "outlined",
								label: t("workshop:workshop_main_page_option_1_button_2"),
								to: "/strategy-builder",
							},
					  ]
					: []),
			],
			comingSoon: false,
		},
		{
			title: t("workshop:workshop_main_page_option_2_title"),
			text: t("workshop:workshop_main_page_option_2_text"),
			color: "#FFFFFF",
			actions: [
				{
					label: t("workshop:workshop_main_page_option_2_button"),
					to: "/strategy-builder?initial-tv=true",
				},
				...(strategy && strategy.strategyTypeId === 2
					? [
							{
								variant: "outlined",
								label: t("workshop:workshop_main_page_option_1_button_2"),
								to: "/strategy-builder",
							},
					  ]
					: []),
			],
			comingSoon: false,
		},
	];

	return (
		<React.Fragment>
			{cards.map(({ title, text, color, actions, comingSoon }, ix) => (
				<CreateTypeCard
					key={ix}
					title={title}
					text={text}
					color={color}
					actions={actions}
					comingSoon={comingSoon}
				/>
			))}
		</React.Fragment>
	);
}
