import { Box } from "@mui/material";
import Skeleton from "@mui/material/Skeleton";

const BannerSkeleton = () => {
	return (
		<Box
			sx={{
				width: "100%",
				display: "flex",
				justifyContent: "space-between",
				backgroundColor: "#fff",
				padding: "1rem",
				borderRadius: "1rem",
			}}
		>
			<Box
				sx={{
					width: "100%",
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
				}}
			>
				<Skeleton variant="text" sx={{ fontSize: "2rem", width: "60%" }} />
				<Skeleton variant="text" sx={{ fontSize: "2rem", width: "80%" }} />
			</Box>

			<Box
				sx={{
					width: "100%",
					display: "flex",
					justifyContent: "space-between",
					borderRadius: "0.4rem",
				}}
			>
				<Skeleton variant="rectangular" width="100%" height={270} />
			</Box>
		</Box>
	);
};

export default BannerSkeleton;
