import React from "react";
import { useTranslation } from "react-i18next";
import Carousel from "react-material-ui-carousel";
import { useNavigate } from "react-router-dom";

import { Box, Typography } from "@mui/material";

import queryBuilder from "utils/queryBuilder";

import { BannerSkeleton } from "../skeleton";

const BannerCarousel = ({ funnels, filter, processingFunnels }) => {
	if (processingFunnels) {
		return <BannerSkeleton />;
	}

	return (
		<Box
			sx={{
				width: "100%",
				height: "360px",
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

function Banner({ info, id, filter }) {
	const { i18n } = useTranslation();
	const navigate = useNavigate();

	return (
		<div
			style={{
				display: "flex",
				justifyContent: "space-between",
				alignItems: "center",
				borderRadius: "1.1rem",
				background: `url(${info?.webBgImageUrl}) `,
				backgroundPosition: "center",
				backgroundSize: "cover",
				backgroundRepeat: "no-repeat",
				minHeight: "20rem",
				overflow: "hidden",
				boxSizing: "border-box",
				maxheight: "100%",
				paddingInline: "4rem",
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
					cursor: "pointer",
				}}
			>
				<Typography
					variant="h3"
					sx={{
						fontSize: "2.2rem",
						fontWeight: 700,
						lineHeight: "45px",
						color: "#fff",
						padding: "1rem",
						width: "14.5rem",
						maxWidth: "100%",
					}}
				>
					{info.title[i18n.resolvedLanguage]}
				</Typography>
			</Box>
			<Box
				sx={{
					marginBlockStart: "1.5rem",
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
			</Box>
		</div>
	);
}

export default BannerCarousel;
