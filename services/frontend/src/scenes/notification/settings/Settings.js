import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { omit } from "lodash";

import { Typography } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import { Box } from "@mui/system";

import { useUserApi } from "api/user";
import { Breadcrumbs, PageCenteredProgress, RouteLayout } from "components";
import useQuery from "utils/useQuery";

import Card from "./Card";
import Template from "./Template";

const Settings = () => {
	const [processing, setProcessing] = useState(true);
	const [notificationSettings, setNotificationSettings] = useState();
	const [value, setValue] = React.useState("tr");

	const { getNotificationSettings, patchNotificationSettings } = useUserApi();
	const query = useQuery();
	const navigate = useNavigate();

	const type = query.get("t");

	const { t } = useTranslation("accountCenter");

	const positionNotificationSettingsProperties = [
		{
			key: "buySell",
			title: t("account_center_notifications_positions_page_buy_sell"),
		},
		{
			key: "stickers",
			title: t("account_center_notifications_positions_page_stickers"),
		},
		{
			key: "stopLoss",
			title: t("account_center_notifications_positions_page_stop_loss"),
		},
		{
			key: "takeProfit",
			title: t("account_center_notifications_positions_page_take_profit"),
		},
		{
			key: "newPosition",
			title: t("account_center_notifications_positions_page_new_position"),
		},
		{
			key: "trailingStop",
			title: t("account_center_notifications_positions_page_trailing_stop"),
		},
	];

	const defaultNotificationSettingsProperties = [
		{
			key: "accountCenter",
			title: t("account_center_notifications_customize_page_account_option"),
		},
		{
			key: "marketing",
			title: t("account_center_notifications_customize_page_marketing_option"),
		},
		{
			key: "positionNotification",
			title: t("account_center_notifications_customize_page_position_option"),
		},
		{
			key: "wallet",
			title: t("account_center_notifications_customize_page_wallet_option"),
		},
	];

	const queryMap = {
		email: {
			key: { main: "emailNotification", detail: "emailNotificationSettings" },
			title: t("account_center_notifications_email_title"),
			explanation: {
				main: t("account_center_notifications_email_text"),
				detail: t("account_center_notifications_customize_page_sub_text"),
			},
			properties: defaultNotificationSettingsProperties,
		},
		sms: {
			key: { main: "smsNotification", detail: "smsNotificationSettings" },
			title: t("account_center_notifications_sms_title"),
			explanation: {
				main: t("account_center_notifications_sms_text"),
				detail: t("account_center_notifications_pages_text_for_rest"),
			},
			properties: defaultNotificationSettingsProperties,
		},
		telegram: {
			key: { main: "telegramNotification", detail: "telegramNotificationsSettings" },
			title: t("account_center_notifications_telegram_title"),
			explanation: {
				main: t("account_center_notifications_telegram_text"),
				detail: t("account_center_notifications_pages_text_for_rest"),
			},
			properties: defaultNotificationSettingsProperties,
			telegramInfo: true,
		},
		app: {
			key: { main: "appNotification", detail: "appNotificationSettings" },
			title: t("account_center_notifications_app_title"),
			explanation: {
				main: t("account_center_notifications_app_text"),
				detail: t("account_center_notifications_pages_text_for_rest"),
			},
			properties: defaultNotificationSettingsProperties,
		},
		position: {
			key: { detail: "positionNotificationSettings" },
			title: t("account_center_notifications_positions_title"),
			explanation: {
				main: t("account_center_notifications_positions_text"),
				detail: t("account_center_notifications_positions_page_text"),
			},
			properties: positionNotificationSettingsProperties,
		},
	};

	useEffect(() => {
		getNotificationSettings().then((data) => {
			setNotificationSettings(data?.data?.notificationSetting);
			setProcessing(false);
		});
	}, []);

	const handleChange = (data) => {
		patchNotificationSettings(omit(data, ["createdAt", "createdBy", "deletedAt", "updatedAt", "userId"])).then(
			(data) => {
				setNotificationSettings(data?.data?.notificationSetting);
			}
		);
	};

	const handleLanguageChange = (event) => {
		setValue(event.target.value);
	};

	return (
		<RouteLayout
			headerComp={
				<Breadcrumbs
					paths={[
						{
							text: t("account_center_notifications_main_title"),
							onClick: () => navigate("/notification-settings"),
						},
						...(type && queryMap?.[type]
							? [
									{
										text: queryMap?.[type]?.title,
									},
							  ]
							: []),
					]}
				/>
			}
		>
			{processing ? (
				<PageCenteredProgress />
			) : (
				<Box
					sx={{
						backgroundColor: "#fff",
						display: "flex",
						flexWrap: "wrap",
						padding: "3rem",
						mt: "1rem",
						justifyContent: "flex-start",
						gap: "2rem",
						borderRadius: "8px",
					}}
				>
					{type && queryMap?.[type] && (
						<Template
							data={notificationSettings}
							dataKey={queryMap[type].key.detail}
							title={queryMap[type].title}
							explanation={queryMap[type].explanation.detail}
							properties={queryMap[type].properties}
							onChange={handleChange}
							{...(queryMap[type]?.telegramInfo && { telegramInfo: true })}
						/>
					)}
					{!type &&
						Object.keys(queryMap).map((item, ix) => (
							<Card
								key={ix}
								query={item}
								title={queryMap[item].title}
								data={notificationSettings}
								dataKey={queryMap[item].key.main}
								explanation={queryMap[item].explanation.main}
								onChange={handleChange}
							/>
						))}
				</Box>
			)}

			{false && (
				<Box
					sx={{
						backgroundColor: "#fff",
						display: "flex",
						flexDirection: "column",
						flexWrap: "wrap",
						padding: "3rem",
						mt: "1rem",
						justifyContent: "flex-start",
						borderRadius: "8px",
					}}
				>
					<Typography
						gutterBottom
						sx={{
							fontSize: "24px",
							fontWeight: 700,
							lineHeight: "32px",
							display: "block",
						}}
					>
						{t("account_center_notifications_positions_page_notifications_language_title")}
					</Typography>
					<Typography
						gutterBottom
						sx={{
							fontSize: "14px",
							fontWeight: 400,
						}}
					>
						{t("account_center_notifications_positions_page_notifications_language_text")}
					</Typography>
					<FormControl>
						<FormLabel
							sx={{
								color: "#0F20E8",
								fontSize: "1rem",
								fontWeight: 700,
								lineHeight: "20px",
								marginBlockStart: "1rem",
							}}
						>
							{t("account_center_notifications_positions_page_notifications_language_choose_text")}
						</FormLabel>
						<RadioGroup value={value} onChange={handleLanguageChange} row>
							<FormControlLabel
								value="en"
								control={<Radio />}
								label={t(
									"account_center_notifications_positions_page_notifications_language_choose_english"
								)}
							/>
							<FormControlLabel
								value="tr"
								control={<Radio />}
								label={t(
									"account_center_notifications_positions_page_notifications_language_choose_turkish"
								)}
							/>
						</RadioGroup>
					</FormControl>
				</Box>
			)}
		</RouteLayout>
	);
};

export default Settings;
