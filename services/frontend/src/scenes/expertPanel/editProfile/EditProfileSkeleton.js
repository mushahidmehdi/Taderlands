import React from "react";

import { Box, Card, Skeleton } from "@mui/material";

const EditProfileSkeleton = () => {
	return (
		<Card
			sx={{
				borderRadius: "0.5rem",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				marginBlockStart: "1rem",
				paddingBlockEnd: "5rem",
				paddingInline: "1rem",
			}}
		>
			<Box marginTop={"1.2rem"}>
				<Skeleton variant="circular" width={80} height={80} />
			</Box>

			<Skeleton
				sx={{
					width: "90%",
					lineHeight: "1rem",
					marginBlockStart: "2rem",
				}}
			/>
			<Skeleton
				sx={{
					width: "90%",
					lineHeight: "1rem",
				}}
			/>
			<Skeleton
				sx={{
					alignItems: "center",
					width: "60%",
					lineHeight: "1rem",
				}}
			/>

			<Box
				sx={{
					display: "flex",
					justifyContent: "space-around",
					width: "100%",
					marginBlockStart: "2rem",
				}}
			>
				<Skeleton
					sx={{
						width: "30%",
						height: "2.4rem",
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
	);
};

export default EditProfileSkeleton;
