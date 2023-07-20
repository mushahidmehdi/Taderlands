import { useTranslation } from "react-i18next";
import Carousel from "react-material-ui-carousel";
import { useNavigate } from "react-router-dom";

import { Card, Typography } from "@mui/material";
import { Box } from "@mui/system";

import queryBuilder from "utils/queryBuilder";

import blueBackground from "images/blue-bg.png";

import { BannerSkeleton } from "../skeleton";

const CarouselComponent = ({ funnels, filter, processingFunnels }) => {
	if (processingFunnels) {
		return <BannerSkeleton />;
	}

	return (
		<Box
			sx={{
				width: "100%",
			}}
		>
			<Carousel
				indicatorIconButtonProps={{
					style: {
						color: "transparent",
						height: "0.4rem",
						width: "0.4rem",
						background: "#CFD2FA",
					},
				}}
				activeIndicatorIconButtonProps={{
					style: {
						width: "1.3rem",
						background: "#0F20E8",
						borderRadius: "2rem",
						height: "0.4rem",
					},
				}}
				indicatorContainerProps={{
					style: {
						textAlign: "center",
						height: "0.4rem",
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						gap: "0.2rem",
					},
				}}
			>
				{funnels?.map(({ status, info, id, type }) => (
					<Banner key={id} status={status} info={info} type={type} id={id} filter={filter} />
				))}
			</Carousel>
		</Box>
	);
};

function Banner({ info, type, id, filter }) {
	const { i18n } = useTranslation();
	const navigate = useNavigate();

	return (
		<Card
			sx={{
				display: "flex",
				justifyContent: "space-between",
				borderRadius: "1.1rem",
				height: "17.5rem",
				cursor: "pointer",
			}}
			onClick={() =>
				navigate(
					`/marketplace?${queryBuilder({
						...filter?.where,
						...filter.orderBy,
						funnelId: id,
					})}`
				)
			}
		>
			<Box
				sx={{
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
				}}
			>
				<Typography
					variant="h3"
					sx={{
						fontSize: "2.2rem",
						fontWeight: 700,
						lineHeight: "45px",
						color: "#0F20E8",
						padding: "1rem",
						width: "14.5rem",
						maxWidth: "100%",
					}}
				>
					{info.title[i18n.resolvedLanguage]}
				</Typography>
			</Box>

			<div
				style={{
					display: "flex",
					justifyContent: "flex-end",
					width: "100%",
					backgroundImage: `url(${blueBackground})`,
					backgroundRepeat: "no-repeat",
					backgroundPosition: "right",
					backgroundSize: "34rem 18rem",
				}}
			>
				<img
					src={info.imageUrl}
					alt="imageUrl"
					style={{
						width: "15rem",
						marginInlineEnd: "2rem",
					}}
				/>
			</div>
		</Card>
	);
}

export default CarouselComponent;
