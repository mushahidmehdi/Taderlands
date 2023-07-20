import React from "react";

import { Card } from "@mui/material";
import Skeleton from "@mui/material/Skeleton";
import { Box } from "@mui/system";

const ExpertSkeleton = () => {
	return Array.from({ length: 12 }, (_, i) => i + 1).map(() => (
		<Card
			sx={{
				height: "240px",
				width: "209px",
				borderRadius: "0.5rem",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				minWidth: "16rem",
				maxWidth: "18rem",
				position: "relative",
				flex: 1,
			}}
		>
			<Box marginTop={"1.2rem"}>
				<Skeleton variant="circular" width={80} height={80} />
			</Box>

			<Skeleton
				sx={{
					width: "70%",
					lineHeight: "2rem",
				}}
			/>

			<Box
				sx={{
					display: "flex",
					justifyContent: "center",
					gap: "0.2rem",
					alignItems: "center",
				}}
			>
				<Skeleton
					color="primary"
					sx={{
						backgroundColor: "#6F79F1",
						color: "#fff",
						paddingBlockStart: "0.1rem",
						paddingBlockEnd: "0.0rem",
						paddingInline: "1rem",
						borderRadius: "4px",
						marginBlock: "0.3rem",
					}}
				/>
				<Skeleton
					color="primary"
					sx={{
						backgroundColor: "#0F20E8",
						paddingBlockStart: "0.1rem",
						paddingInline: "1rem",
						borderRadius: "4px",
						marginBlock: "0.3rem",
					}}
				/>
			</Box>
			<Box
				sx={{
					display: "flex",
					justifyContent: "space-around",
					width: "100%",
				}}
			>
				<Skeleton
					sx={{
						width: "30%",
						height: "3rem",
					}}
				/>
				<Skeleton
					sx={{
						width: "30%",
					}}
				/>
				<Skeleton
					sx={{
						width: "30%",
					}}
				/>
			</Box>
		</Card>
	));
};

export default ExpertSkeleton;
