import { useTranslation } from "react-i18next";

import { Box, Button, Card, CardActions, CardContent, CardHeader, Grid, Typography } from "@mui/material";

import { Chip } from "components";

import { bigCheck, disabled, infoOrange } from "images";

export default function ExchangeCard({ title, exchange, icon, featured, marketTypes, connection, handleNext }) {
	const { t } = useTranslation("accountCenter");

	const handleClick = () => {
		handleNext(exchange);
	};

	const { isActive, restrictions = {} } = connection ?? {};
	const { canRead, isValid, canSpotTrade, canFuturesTrade } = restrictions;

	const futuresValid = (marketTypes?.includes("FUTURES") && canFuturesTrade) || !marketTypes?.includes("FUTURES");
	const spotValid = (marketTypes?.includes("SPOT") && canSpotTrade) || !marketTypes?.includes("SPOT");
	const connectionValid = isActive && canRead && isValid;

	const cardBorderColor = (theme) =>
		!connection
			? theme.palette.primary.main
			: !isActive
			? theme.palette.info.dark
			: connectionValid
			? futuresValid && spotValid
				? theme.palette.success.main
				: theme.palette.warning.main
			: theme.palette.warning.main;

	const cardBackgroundColor = (theme) =>
		!connection
			? "#fff"
			: !isActive
			? theme.palette.info.light
			: connectionValid
			? "#FFF"
			: theme.palette.info.light;

	const working = connection?.isActive && futuresValid && spotValid;

	return (
		<Card
			id={title}
			variant="outlined"
			sx={{
				borderColor: cardBorderColor,
				backgroundColor: cardBackgroundColor,
			}}
		>
			<CardHeader
				avatar={
					connection ? (
						working ? (
							<Box sx={{ alignSelf: "end" }} component="img" src={bigCheck} />
						) : isActive ? (
							<Box sx={{ alignSelf: "end" }} component="img" src={infoOrange} />
						) : (
							<Box sx={{ alignSelf: "end" }} component="img" src={disabled} />
						)
					) : (
						<></>
					)
				}
			></CardHeader>
			<CardContent
				sx={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
				}}
			>
				<Box component="img" src={icon} sx={{ width: 60, height: 60, mt: -5 }} />
				<Typography fontWeight={"Bold"} sx={{ mt: 2, fontSize: "16px" }}>
					{title}
				</Typography>
				{connection ? (
					<Typography
						sx={{
							mt: 2,
							fontSize: "10px",
							minHeight: "60px",
							color: (theme) => !working && isActive && theme.palette.warning.main,
						}}
					>
						{!isActive
							? t("account_center_connections_exchange_card_text_disabled")
							: marketTypes?.includes("FUTURES") &&
							  !connection?.restrictions?.canFuturesTrade &&
							  marketTypes?.includes("SPOT") &&
							  !connection?.restrictions?.canSpotTrade
							? t("account_center_connections_exchange_card_text_both_warning")
							: marketTypes?.includes("FUTURES") && !connection?.restrictions?.canFuturesTrade
							? t("account_center_connections_exchange_card_text_futures_warning")
							: marketTypes?.includes("SPOT") && !connection?.restrictions?.canSpotTrade
							? t("account_center_connections_exchange_card_text_spot_warning")
							: t("account_center_connections_exchange_card_text_connected")}
					</Typography>
				) : (
					<Typography sx={{ mt: 2, fontSize: "10px" }}>
						{t("account_center_connections_exchange_card_text_not_connected")}
					</Typography>
				)}

				<Grid container sx={{ mt: 2, justifyContent: "center" }}>
					{connection && !isActive && (
						<Chip
							sx={{ fontSize: "12px", ml: 1, color: "#000" }}
							color="info"
							label={t("account_center_disabled")}
						/>
					)}

					{isActive && featured && (
						<Chip
							backgroundColor={"#6A1FC2"}
							label={t("account_center_popular")}
							sx={{ fontSize: "12px", color: "#fff" }}
						/>
					)}

					{marketTypes?.includes("FUTURES") && (
						<Chip
							color={
								!connection
									? "primary"
									: !connection?.restrictions?.canFuturesTrade
									? "warning"
									: "primary"
							}
							sx={{ fontSize: "12px", ml: 1 }}
							label={t("account_center_futures")}
						/>
					)}
					{marketTypes?.includes("SPOT") && (
						<Chip
							color={
								!connection
									? "primary"
									: !connection?.restrictions?.canSpotTrade
									? "warning"
									: "primary"
							}
							sx={{ fontSize: "12px", ml: 1 }}
							label={t("account_center_spot")}
						/>
					)}
				</Grid>
			</CardContent>
			<CardActions
				sx={{
					justifyContent: "center",
				}}
			>
				<Button
					sx={{
						"&:hover": {
							textDecoration: "underline",
						},
					}}
					onClick={() => handleClick()}
					variant="text"
				>
					{connection
						? working
							? t("account_center_update")
							: t("account_center_fixit")
						: t("account_center_set_up")}
				</Button>
			</CardActions>
		</Card>
	);
}
