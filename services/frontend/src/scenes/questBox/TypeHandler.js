import React from "react";
import { useSelector } from "react-redux";

import { Box, Button } from "@mui/material";

import { questTypes } from "./config";

const TypeHandler = ({ tab, setTab, showActiveTab }) => {
	const handleTabClick = (type) => {
		setTab(type);
	};
	const { profile } = useSelector((state) => state.user);

	return (
		<Box display="flex" marginBottom="0.5rem">
			{questTypes
				.filter(
					(x) =>
						(!profile.merchant ? x.type !== "CREATOR" : true) &&
						(!showActiveTab ? x.type !== "ACTIVE" : true)
				)
				.map((quest) => (
					<Button
						sx={{
							cursor: "pointer",
							fontSize: "24px",
							fontWeight: "700",
							color: `${tab === quest.type ? "#0F20E8" : "#AEAEAE"}`,
							position: "relative",
							paddingLeft: "20px",
							"&::before": {
								content: "''",
								position: "absolute",
								top: "50%",
								left: "0",
								transform: "translateY(-50%)",
								width: "10px",
								height: "10px",
								borderRadius: "50%",
								backgroundColor: `${tab === quest.type && "#0F20E8"}`,
							},
						}}
						key={quest.type}
						onClick={() => handleTabClick(quest.type)}
					>
						{quest.name}
					</Button>
				))}
		</Box>
	);
};

export default TypeHandler;
