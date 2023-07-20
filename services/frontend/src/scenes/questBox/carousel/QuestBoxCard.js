import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { Box, Button, Card, Grid, Typography } from "@mui/material";

import dayjs from "dayjs";

import { ProperCheck } from "images";

export const handleDateRange = (start, end) => {
	const dateEnd = dayjs(end);
	return dateEnd.diff(start, "days") + " days";
};

const QuestBoxCard = ({ data, campaignAttendance }) => {
	const navigate = useNavigate();
	const { i18n } = useTranslation();

	return (
		<Card
			sx={{
				minWidth: "630px",
				borderRadius: "1rem",
				padding: "1rem",
				cursor: "pointer",
				marginBlockEnd: "1rem",
			}}
			onClick={() => navigate(`/quest-box/${data.id}/details`)}
		>
			<Grid container spacing={1}>
				<Grid item xs={12}>
					<Grid container justifyContent="space-between">
						<Grid item xs={7}>
							<Typography
								color="primary"
								sx={{
									fontSize: "1.6rem",
									fontWeight: 700,
									lineHeight: "1.7rem",
								}}
							>
								{data.title?.[i18n.resolvedLanguage]}
							</Typography>
						</Grid>
						{campaignAttendance?.campaignId === data.id && (
							<Grid item>
								<Grid
									container
									sx={{
										bgcolor: (theme) => theme.palette.success.main,
										color: "#fff",
										pt: "6px",
										px: "8px",
										borderRadius: "4px",
									}}
								>
									<Grid item>
										<ProperCheck color="#fff" />
									</Grid>
									<Grid item>
										<Typography
											sx={{
												fontSize: "12px",
												ml: 1,
											}}
										>
											Signed Up
										</Typography>
									</Grid>
								</Grid>
							</Grid>
						)}
					</Grid>
				</Grid>
				<Grid item xs={7}>
					<Box>
						<Typography
							color="primary"
							sx={{
								fontSize: "12px",
								lineHeight: "1.7rem",
								padding: "0 7px",
								backgroundColor: "#F4F5FC",
								borderRadius: "0.2rem",
								marginBlock: "0.6rem",
								display: "inline-block",
							}}
						>
							{data.scope}
						</Typography>
					</Box>

					<Button variant="contained"> Prize : {data.prize?.[i18n.resolvedLanguage]}</Button>

					<Box marginBlock="1rem">
						<Box display="flex">
							<Typography sx={{ marginInlineEnd: "0.5rem" }} fontSize="0.9rem">
								Signup by :
							</Typography>
							<Typography color={"#3A3A3A"} fontWeight="700">
								{dayjs(data.startDate).format("MMMM D, YYYY")}
							</Typography>
						</Box>

						<Box display="flex">
							<Typography sx={{ marginInlineEnd: "0.5rem" }} fontSize="0.9rem">
								Quest period :
							</Typography>
							<Typography color={"#3A3A3A"} fontWeight="700">
								{handleDateRange(data.startDate, data.endDate)}
							</Typography>
						</Box>
					</Box>
					<Typography color={"#3A3A3A"} width="100%" fontSize="0.8rem">
						💰
						{data.description?.[i18n.resolvedLanguage]}
					</Typography>
					<Typography color="primary" fontSize={"1rem"} fontWeight={700} width="100%" marginTop={2}>
						Pool Size : {data.attendeeCount}/{data.maxAttendeeCount}
					</Typography>
				</Grid>

				<Grid item xs={5} display="flex" alignItems="center">
					<img src={data.bannerUrl} alt="" />
				</Grid>
			</Grid>
		</Card>
	);
};

export default QuestBoxCard;
