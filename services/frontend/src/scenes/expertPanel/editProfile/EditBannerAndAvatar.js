import React from "react";

import { Box, Button } from "@mui/material";

import { noBannerCover, uriPrimeGray } from "images";

export default function EditBannerAndAvatar({ banner, avatar, onBannerImageChange, onAvatarImageChange }) {
	return (
		<Box sx={{ position: "relative" }}>
			<Box sx={{ width: "100%", height: "200px" }}>
				<Box
					component="div"
					width={"100%"}
					height={"inherit"}
					display="block"
					sx={{
						backgroundImage: `url(${banner || noBannerCover})`,
						backgroundSize: "cover",
						backgroundRepeat: "no-repeat",
					}}
				>
					<Box sx={{ position: "absolute", top: "0", right: "0" }}>
						<Button
							component="label"
							htmlFor="banner"
							sx={{ color: "#fff", padding: "16px", textDecoration: "underline" }}
						>
							+ Add New Cover
						</Button>
					</Box>
				</Box>
				<input hidden onChange={onBannerImageChange} type="file" id="banner" name="banner" />
			</Box>
			<Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
				<Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
					<Box
						sx={{
							width: "82px",
							height: "82px",
							border: "4px solid #F4F5FC",
							borderRadius: "100%",
							backgroundColor: "#fff",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							backgroundImage: `url(${avatar || uriPrimeGray})`,
							backgroundSize: avatar ? "100%" : "42px",
							backgroundRepeat: "no-repeat",
							backgroundPosition: "center",
						}}
					>
						{/* <Box
							component="img"
							width={avatar && avatar.image ? "100%" : "42px"}
							height={avatar && avatar.image ? "100%" : "51px"}
							src={avatar && avatar.image ? avatar.image : uriPrimeGray}
						/> */}
					</Box>
					<Button
						component="label"
						sx={{ color: "#fff", padding: "0", textDecoration: "underline" }}
						htmlFor="avatar"
					>
						Edit Profile Photo
					</Button>
				</Box>
				<input hidden onChange={onAvatarImageChange} type="file" id="avatar" name="avatar" />
			</Box>
		</Box>
	);
}
