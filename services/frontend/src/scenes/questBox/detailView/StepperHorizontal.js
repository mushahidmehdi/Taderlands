import React from "react";
import { useTranslation } from "react-i18next";

import { Typography } from "@mui/material";
import { Box } from "@mui/system";

import { StepperEye } from "images";

import Dash from "./Dash";

const StepperHorizontal = ({ claim }) => {
	const { i18n } = useTranslation();
	return (
		<Box display="flex" justifyContent="center" width="100%">
			{claim?.steps?.map((reward, index) => (
				<>
					<Box>
						<Typography fontSize={12} fontWeight={700} color="primary">
							{reward?.description[i18n.resolvedLanguage]}
						</Typography>
						<StepperEye />
						<Typography fontSize={12} fontWeight={700} color="primary">
							{reward?.reward}
						</Typography>
					</Box>
					{index !== claim?.steps.length - 1 && <Dash />}
				</>
			))}
		</Box>
	);
};

export default StepperHorizontal;
