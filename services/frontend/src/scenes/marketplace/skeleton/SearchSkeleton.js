import React from "react";

import Skeleton from "@mui/material/Skeleton";
import { Box } from "@mui/system";

const SearchSkeleton = () => {
	return (
		<Box
			sx={{
				width: "100%",
				borderRadius: "0.6rem",
				display: "flex",
				flexGrow: 1,
				alignItems: "center",
				marginInline: "auto",
				marginBlockEnd: "2rem",
				backgroundColor: "#fff",
				height: "4rem",
			}}
		>
			<Box
				width={"10%"}
				sx={{
					marginInlineStart: "1rem",
				}}
			>
				<Skeleton variant="text" sx={{ fontSize: "1rem" }} />
			</Box>
			<Box
				width={"30%"}
				sx={{
					marginInlineStart: "1rem",
				}}
			>
				<Skeleton variant="text" sx={{ fontSize: "1rem" }} />
			</Box>
		</Box>
	);
};

export default SearchSkeleton;
