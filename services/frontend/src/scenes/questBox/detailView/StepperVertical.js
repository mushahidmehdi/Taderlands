import React from "react";
import { useTranslation } from "react-i18next";

import { Typography } from "@mui/material";
import { Box } from "@mui/system";

import ProgressBar from "./ProgressBar";

const StepperVertical = ({ claim, checkCampaignStatus }) => {
	const barColor = checkCampaignStatus?.checklist?.claim?.stepsStatus;

	const { i18n } = useTranslation();

	return (
		<Box display="flex" justifyContent="center" flexDirection="column" alignItems="center">
			{claim?.claim.steps.map((reward) => (
				<>
					<Typography
						fontSize="16px"
						fontWeight={700}
						marginTop={4}
						sx={{
							color: `${barColor ? "#12c15a" : "#CFD2FA"}`,
						}}
					>
						{reward?.description[i18n.resolvedLanguage]}
					</Typography>
					<ProgressBar barColor={barColor} />
				</>
			))}
		</Box>
	);
};

export default StepperVertical;
