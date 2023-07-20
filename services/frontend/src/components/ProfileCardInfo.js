import { CardContent, CardHeader, Grid } from "@mui/material";

import {
	LinkedinBlue as Linkedin,
	TradingViewIconBlue as TradingView,
	TwitterIconBlue as Twitter,
	YoutubeIconBlue as Youtube,
} from "images";

export default function ProfileCardInfo({ title, socialLinks }) {
	return (
		<CardContent>
			<CardHeader title={title} titleTypographyProps={{ sx: { textAlign: "center" } }} />
			<Grid container columnSpacing={"8"} justifyContent={"center"}>
				{socialLinks &&
					socialLinks.map((socialMedia) => {
						return (
							<Grid item>
								{socialMedia.source === "twitter" && <Twitter />}
								{socialMedia.source === "youtube" && <Youtube />}
								{socialMedia.source === "linkedin" && <Linkedin />}
								{socialMedia.source === "tradingview" && <TradingView />}
							</Grid>
						);
					})}
			</Grid>
		</CardContent>
	);
}
