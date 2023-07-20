import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import MuiCarousel from "react-material-ui-carousel";
import { useLocation } from "react-router-dom";

import { Box, Button, Grid, Typography } from "@mui/material";

import Config from "services/config";

import {
	ArrowLeft,
	ArrowMiniLeft,
	ArrowMiniRight,
	LoginPage1,
	LoginPage2,
	LoginPage3,
	LoginPage4,
	UriText,
} from "images";

const CarouselCard = ({ icon, title, text }) => (
	<Box
		sx={{
			width: "100%",
			height: "42vh",
			display: "flex",
			flexDirection: "column",
			alignItems: "center",
		}}
	>
		{icon}
		<Typography
			sx={{
				fontSize: "24px",
				fontWeight: "700",
				color: "#3A3A3A",
				textAlign: "center",
				mt: "60px",
			}}
		>
			{title}
		</Typography>
		<Typography
			sx={{
				fontSize: "14px",
				textAlign: "center",
			}}
		>
			{text}
		</Typography>
	</Box>
);

const Carousel = () => {
	const { t } = useTranslation("common");

	return (
		<Box
			sx={{
				position: "fixed",
				width: "50%",
				top: "25%",
				paddingInline: "3rem",
			}}
		>
			<MuiCarousel
				sx={{
					width: "100%",
					height: "60vh",
				}}
				NextIcon={<ArrowMiniRight />}
				PrevIcon={<ArrowMiniLeft />}
				navButtonsProps={{
					style: {
						backgroundColor: "transparent",
					},
				}}
				indicatorIconButtonProps={{
					style: {
						color: "#EFEFEF",
					},
				}}
				activeIndicatorIconButtonProps={{
					style: {
						color: "#0F20E8",
					},
				}}
			>
				<CarouselCard
					icon={<LoginPage1 style={{ height: "100vh", width: "100vw" }} />}
					title={t("onboarding_title_1")}
					text={t("onboarding_text_1")}
				/>
				<CarouselCard
					icon={<LoginPage2 style={{ height: "100vh", width: "100vw" }} />}
					title={t("onboarding_title_2")}
					text={t("onboarding_text_2")}
				/>
				<CarouselCard
					icon={<LoginPage3 style={{ height: "100vh", width: "100vw" }} />}
					title={t("onboarding_title_3")}
					text={t("onboarding_text_3")}
				/>
				<CarouselCard
					icon={<LoginPage4 style={{ height: "100vh", width: "100vw" }} />}
					title={t("onboarding_title_4")}
					text={t("onboarding_text_4")}
				/>
				{/* <CarouselCard
					icon={<LoginPage5 style={{ height: "100vh", width: "100vw" }} />}
					title={t("onboarding_title_5")}
					text={t("onboarding_text_5")}
				/> */}
			</MuiCarousel>
		</Box>
	);
};

export default function Layout({ children }) {
	const { t, i18n } = useTranslation("register");

	const location = useLocation();

	const marginBottomLookup = {
		"/login": "5rem",
		"/register": "2.75rem",
		"/forgot-password": "2.75rem",
	};

	useEffect(() => {
		i18n.changeLanguage("en-us");
	}, []);

	return (
		<Grid container sx={{ height: "100vh" }}>
			<Grid
				item
				xs={6}
				sx={{
					display: {
						xs: "none",
						sm: "none",
						md: "flex",
					},
				}}
			>
				<Carousel />
			</Grid>

			<Grid
				item
				sx={{
					backgroundColor: "white",
				}}
				xs={12}
				md={6}
			>
				<Button
					sx={{
						mt: 2,
						ml: 1,
						display: {
							xs: "none",
							sm: "none",
							md: "flex",
						},
					}}
					onClick={(x) => window.location.replace(`${Config.landingRoot()}`)}
					startIcon={<ArrowLeft />}
				>
					{t("register_home")}
				</Button>

				<Box
					key={location.pathname}
					display="flex"
					justifyContent="center"
					sx={{ mb: marginBottomLookup[location.pathname] }}
				>
					<UriText style={{ maxWidth: "100%", height: "auto", marginTop: "4rem" }} />
				</Box>

				<Box
					sx={{
						margin: "0 auto",
						paddingInline: "2rem",
						maxWidth: "36rem",
					}}
				>
					{children}
				</Box>
			</Grid>
		</Grid>
	);
}
