import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { Box, Button, Card, Grid, Typography } from "@mui/material";

import dayjs from "dayjs";

import { Dialog } from "components";

import { useQuestBoxApi } from "api/questBox";
import useCatchError from "api/useCatchError";

import shortenNumber from "utils/shortenNumber";

import { handleDateRange } from "../carousel/QuestBoxCard";
import { List, SelfRank } from "../leaderboard/List";
import ClaimButton from "./ClaimButton";
import ProgressBar from "./ProgressBar";
import RegisterChecklist from "./RegisterChecklist";
import StepperHorizontal from "./StepperHorizontal";
import StepperVertical from "./StepperVertical";

const btnStyle = {
	padding: "0.8rem 6rem",
	marginBlock: "1rem",
};

const ClaimRequest = ({ campaign, merchant }) => {
	const [checkCampaignStatus, setCheckCampaignStatus] = useState(null);
	const [eligibityStatus, setEligibityStatus] = useState({ register: { status: false } });
	const [countdown, setCountdown] = useState(0);
	const [open, setOpen] = useState(false);
	const [btnDisabled, setBtnDisabled] = useState(false);

	const [selfRank, setSelfRank] = useState();
	const [top5, setTop5] = useState();

	const catchError = useCatchError();
	const { i18n, t } = useTranslation("common");
	const {
		id,
		title,
		prize,
		description,
		slogan,
		startDate,
		endDate,
		bannerUrl,
		checklistTypes,
		checklist,
		forMerchant,
		maxAttendeeCount,
		leaderboardInfo,
	} = campaign ?? {};

	const {
		checkCampaignUserStatus,
		getEligibilityUserStatus,
		createCampaingAttendance,
		claimRewards,
		getLeaderboard,
		getSelfLeaderboard,
	} = useQuestBoxApi();

	const handleCheckEligibity = () => {
		getEligibilityUserStatus(id).then((status) => {
			setCountdown(60);
			setBtnDisabled(true);
			setEligibityStatus(status.data?.checklist);
		});
	};

	const handleCreateCampaignAttendance = () => {
		if (eligibityStatus?.register.status) {
			createCampaingAttendance(id)
				.catch(catchError)
				.finally(() => window.location.reload());
		}
	};

	const handleCheckUserCampaignStatus = () => {
		checkCampaignUserStatus(id)
			.then((camp) => setCheckCampaignStatus(camp?.data?.campaignAttendance))
			.catch(catchError);
	};

	const handleClaimReward = () => {
		claimRewards(id)
			.catch(catchError)
			.finally((reward) => setOpen(reward?.data?.campaignAttendance?.checklist?.claim?.stepsStatus));
	};

	const onClose = () => {
		setOpen(false);
	};

	const comingSoon = dayjs(startDate).isAfter(dayjs());

	useEffect(() => {
		checkCampaignUserStatus(id)
			.then((camp) => setCheckCampaignStatus(camp?.data?.campaignAttendance))
			.catch((e) => {
				if (e.message === "611.user campaign attendance not found") {
					return;
				}

				catchError(e);
			});
	}, []);

	useEffect(() => {
		if (leaderboardInfo && !leaderboardInfo?.placeholderUrl) {
			Promise.all([
				getLeaderboard({ campaignId: id, pageNumber: 0, pageSize: 5 }).then((data) =>
					setTop5(data?.data?.leaderboard)
				),
				getSelfLeaderboard(id).then((data) => {
					setSelfRank(data?.data?.userRank);
				}),
			]).catch(catchError);
		}
	}, [leaderboardInfo]);

	useEffect(() => {
		let timer;
		if (countdown > 0) {
			timer = setInterval(() => setCountdown(countdown - 1), 1000);
		} else {
			setBtnDisabled(false);
		}
		return () => clearInterval(timer);
	}, [countdown]);

	return (
		<Card sx={{ mt: 3 }}>
			{open && (
				<Dialog
					dialogProps={{
						open: open,
						onClose: onClose,

						sx: {
							"& .MuiDialog-paper": {
								maxHeight: "75vh",
								minHeight: "75vh",
								minWidth: "75vw",
							},
						},
					}}
					content={
						<Grid container>
							<Grid item xs={6} paddingY={12} paddingX={6}>
								<Typography fontSize={24} fontWeight={700} mb={4}>
									You did it! Quest completed the reward are yours.
								</Typography>
								<Typography fontSize={18}>
									Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus praesentium omnis
									id ipsa sequi, corrupti beatae vitae, modi incidunt alias quae reprehenderit
									delectus explicabo provident at repudiandae minima voluptatem amet.
								</Typography>

								<Typography marginTop={4} fontWeight={600}>
									Campain End Date
								</Typography>
								<Typography fontWeight={600} color="primary">
									{dayjs(endDate).format("MMMM D, YYYY")}
								</Typography>
							</Grid>
							<Grid item xs={6} display="flex" justifyContent="center" alignItems="center" height="34rem">
								<img
									src={bannerUrl}
									alt="imageUrl"
									style={{
										width: "15rem",
										marginInlineEnd: "2rem",
									}}
								/>
							</Grid>
							<Box width="100%" display="flex" justifyContent="center">
								<Button
									variant="outlined"
									sx={{
										width: "18rem",
										height: "3rem",
									}}
									onClick={() => onClose()}
								>
									Close
								</Button>
							</Box>
						</Grid>
					}
				/>
			)}
			<Grid container p={3} spacing={2} paddingTop={6}>
				<Grid item xs={6}>
					<Typography fontSize={24} fontWeight={700} color="primary" marginBottom={2}>
						{title?.[i18n.resolvedLanguage]}
					</Typography>
					<Button variant="contained">{slogan?.[i18n.resolvedLanguage]}</Button>
					<Box marginTop={2} marginBottom={2}>
						<Typography fontWeight={700}>Prize</Typography>
						<Typography>{prize?.[i18n.resolvedLanguage]}</Typography>
					</Box>

					<Box marginTop={2} marginBottom={2}>
						<Typography fontWeight={700}>Claim Date</Typography>
						<Box display="flex">
							<Typography>Signup by : </Typography>
							<Typography marginX={1} fontWeight={700}>
								{dayjs(startDate).format("MMMM D, YYYY")}
							</Typography>
						</Box>

						<Box display="flex">
							<Typography>Quest period :</Typography>
							<Typography marginX={1} fontWeight={700}>
								{handleDateRange(startDate, endDate)}
							</Typography>
						</Box>
					</Box>
					<Typography fontWeight={700} gutterBottom>
						Campaign Details
					</Typography>
					<Typography fontSize={14} maxWidth={510}>
						{description[i18n.resolvedLanguage]}
					</Typography>
					<RegisterChecklist
						checklist={checklist?.register?.steps}
						completedList={checkCampaignStatus?.checklist?.register?.steps}
						eligibityStatus={eligibityStatus?.register?.steps}
					/>
				</Grid>
				{checklistTypes.claim === 5 && (
					<Grid item xs={6}>
						{leaderboardInfo?.placeholderUrl ? (
							<img src={leaderboardInfo?.placeholderUrl} />
						) : (
							<Grid container spacing={3}>
								<SelfRank
									score={selfRank?.score}
									rank={selfRank?.rank}
									previousRank={selfRank?.previousRank}
								/>
								<List top5={top5} tierList={leaderboardInfo?.tierList} id={id} />
							</Grid>
						)}
					</Grid>
				)}
				{checklistTypes.claim !== 5 && (
					<Grid
						item
						xs={6}
						display="flex"
						flexDirection="column"
						justifyContent="center"
						gap={4}
						alignItems="center"
					>
						{checklistTypes.claim !== 5 && (
							<img
								src={bannerUrl}
								alt="imageUrl"
								style={{
									width: "15rem",
									marginInlineEnd: "2rem",
								}}
							/>
						)}

						{forMerchant && (
							<Box
								width="300px"
								height="80px"
								backgroundColor="#F4F5FC"
								display="flex"
								justifyContent="center"
								alignItems="center"
								flexDirection="column"
								paddingX={3}
								paddingY={1}
								borderRadius={2}
							>
								<Grid container justifyContent="center">
									<Grid item xs={6}>
										<Typography fontWeight={700} fontSize="10px" textAlign="center">
											Total Volume
										</Typography>
										<Typography fontWeight={700} color="primary" fontSize="16px" textAlign="center">
											$
											{shortenNumber(
												parseFloat(checkCampaignStatus?.details?.volumeGenerated ?? 0)
											)}
										</Typography>
									</Grid>
									<Grid item xs={6}>
										<Typography fontWeight={700} fontSize="10px" textAlign="center">
											Average Profit
										</Typography>
										<Typography fontWeight={700} color="primary" fontSize="16px" textAlign="center">
											{campaign?.checklistTypes?.merchant_stats &&
											merchant?.merchantCampaignProfit
												? `%${merchant?.merchantCampaignProfit?.averageProfit?.toFixed(2)}`
												: "-"}
										</Typography>
									</Grid>
								</Grid>
							</Box>
						)}

						{checklistTypes.claim === 1 && (
							<StepperVertical checkCampaignStatus={checkCampaignStatus} claim={checklist} />
						)}

						{checklistTypes.claim === 2 && <StepperHorizontal claim={checklist.claim} />}

						{checklistTypes.claim === 3 && <ProgressBar claim={checklist.claim} />}
					</Grid>
				)}
			</Grid>
			<Box p={2} display="flex" flexDirection="column" justifyContent="center" alignItems="center" gap={1}>
				<ClaimButton
					campaign={campaign}
					campaignAttendance={checkCampaignStatus}
					eligibityStatus={eligibityStatus}
					countdown={countdown}
					disabled={btnDisabled}
					onCheckEligibity={handleCheckEligibity}
					onCheckUserCampaignStatus={handleCheckUserCampaignStatus}
					onClaimReward={handleClaimReward}
					onCreateCampaignAttendance={handleCreateCampaignAttendance}
				/>

				<Typography width={390} fontSize={12} variant="h5" textAlign="center">
					This campaign is limited to {maxAttendeeCount} participants between{" "}
					{dayjs(startDate).format("MMMM D, YYYY")} to {dayjs(endDate).format("MMMM D, YYYY")}. You can go to
					<Typography
						color="primary"
						sx={{ cursor: "pointer" }}
						fontSize={12}
						variant="span"
						marginX={1}
						{...(campaign?.termsConditionsUrl && {
							onClick: () => window.open(campaign?.termsConditionsUrl, "_blank").focus(),
						})}
					>
						Terms & Conditions
					</Typography>
					to review the terms of participation.
				</Typography>
			</Box>
		</Card>
	);
};

export default ClaimRequest;
