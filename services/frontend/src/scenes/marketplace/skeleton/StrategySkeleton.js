import React from "react";

import { Card } from "@mui/material";
import Skeleton from "@mui/material/Skeleton";
import { Box } from "@mui/system";

const StrategySkeleton = () => {
	return Array.from({ length: 12 }, (_, i) => i + 1).map(() => (
		<Card
			sx={{
				height: "390px",
				borderRadius: "0.5rem",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				flex: 1,
				minWidth: "281.6px",
				maxWidth: "312.6px",
			}}
		>
			<Box marginTop={"1.2rem"}>
				<Skeleton variant="circular" width={80} height={80} />
			</Box>
			<Box
				sx={{
					marginBlockStart: "2rem",
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "space-between",
					width: "100%",
				}}
			>
				<Skeleton
					gutterBottom
					sx={{
						color: "#0F20E8",
						fontSize: "1rem",
						fontWeight: 700,
						lineHeight: "1rem",
						maxWidth: "10rem",
						textAlign: "center",
						width: "100%",
						height: "3rem",
					}}
				/>
				<Skeleton
					sx={{
						color: "#AEAEAE",
						fontSize: "0.9rem",
						fontWeight: 500,
						lineHeight: "1rem",
						marginBlock: "0.6rem",
						width: "30%",
						height: "1rem",
					}}
				/>
				<Skeleton
					sx={{
						fontSize: "1rem",
						fontWeight: 300,
						lineHeight: "1rem",
						color: "#3A3A3A",
						marginBlockEnd: "1rem",
						width: "80%",
						height: "2rem",
					}}
				/>
			</Box>

			<Box
				sx={{
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					gap: "0.4rem",
				}}
			>
				<Skeleton
					variant="text"
					sx={{
						backgroundColor: "#F4F5FC",
						paddingBlock: "0.05rem",
						paddingInline: "0.7rem",
						borderRadius: "4px",
					}}
				/>
				<Skeleton
					variant="text"
					sx={{
						backgroundColor: "#0F20E8",
						color: "#fff",
						paddingBlock: "0.01rem",
						paddingInline: "0.7rem",
						borderRadius: "4px",
						"&:hover": {
							backgroundColor: "#6F79F1",
						},
					}}
				/>
			</Box>
			<Skeleton
				sx={{
					width: "16rem",
					maxWidth: "100%",
					marginTop: "1rem",
					backgroundColor: "#F4F5FC",
					height: "4rem",
				}}
			/>
		</Card>
	));
};

export default StrategySkeleton;
