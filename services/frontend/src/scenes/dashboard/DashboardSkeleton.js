import React from "react";

import { Card, Grid, Paper, Skeleton } from "@mui/material";
import { Box } from "@mui/system";

const DashboardSkeleton = () => {
	return (
		<div style={{ marginRight: "4rem", marginBlockStart: "6rem", width: "100%" }}>
			<Grid container>
				<Box
					sx={{
						paddingBlock: "2rem",
					}}
				>
					<Skeleton width={260} height={40} />
					<Skeleton width={100} height={30} />
				</Box>
				<Grid container spacing={1}>
					<Grid item xs={4}>
						<Card
							sx={{
								borderRadius: "0.5rem",
								display: "flex",
								flexDirection: "column",
								alignItems: "center",
								paddingInline: "10rem",
								paddingBlock: "3rem",
							}}
						>
							<Skeleton width={100} height={120} />
							<Skeleton width={120} height={20} />
							<Skeleton width={40} height={50} />
							<Skeleton width={60} height={10} />
						</Card>
					</Grid>
					<Grid item xs={4}>
						<Box display="flex" flexWrap="wrap" justifyContent="center" gap="0.5rem">
							<Card
								sx={{
									borderRadius: "0.5rem",
									display: "flex",
									flexDirection: "column",
									alignItems: "center",
									width: "9rem",
									height: "9rem",
								}}
							>
								<Skeleton width={60} height={80} />
								<Skeleton width={50} height={25} />
							</Card>
							<Card
								sx={{
									borderRadius: "0.5rem",
									display: "flex",
									flexDirection: "column",
									alignItems: "center",
									width: "9rem",
									height: "9rem",
								}}
							>
								<Skeleton width={60} height={80} />
								<Skeleton width={50} height={25} />
							</Card>
							<Card
								sx={{
									borderRadius: "0.5rem",
									display: "flex",
									flexDirection: "column",
									alignItems: "center",
									width: "9rem",
									height: "9rem",
								}}
							>
								<Skeleton width={60} height={80} />
								<Skeleton width={50} height={25} />
							</Card>
							<Card
								sx={{
									borderRadius: "0.5rem",
									display: "flex",
									flexDirection: "column",
									alignItems: "center",
									width: "9rem",
									height: "9rem",
								}}
							>
								<Skeleton width={60} height={80} />
								<Skeleton width={50} height={25} />
							</Card>
						</Box>
					</Grid>
					<Grid item xs={4}>
						<Card
							sx={{
								borderRadius: "0.5rem",
								display: "flex",
								flexDirection: "column",
								justifyContent: "center",
								alignItems: "center",
								height: "100%",
							}}
						>
							<Skeleton width={120} height={20} />
							<Skeleton width={90} height={130} />
							<Skeleton width={70} height={20} />
							<Box display="flex" gap="0.3rem" sx={{ marginBlock: "1rem" }}>
								<Skeleton width={10} height={10} variant="circular" />
								<Skeleton
									width={10}
									height={10}
									variant="circular"
									sx={{
										backgroundColor: "#0F20E8",
									}}
								/>
								<Skeleton width={10} height={10} variant="circular" />
							</Box>
						</Card>
					</Grid>
				</Grid>
			</Grid>

			<Grid container direction="column" justifyContent="center" alignItems="center" sx={{ marginTop: "4rem" }}>
				<Box
					sx={{
						width: "100%",
					}}
				>
					<Skeleton width={260} height={40} />
				</Box>
				{Array.from({ length: 3 }, (_, i) => i + 1).map(() => (
					<Paper
						elevation={0}
						sx={{
							mt: 2,
							overflow: "hidden",
							padding: "1rem",
							width: "100%",
						}}
					>
						<Grid container justifyContent={"space-between"} alignItems={"center"}>
							<Grid item xs={3}>
								<Skeleton variant="text" sx={{ fontSize: "1.4rem", width: "80%" }} />
							</Grid>

							<Grid item xs={2}>
								<Skeleton variant="text" sx={{ fontSize: "1.4rem", width: "80%" }} />
							</Grid>

							<Grid item xs={2}>
								<Skeleton variant="text" sx={{ fontSize: "1.4rem", width: "100%" }} />
							</Grid>
							<Grid item xs={1.5}>
								<Skeleton variant="text" sx={{ fontSize: "1.4rem", width: "90%" }} />
							</Grid>

							<Grid item xs={2} textAlign="center">
								<Skeleton variant="text" sx={{ fontSize: "1.4rem", width: "80%" }} />
							</Grid>
						</Grid>
					</Paper>
				))}
			</Grid>
		</div>
	);
};

export default DashboardSkeleton;
