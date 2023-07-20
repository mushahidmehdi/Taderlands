import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { Card, Typography } from "@mui/material";
import { Box } from "@mui/system";

import queryBuilder from "utils/queryBuilder";

import { ArrowRight } from "images";
import blueBackground from "images/blue-bg.png";

import { FeaturesSkeleton } from "../skeleton";

const Features = ({ funnels, filter, isLoading }) => {
	const { i18n } = useTranslation();
	const navigate = useNavigate();
	if (isLoading) {
		return <FeaturesSkeleton />;
	}

	const featuredBannerList = funnels?.filter(({ type: { featured, topBanner } }) => featured && topBanner === false);

	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				gap: "1rem",
			}}
		>
			<Box
				sx={{
					display: "flex",
					gap: "0.8rem",
				}}
			>
				{featuredBannerList?.map(({ info, id, type }) => {
					if (type.order === 1 || type.order === 2) {
						return (
							<Box
								key={id}
								sx={{
									display: "flex",
								}}
							>
								<Card
									sx={{
										display: "flex",
										justifyContent: "space-between",
										height: "auto",
										borderRadius: "1.1rem",
										paddingBlockEnd: "0.8rem",
									}}
								>
									<Box
										sx={{
											display: "flex",
											flexDirection: "column",
											justifyContent: "center",
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
										<Typography
											variant="h3"
											sx={{
												fontSize: "1.4rem",
												fontWeight: 600,
												color: "#0F20E8",
												padding: "1rem",
												width: "10.9rem",
												maxWidth: "100%",
												lineHeight: "1.7rem",
											}}
										>
											{info.title[i18n.resolvedLanguage]}
										</Typography>
										<ArrowRight
											style={{
												marginInlineStart: "1.3rem",
												transform: "scale(1.2)",
											}}
										/>
									</Box>
								</Card>
							</Box>
						);
					}
				})}
			</Box>
			<Box>
				{featuredBannerList?.map(({ info, id, type }) => (
					<Box
						key={id}
						sx={{
							display: "flex",
						}}
					>
						{type.order === 3 && Object.keys(info).length > 0 && (
							<Card
								sx={{
									display: "flex",
									justifyContent: "space-between",
									height: "auto",
									borderRadius: "1.1rem",
									width: "100%",
								}}
							>
								<Box
									sx={{
										cursor: "pointer",
										display: "flex",
										flexDirection: "column",
										justifyContent: "center",
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
									<Typography
										variant="h3"
										sx={{
											cursor: "pointer",

											fontSize: "1.4rem",
											fontWeight: 600,
											lineHeight: "1.7rem",
											color: "#0F20E8",
											padding: "1rem",
											width: "6.5rem",
											maxWidth: "100%",
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
										{info.title[i18n.resolvedLanguage]}
									</Typography>
									<ArrowRight
										style={{
											marginInlineStart: "1.3rem",
											transform: "scale(1.2)",
										}}
									/>
								</Box>
								<div
									style={{
										display: "flex",
										justifyContent: "flex-end",
										width: "100%",
										backgroundImage: `url(${blueBackground})`,
										backgroundRepeat: "no-repeat",
										backgroundPosition: "right",
										height: "9.5rem",
										backgroundSize: "16rem 9.5rem",
									}}
								>
									<img
										src={info.imageUrl}
										alt="imageUrl"
										style={{
											height: "8.6rem",
											marginBlockStart: "1rem",
										}}
									/>
								</div>
							</Card>
						)}
					</Box>
				))}
			</Box>
		</Box>
	);
};

export default Features;
