import React from "react";
import { Box, CardMedia } from "@mui/material";

export default function ProfileCardMediaArea({ bannerImgUrl, profileImgUrl }) {
	return (
		<Box sx={{ position: "relative" }}>
			<CardMedia height="190" component="img" image={bannerImgUrl} />
			<Box
				sx={{
					position: "absolute",
					bottom: "-25px",
					left: "50%",
					transform: "translateX(-50%)",
				}}
			>
				<Box
					sx={{
						width: "104px",
						height: "104px",
						border: "4px solid #F4F5FC",
						borderRadius: "100%",
					}}
				>
					<CardMedia
						sx={{ borderRadius: "inherit" }}
						component="img"
						width="100%"
						height="100%"
						image={profileImgUrl}
					/>
				</Box>
			</Box>
		</Box>
	);
}
