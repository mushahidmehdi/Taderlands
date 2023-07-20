import React from "react";

import { Button } from "@mui/material";

import dayjs from "dayjs";

const btnStyle = {
	padding: "0.8rem 6rem",
	marginBlock: "1rem",
};

export default function ClaimButton({
	campaign,
	campaignAttendance,
	eligibityStatus,
	countdown,
	disabled,
	onCheckEligibity,
	onCheckUserCampaignStatus,
	onClaimReward,
	onCreateCampaignAttendance,
}) {
	if (!campaign) {
		return;
	}

	const { startDate, endDate } = campaign ?? {};

	const hasPassed = dayjs(endDate).isBefore(dayjs());
	const hasStarted = dayjs(startDate).isBefore(dayjs());

	if (hasPassed) {
		return (
			<Button sx={btnStyle} variant="contained" disabled>
				{!campaignAttendance || (campaignAttendance?.status === "SIGNED" && "Campaign ended")}
				{campaignAttendance?.status === "COMPLETED" && "Completed"}
				{campaignAttendance?.status === "CLAIMED" && "Claimed"}
			</Button>
		);
	}

	if (!campaignAttendance) {
		if (eligibityStatus?.register.status) {
			return (
				<Button sx={btnStyle} variant="contained" onClick={() => onCreateCampaignAttendance()}>
					Sign Up
				</Button>
			);
		}

		return (
			<Button sx={btnStyle} variant="contained" disabled={disabled} onClick={() => onCheckEligibity()}>
				{disabled ? `Wait for ${countdown} seconds` : "Check eligibity"}
			</Button>
		);
	}

	if (campaignAttendance?.status === "CLAIMED") {
		return (
			<Button sx={btnStyle} variant="contained" disabled>
				Claimed
			</Button>
		);
	}

	if (campaignAttendance?.status === "SIGNED") {
		if (!hasStarted) {
			return (
				<Button sx={btnStyle} variant="contained" disabled>
					Coming Soon
				</Button>
			);
		}

		return (
			<Button sx={btnStyle} variant="contained" onClick={() => onCheckUserCampaignStatus()}>
				Check Status
			</Button>
		);
	}

	if (campaignAttendance?.status === "COMPLETED") {
		return (
			<Button
				sx={{
					padding: "0.8rem 6rem",
					marginBlock: "1rem",
					backgroundColor: campaignAttendance?.checklist?.claim?.stepsStatus ? "#12c15a" : "#CFD2FA",
				}}
				variant="contained"
				onClick={() => onClaimReward()}
			>
				Claim
			</Button>
		);
	}

	return <></>;
}
