import React from "react";
import { useTranslation } from "react-i18next";

import { Box, Button, Typography } from "@mui/material";

export const PublishStrategyTitle = ({ children }) => {
	return (
		<Typography
			gutterBottom
			sx={{
				fontSize: "24px",
				fontWeight: 700,
				lineHeight: "1.8rem",
			}}
		>
			{children}
		</Typography>
	);
};

export const PublishStrategyParagraphText = ({ children }) => {
	return (
		<Typography
			gutterBottom
			sx={{
				fontSize: "14px",
				fontWeight: 400,
				lineHeight: "18px",
				textAlign: "center",
				paddingInline: "1rem",
				marginBlockEnd: "1rem",
			}}
		>
			{children}
		</Typography>
	);
};

export const PublishStrategyStatusTable = ({ children, data }) => {
	return (
		<Box
			sx={{
				backgroundColor: "#FAFAFE",
				width: "88%",
				padding: "1rem",
				borderRadius: "0.3rem",
			}}
		>
			{children.map(({ key, value, minValue }, idx) => {
				return (
					<StatusRow minValue={minValue} value={data ? data.metrics[value] : value} title={key} key={idx} />
				);
			})}

			{data && (
				<StatusRow
					value={data ? data.status.result : ""}
					title={"Result"}
					resultText={data ? data.status.result_text : ""}
				/>
			)}
		</Box>
	);
};

export const StrategyPublishStatusResult = ({ children }) => {
	const { i18n } = useTranslation();

	return (
		<Typography
			sx={{
				color: "#6A1FC2",
				fontSize: "14px",
				fontWeight: 700,
				lineHeight: "16px",
				marginBlockStart: "2rem",
			}}
		>
			{children[i18n.resolvedLanguage]}
		</Typography>
	);
};

const StatusRow = ({ minValue, value, title, resultText }) => {
	const { i18n } = useTranslation();
	return (
		<Box
			sx={{
				display: "flex",
				justifyContent: "space-between",
				padding: "0.4rem",
			}}
		>
			<Typography
				sx={{
					fontSize: "14px",
					fontWeight: 700,
					lineHeight: "16px",
				}}
			>
				{title}
			</Typography>
			<Typography
				sx={{
					color:
						value > `${minValue}`
							? "#0F20E8"
							: `${value}` === "REJECTED"
							? "red"
							: `${value}` === "ACCEPTED"
							? "green"
							: "#898989",
					fontSize: "14px",
					fontWeight: 700,
					lineHeight: "16px",
				}}
			>
				{`${
					resultText?.en
						? resultText[i18n.resolvedLanguage]
						: value
						? value > minValue
							? value + "  >  " + minValue
							: value < minValue
							? value + "  <  " + minValue
							: value
						: ""
				}`}
			</Typography>
		</Box>
	);
};

export const PublishStrategyButton = ({ children, variant, handleOnClick }) => {
	return (
		<Button
			variant={variant}
			sx={{
				width: "88%",
				marginBlockStart: "1rem",
				paddingBlock: "0.8rem",
			}}
			onClick={handleOnClick}
		>
			{children}
		</Button>
	);
};
