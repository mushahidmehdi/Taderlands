import React from "react";

import Skeleton from "@mui/material/Skeleton";
import { Box } from "@mui/system";

const FeatureSkeleton = () => {
	return (
		<Box
			sx={{
				width: "60%",
				marginInlineStart: "1rem",
			}}
		>
			<Box
				sx={{
					width: "100%",
					display: "flex",
					gap: "1rem",
					height: "8rem",
					backgroundColor: "#fff",
					padding: "1rem",
					borderRadius: "1rem",
					marginBlockEnd: "1rem",
				}}
			>
				<Box
					sx={{
						width: "60%",
						display: "flex",
						flexDirection: "column",
						justifyContent: "center",
						marginInlineStart: "1rem",
					}}
				>
					<Skeleton width={"50%"} height="10%" />
					<Skeleton width={"60%"} height="10%" />
				</Box>

				<Box
					sx={{
						width: "100%",
					}}
				>
					<Skeleton width={"100%"} height="100%" />
				</Box>

				<Box
					sx={{
						width: "60%",
						display: "flex",
						flexDirection: "column",
						justifyContent: "center",
						marginInlineStart: "1rem",
					}}
				>
					<Skeleton width={"50%"} height="10%" />
					<Skeleton width={"60%"} height="10%" />
				</Box>

				<Box
					sx={{
						width: "100%",
					}}
				>
					<Skeleton width={"100%"} height="100%" />
				</Box>
			</Box>
			<Box
				sx={{
					width: "100%",
					height: "8.6rem",
					gap: "1",
					display: "flex",
					backgroundColor: "#fff",
					padding: "1rem",
					borderRadius: "1rem",
				}}
			>
				<Box
					sx={{
						width: "60%",
						display: "flex",
						flexDirection: "column",
						justifyContent: "center",
						marginInlineStart: "1rem",
					}}
				>
					<Skeleton width={"50%"} height="10%" />
					<Skeleton width={"60%"} height="10%" />
				</Box>

				<Box
					sx={{
						width: "100%",
					}}
				>
					<Skeleton width="100%" height="100%" />
				</Box>
			</Box>
		</Box>
	);
};

export default FeatureSkeleton;
