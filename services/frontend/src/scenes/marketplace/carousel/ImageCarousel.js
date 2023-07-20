import Carousel from "react-material-ui-carousel";
import { useNavigate } from "react-router-dom";

import { Box } from "@mui/system";

import queryBuilder from "utils/queryBuilder";

import { BannerSkeleton } from "../skeleton";

const ImageCarousel = ({ funnels, filter, processingFunnels }) => {
	if (processingFunnels) {
		return <BannerSkeleton />;
	}

	return (
		<Box
			sx={{
				width: "100%",
				height: "100%",
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
	const navigate = useNavigate();

	return (
		<Box
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
			<div
				style={{
					width: "100%",
					height: "100%",
					borderRadius: "0.5rem",
				}}
			>
				<img
					src={info?.webImageUrl}
					alt="web"
					style={{
						width: "100%",
						height: "100%",
						borderRadius: "0.5rem",
					}}
				/>
			</div>
		</Box>
	);
}

export default ImageCarousel;
