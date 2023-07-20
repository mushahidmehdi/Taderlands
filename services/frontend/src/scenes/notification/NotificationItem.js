import React from "react";

import dayjs from "dayjs";

import { Typography } from "@mui/material";
import { Box } from "@mui/system";

import { FireIcon } from "images";

const NotificationItem = ({ noti }) => {
	return (
		<Box
			sx={{
				backgroundColor: "#fff",
				padding: "1rem",
				paddingBlockEnd: "0",
				opacity: noti.data.status === "Read" ? "0.6" : 1,
				cursor: "pointer",
			}}
		>
			<Box
				sx={{
					backgroundColor: "#fff",
					borderBottom: "1px solid #CFD2FA",
				}}
			>
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						paddingBlockStart: "1rem",
						paddingBlockEnd: "1rem",
					}}
				>
					{noti.data.status !== "Read" && (
						<Box
							sx={{
								width: "0.6rem",
								height: "0.6rem",
								background: "#0F20E8",
								borderRadius: "99rem",
								marginInlineEnd: "0.4rem",
							}}
						/>
					)}

					<Typography
						sx={{
							fontSize: "1rem",
							fontWeight: 700,
							lineHeight: "18px",
							marginInlineEnd: "1rem",
						}}
					>
						{noti.info.type}
					</Typography>
					<FireIcon
						style={{
							marginInline: "0.2rem",
						}}
					/>
					<FireIcon
						style={{
							marginInline: "0.2rem",
						}}
					/>
					<FireIcon
						style={{
							marginInline: "0.2rem",
						}}
					/>
				</Box>
				<Typography
					sx={{
						fontSize: "14px",
						fontWeight: 700,
						lineHeight: "18px",
					}}
				>
					{noti.content.body}
				</Typography>
				<Typography
					sx={{
						fontSize: "12px",
						fontWeight: 400,
						paddingBlock: "0.6rem",
						lineHeight: "16px",
					}}
				>
					{dayjs(noti.createdAt).format("dddd, MMMM D, YYYY h:mm")}
				</Typography>
			</Box>
		</Box>
	);
};

export default NotificationItem;
