import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { Button, Card, Typography } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import { Box } from "@mui/system";

import { ShortIcon, StockBtnTicker } from "images";
import shortenNumber from "utils/shortenNumber";

function Expert({ data }) {
	const { t } = useTranslation("marketplace");
	const navigate = useNavigate();

	const { bannerPictureUrl, profilePictureUrl, nickname, merchantStatistics } = data;

	return (
		<Card
			sx={{
				minWidth: "16rem",
				maxWidth: "18rem",
				borderRadius: "8px",
				position: "relative",
				height: "17rem",
				flex: 1,
				cursor: "pointer",
			}}
			onClick={() => navigate(`/marketplace/merchant/${data.id}`)}
		>
			<Box
				component={"img"}
				src={bannerPictureUrl}
				sx={{
					objectFit: "cover",
					height: "5rem",
					overflow: "hidden",
					objectPosition: "cover",
					width: "100%",
				}}
			/>

			<Box
				sx={{
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					alignItems: "center",
					top: "16%",
					marginTop: "-3rem",
				}}
			>
				<Avatar
					alt={nickname}
					src={profilePictureUrl}
					sx={{
						width: "4rem",
						height: "4rem",
					}}
				/>
				<Typography sx={{ textAlign: "center", width: "14rem", maxWidth: "100%" }}>{nickname}</Typography>
			</Box>
			<Box
				sx={{
					display: "flex",
					justifyContent: "center",
					gap: "0.4rem",
					alignItems: "center",
				}}
			>
				{merchantStatistics?.executionType.map((type) => (
					<>
						<Button
							color="primary"
							sx={{
								backgroundColor: type === "LONG" ? "#0F20E8" : "#6F79F1",
								color: "#fff",
								paddingBlockStart: "0.1rem",
								paddingBlockEnd: "0.0rem",
								paddingInline: "0.7rem",
								borderRadius: "4px",
								marginBlock: "0.3rem",
								"&:hover": {
									backgroundColor: type === "LONG" ? "#6F79F1" : "#0F20E8",
								},
							}}
							startIcon={type === "LONG" && <StockBtnTicker />}
							endIcon={type === "SHORT" && <ShortIcon />}
						>
							{type}
						</Button>
					</>
				))}
			</Box>
			<Box
				sx={{
					display: "flex",
					justifyContent: "space-evenly",
					paddingBlock: "1rem",
				}}
			>
				<Box>
					<Typography
						sx={{
							width: "3rem",
							lineHeight: "1rem",
							marginBlock: "0.5rem",
							color: "#3A3A3A",
							fontSize: "12px",
							fontWeight: 700,
						}}
					>
						{t("marketplace_total_volume_text")}
					</Typography>
					<Typography sx={{ color: "#0F20E8", fontSize: "14px", fontWeight: 700, lineHeight: "1rem" }}>
						{merchantStatistics?.totalVolume ? shortenNumber(merchantStatistics?.totalVolume) : "0"}
					</Typography>
				</Box>
				<Box>
					<Typography
						sx={{
							width: "3rem",
							lineHeight: "1rem",
							marginBlock: "0.5rem",
							color: "#3A3A3A",
							fontSize: "12px",
							fontWeight: 700,
						}}
					>
						{t("marketplace_total_profit_text")}
					</Typography>
					<Typography sx={{ color: "#0F20E8", fontSize: "14px", fontWeight: 700, lineHeight: "1rem" }}>
						{merchantStatistics?.totalProfit ? shortenNumber(merchantStatistics?.totalProfit) : "0"}
					</Typography>
				</Box>
				<Box>
					<Typography
						sx={{
							width: "3rem",
							lineHeight: "1rem",
							marginBlock: "0.5rem",
							color: "#3A3A3A",
							fontSize: "12px",
							fontWeight: 700,
						}}
					>
						{t("marketplace_average_profit_text")}
					</Typography>
					<Typography sx={{ color: "#0F20E8", fontSize: "14px", fontWeight: 700, lineHeight: "1rem" }}>
						{merchantStatistics?.averageProfit ? shortenNumber(merchantStatistics?.averageProfit) : "0"}
					</Typography>
				</Box>
			</Box>
		</Card>
	);
}

export default Expert;
