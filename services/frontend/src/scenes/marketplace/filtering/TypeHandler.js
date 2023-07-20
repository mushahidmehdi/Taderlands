import { useTranslation } from "react-i18next";

import { Box, Button } from "@mui/material";

import { activeTabType } from "../config";

const TypeHandler = ({ tab, setTab }) => {
	const handleTabClick = (type) => {
		setTab(type);
	};

	const { t } = useTranslation("marketplace");

	return (
		<Box display="flex" marginBottom="0.5rem">
			{activeTabType(t).map((mpTab) => (
				<Button
					key={mpTab.type}
					sx={{
						cursor: "pointer",
						fontSize: "24px",
						fontWeight: "700",
						color: `${tab === mpTab.type ? "#0F20E8" : "#AEAEAE"}`,
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
							backgroundColor: `${tab === mpTab.type && "#0F20E8"}`,
						},
					}}
					onClick={() => handleTabClick(mpTab.type)}
				>
					{mpTab.name}
				</Button>
			))}
		</Box>
	);
};

export default TypeHandler;
