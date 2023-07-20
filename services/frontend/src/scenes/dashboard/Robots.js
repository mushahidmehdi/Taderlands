import { useTranslation } from "react-i18next";
import Carousel from "react-material-ui-carousel";

import { Button, Card, CardContent, Icon, Paper, Typography } from "@mui/material";

import shortenNumber from "utils/shortenNumber";

import { ArrowMiniLeft, ArrowMiniRight, Bolt, Stop, Trace, Uri, Virtual } from "images";

export default function Robots({ strategies }) {
	const { t } = useTranslation();

	const StrategyCard = ({ item }) => (
		<Card variant="outlined" sx={{ border: 0 }}>
			<CardContent
				sx={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
				}}
			>
				<Typography fontWeight={"Bold"} sx={{ fontSize: "18px" }}>
					{item?.strategy?.marketStrategy ? item.strategy.marketStrategy.name : item?.strategy?.name}
				</Typography>

				<Button variant="text" sx={{ fontSize: "12px" }}>
					{item?.strategy?.marketStrategy
						? item.strategy.marketStrategy.merchant?.nickname
						: t("dashboard.Own Strategy")}
				</Button>
				<Icon sx={{ width: "64px", height: "64px", mt: 1 }}>
					{item?.status === "OFF" ? (
						item.virtual === false ? (
							<Uri width="64px" height="64px" active={false} />
						) : (
							<Virtual width="64px" height="64px" active={false} />
						)
					) : item.virtual === false ? (
						<Uri width="64px" height="64px" active={true} />
					) : (
						<Virtual width="64px" height="64px" active={true} />
					)}
				</Icon>

				<Typography
					sx={{
						fontSize: "12px",
						mt: 2,
						color: (theme) =>
							item?.status === "OFF" ? theme.palette.info.dark : theme.palette.primary.main,
					}}
				>
					{`$ ${
						item?.strategy?.successInfo?.profitAmountSum
							? shortenNumber(item?.strategy?.successInfo?.profitAmountSum)
							: "0.00"
					}`}
				</Typography>

				<Icon sx={{ width: "32px", height: "32px", mt: 1.5 }}>
					{item?.status === "ON" ? <Bolt /> : item?.status === "OFF" ? <Stop /> : <Trace />}
				</Icon>
				<Typography
					sx={{
						fontSize: "10px",
						color: (theme) =>
							item?.status === "OFF" ? theme.palette.info.dark : theme.palette.primary.main,
					}}
				>
					{item?.status === "ON"
						? t("control_panel_robots_table_status_on")
						: item?.status === "OFF"
						? t("control_panel_robots_table_status_off")
						: t("control_panel_robots_table_status_standby")}
				</Typography>
			</CardContent>
		</Card>
	);

	return (
		<>
			{strategies && strategies.length > 0 && (
				<Paper sx={{ ml: 2, backgroundColor: "#FFFFFF", pt: 0.5, pb: 1, px: 2.5, height: "382px" }}>
					<Carousel
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
						{strategies.map((item, i) => (
							<StrategyCard key={i} item={item} />
						))}
					</Carousel>
				</Paper>
			)}
		</>
	);
}
