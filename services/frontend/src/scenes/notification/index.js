import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { Button, Typography } from "@mui/material";
import { Box } from "@mui/system";

import { RouteLayout } from "components";

import { useUserApi } from "api/user";

import NoticationItem from "./NotificationItem";
import Skeleton from "./Skeleton";

const Notification = () => {
	const { t } = useTranslation();
	const [isLoading, setLoading] = useState(false);
	const { getNotification, readAllNotifications, unreadANotification } = useUserApi();

	const [notificationData, setNotificationData] = useState({
		notifications: [],
	});

	const { notifications } = notificationData;

	const handleReadAll = () => {
		readAllNotifications().then((data) => data?.data && window.location.reload());
	};

	const handleReadANotification = (param) => {
		unreadANotification(param.id);
	};

	useEffect(() => {
		setLoading(true);
		getNotification()
			.then((data) =>
				setNotificationData((prev) => ({
					...prev,
					notifications: data?.data.notifications,
				}))
			)
			.finally(() => setLoading(false));
	}, []);

	return (
		<RouteLayout>
			<Typography
				sx={{
					fontSize: "28px",
					fontWeight: 700,
					lineHeight: "2rem",
					color: "#3A3A3A",
					marginBlockEnd: "0.5rem",
				}}
			>
				{t("notifications_title")}
			</Typography>
			<Box
				sx={{
					background: "#fff",
					borderRadius: "0.6rem",
					overflow: "hidden",
					height: "75vh",
					overflowY: "scroll",
				}}
			>
				{isLoading ? (
					<Skeleton />
				) : (
					notifications?.map((noti, index) => (
						<Box key={index} onClick={() => handleReadANotification(noti)}>
							<NoticationItem noti={noti} />
						</Box>
					))
				)}
			</Box>

			<Box
				sx={{
					display: "flex",
					justifyContent: "flex-end",
					marginBlockStart: "0.5rem",
					gap: "1rem",
				}}
			>
				<Button
					variant="outlined"
					sx={{
						paddingInline: "3rem",
					}}
				>
					{t("notifications_delete_all")}
				</Button>
				<Button
					variant="contained"
					sx={{
						paddingInline: "3rem",
					}}
					onClick={handleReadAll}
				>
					{t("notifications_mark_all_as_read")}
				</Button>
			</Box>
		</RouteLayout>
	);
};

export default Notification;
