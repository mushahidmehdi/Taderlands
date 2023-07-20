import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { Box, Card, CardActions, CardContent, Grid, Link, Typography } from "@mui/material";

import { ExploreModeTooltip, RouteLayout } from "components";

import { useUserApi } from "api/user";

import { setProfile } from "actions/UserActions";

import { accountSettings, market, notificationSettings, reference, security as securityImg } from "images";

export default function AccountCenter() {
	const { profile } = useSelector((state) => state.user);

	const { getProfile } = useUserApi();
	const { t } = useTranslation("accountCenter");
	const dispatch = useDispatch();

	useEffect(() => {
		getProfile().then((data) => dispatch(setProfile(data?.data?.profile)));
	}, []);

	const NavCard = ({ icon, title, text, url, disabled }) => (
		<ExploreModeTooltip enabled={disabled}>
			<Card sx={{ p: 2, width: "25vw", ...(disabled ? { opacity: "0.5" } : {}) }}>
				<CardContent
					sx={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						height: 200,
					}}
				>
					<Box component="img" src={icon} />
					<Typography c sx={{ mt: 2, fontSize: "24px", fontWeight: "bold" }}>
						{title}
					</Typography>
					<Typography sx={{ mt: 2, fontSize: "14px" }}>{text}</Typography>
				</CardContent>
				<CardActions
					sx={{
						justifyContent: "center",
					}}
				>
					{disabled ? (
						<Typography sx={{ mt: 2, fontSize: "16px" }}>{t("account_center_card_button_text")}</Typography>
					) : (
						<Link href={url} variant="body2" sx={{ mt: 2, fontSize: "16px" }}>
							{t("account_center_card_button_text")}
						</Link>
					)}
				</CardActions>
			</Card>
		</ExploreModeTooltip>
	);

	return (
		<RouteLayout header={t("account_center_main_title")}>
			<Box sx={{ mr: 2 }}>
				<Grid container spacing={2}>
					<Grid item>
						<NavCard
							icon={accountSettings}
							title={t("account_center_settings_title")}
							text={t("account_center_settings_text")}
							url={"/settings"}
						></NavCard>
					</Grid>
					<Grid item>
						<NavCard
							disabled={false}
							icon={securityImg}
							title={t("account_center_security_title")}
							text={t("account_center_security_text")}
							url={"/security"}
						></NavCard>
					</Grid>
					<Grid item>
						<NavCard
							disabled={false}
							icon={market}
							title={t("account_center_connections_title")}
							text={t("account_center_connections_text")}
							url={"/exchange-link"}
						></NavCard>
					</Grid>
					<Grid item>
						<NavCard
							disabled={false}
							icon={reference}
							title={t("account_center_reference_title")}
							text={t("account_center_reference_text")}
							url={"/reference-list"}
						></NavCard>
					</Grid>
					<Grid item>
						<NavCard
							disabled={false}
							icon={notificationSettings}
							title={t("account_center_notification_title")}
							text={t("account_center_notification_text")}
							url={"/notification-settings"}
						></NavCard>
					</Grid>
				</Grid>
			</Box>
		</RouteLayout>
	);
}
