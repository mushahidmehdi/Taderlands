import React from "react";

import Skeleton from "@mui/material/Skeleton";
import { Box } from "@mui/system";

const NotificationSkeleton = () => {
	return (
		<Box
			sx={{
				backgroundColor: "#fff",
				padding: "1rem",
				paddingBlockEnd: "0",
			}}
		>
			<Box
				sx={{
					backgroundColor: "#fff",
					borderBottom: "1px solid #CFD2FA",
				}}
			>
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
					}}
				>
					<Skeleton
						sx={{
							width: "20%",
						}}
					/>
				</Box>
				<Skeleton
					sx={{
						height: "3rem",
						width: "70%",
					}}
				/>

				<Skeleton
					sx={{
						width: "10%",
					}}
				/>
			</Box>
		</Box>
	);
};

export default NotificationSkeleton;
