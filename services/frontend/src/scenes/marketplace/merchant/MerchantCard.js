import { useTranslation } from "react-i18next";

import { Avatar, Card, CardContent, CardMedia, Grid, Typography } from "@mui/material";

import {
	LinkedinBlue as Linkedin,
	TradingViewIconBlue as TradingView,
	TwitterIconBlue as Twitter,
	YoutubeIconBlue as Youtube,
} from "images";

function windowOpen(url, name, specs) {
	if (!url.match(/^https?:\/\//i)) {
		url = "http://" + url;
	}
	return window.open(url, name, specs);
}

export default function MerchantCard({ merchant }) {
	const { t, i18n } = useTranslation();
	return (
		<>
			<Card sx={{ ml: "5px" }}>
				<CardMedia component="img" height="130px" image={merchant?.bannerPictureUrl} />
				<CardContent
					sx={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						textAlign: "center",
					}}
				>
					<Avatar
						src={merchant?.profilePictureUrl}
						sx={{ width: "130px", height: "130px", mt: "-80px", border: "2px solid white" }}
					/>
					<Typography fontWeight={"bold"} sx={{ fontSize: "24px" }}>
						{merchant?.nickname}
					</Typography>
					<Grid container columnSpacing={"8"} justifyContent={"center"}>
						{merchant?.socialLinks &&
							merchant?.socialLinks
								?.filter((x) => x.link)
								.map((socialMedia, index) => {
									return (
										<Grid item key={index}>
											{socialMedia.source === "twitter" && (
												<Twitter
													onClick={() =>
														windowOpen(socialMedia.link, "_blank", "noopener,noreferrer")
													}
												/>
											)}
											{socialMedia.source === "youtube" && (
												<Youtube
													onClick={() =>
														windowOpen(socialMedia.link, "_blank", "noopener,noreferrer")
													}
												/>
											)}
											{socialMedia.source === "linkedin" && (
												<Linkedin
													onClick={() =>
														windowOpen(socialMedia.link, "_blank", "noopener,noreferrer")
													}
												/>
											)}
											{socialMedia.source === "tradingview" && (
												<TradingView
													onClick={() =>
														windowOpen(socialMedia.link, "_blank", "noopener,noreferrer")
													}
												/>
											)}
										</Grid>
									);
								})}
						{merchant?.bio &&
							merchant?.bio?.map((bio, index) => {
								return (
									<Grid item xs={12} key={index}>
										<Typography sx={{ fontSize: "14px" }}>{bio.text}</Typography>
									</Grid>
								);
							})}
					</Grid>
				</CardContent>
			</Card>
		</>
	);
}
