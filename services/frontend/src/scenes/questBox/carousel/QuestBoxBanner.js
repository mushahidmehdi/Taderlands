import { Box, Button, Card, Typography } from "@mui/material";

import { AlgorithmicTradeMadeSimple } from "images";
import blueBackground from "images/blue-bg.png";

function QuestBoxBanner() {
	return (
		<Card
			sx={{
				width: "84vw",
				display: "flex",
				borderRadius: "1.1rem",
				height: "8.5rem",
				cursor: "pointer",
			}}
		>
			<Box padding="0.8rem">
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
					}}
				>
					<Typography
						variant="h3"
						sx={{
							fontSize: "1rem",
							fontWeight: 700,
							color: "#0F20E8",
							maxWidth: "100%",
							marginInlineEnd: "1rem",
						}}
					>
						New Function Coming - Leaderboard
					</Typography>

					<Button
						sx={{
							backgroundColor: "#F4F5FC",
							padding: "1rem",
							height: "2rem",
						}}
					>
						Coming soon
					</Button>
				</Box>

				<Typography color="#3A3A3A" fontSize="12px">
					Discover the top creators on the leaderboard, curated with the real-time performance data! Choose
					the perfect designer for you.
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
					backgroundSize: "16rem 10rem",
				}}
			>
				<AlgorithmicTradeMadeSimple
					style={{
						width: "6rem",
						marginInlineEnd: "2rem",
					}}
				/>
				{/* <img
							src={info.imageUrl}
							alt="imageUrl"
							style={{
								width: "15rem",
								marginInlineEnd: "2rem",
							}}
						/> */}
			</div>
		</Card>
	);
}

export default QuestBoxBanner;
