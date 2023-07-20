import { useTranslation } from "react-i18next";

import { Box, Button, Typography } from "@mui/material";

import { tradingStatusRatios } from "./config";

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

export const PublishStrategyStatusTable = ({ data }) => {
	const { t } = useTranslation("expertPanel");

	return (
		<Box
			sx={{
				backgroundColor: "#FAFAFE",
				width: "88%",
				padding: "1rem",
				borderRadius: "0.3rem",
			}}
		>
			{Object.keys(data?.metrics ?? {}).map((key, ix) => (
				<>
					{tradingStatusRatios(t)?.[key] ? (
						<StatusRow
							key={ix}
							minValue={tradingStatusRatios(t)?.[key].minValue}
							value={
								data?.metrics?.[key] !== null && data?.metrics?.[key] !== undefined
									? data?.metrics?.[key]
									: "-"
							}
							title={tradingStatusRatios(t)?.[key].title}
						/>
					) : (
						<> </>
					)}
				</>
			))}

			{data?.status?.result_text && <StatusRow title={"Result"} resultText={data?.status?.result_text} />}
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
			{value && minValue && (
				<Typography
					sx={{
						color: value > minValue || value === minValue ? "#0F20E8" : "#898989",
						fontSize: "14px",
						fontWeight: 700,
					}}
				>
					{`${
						value !== null && value !== undefined
							? value > minValue
								? value + "  >  " + minValue
								: value < minValue
								? value + "  <  " + minValue
								: value + " = " + minValue
							: ""
					}`}
				</Typography>
			)}
			{resultText?.en && (
				<Typography
					sx={{
						color:
							`${resultText?.en}` === "REJECTED"
								? "red"
								: `${resultText?.en}` === "ACCEPTED"
								? "green"
								: "#898989",
						fontSize: "14px",
						fontWeight: 700,
					}}
				>
					{resultText?.en}
				</Typography>
			)}
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
