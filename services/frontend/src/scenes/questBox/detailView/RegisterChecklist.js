import React from "react";
import { useTranslation } from "react-i18next";

import { Typography, Box } from "@mui/material";

import { StepperEye, CartCheck } from "images";

import Dots from "./Dots";

const RegisterChecklist = ({ checklist, eligibityStatus, completedList }) => {
	const { i18n } = useTranslation();

	return (
		<Box marginTop={9}>
			<Typography fontWeight={700} gutterBottom>
				To Sign up
			</Typography>

			{checklist.map((step, index) => (
				<Box display="flex" flexDirection="column" justifyContent="flex-start">
					<Box display="flex">
						{completedList?.[index].completed ? (
							<CartCheck />
						) : eligibityStatus?.[index].completed ? (
							<CartCheck />
						) : (
							<StepperEye />
						)}

						<Typography color="primary" fontSize={12} marginX={2}>
							{step.description?.[i18n.resolvedLanguage]}
						</Typography>
					</Box>

					{index + 1 !== checklist.length && (
						<Box display="flex" flexDirection="column" gap={1} marginY={1} marginX={1}>
							<Dots />
							<Dots />
							<Dots />
						</Box>
					)}
				</Box>
			))}
		</Box>
	);
};

export default RegisterChecklist;
