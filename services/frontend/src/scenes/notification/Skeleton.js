import React from "react";

import { Box } from "@mui/system";

import NotificationSkeleton from "./NotificationSkeleton";

const Skeleton = () => {
	return (
		<Box>
			<NotificationSkeleton />
			<NotificationSkeleton />
			<NotificationSkeleton />
			<NotificationSkeleton />
			<NotificationSkeleton />
			<NotificationSkeleton />
		</Box>
	);
};

export default Skeleton;
