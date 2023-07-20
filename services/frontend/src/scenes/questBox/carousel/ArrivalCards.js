import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { Box, Button, Card, Typography } from "@mui/material";

import { AlgorithmicTradeMadeSimple } from "images";

const ArrivalCards = ({ campaign }) => {
	const { i18n } = useTranslation();

	const lang = i18n.resolvedLanguage;

	const navigate = useNavigate();

	return (
		<Card
			sx={{
				display: "flex",
				justifyContent: "space-between",
				alignItems: "flex-start",
				borderRadius: "1.1rem",
				height: "10rem",
				minWidth: "488px",
				maxWidth: "100%",
				paddingBlockStart: "1rem",
			}}
		>
			<Box padding="0.8rem">
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
					}}
				>
					<Typography
						variant="h3"
						sx={{
							fontSize: "1rem",
							fontWeight: 700,
							color: "#0F20E8",
							maxWidth: "100%",
							marginInlineEnd: "0.5rem",
							width: "14rem",
						}}
					>
						{campaign.title[lang]}
					</Typography>

					<Button
						sx={{
							backgroundColor: "#F4F5FC",
							height: "2rem",
							lineHeight: "1rem",
							width: "8rem",
						}}
					>
						Coming soon
					</Button>
				</Box>

				<Typography color="#3A3A3A" fontSize="12px">
					{campaign.description[lang]}
				</Typography>
			</Box>

			<div>
				<AlgorithmicTradeMadeSimple
					style={{
						width: "6rem",
						marginInlineEnd: "2rem",
					}}
				/>
			</div>
		</Card>
	);
};

export default ArrivalCards;
