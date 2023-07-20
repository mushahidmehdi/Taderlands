import { useState } from "react";

import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

import { DownMiniBlue } from "images";
import { searchDropdown } from "scenes/marketplace/config";

const SelectStrategy = () => {
	const { t } = useTranslation("marketplace");

	const [dropdown, setDropdown] = useState(false);
	const [toggleStrategy, setToggleStrategy] = useState("Stategies");

	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				fontSize: "1rem",
				cursor: "pointer",
			}}
		>
			<Box
				sx={{
					display: "flex",
					width: "8rem",
					maxWidth: "100%",
					justifyContent: "space-evenly",
					alignItems: "center",
				}}
				onClick={() => setDropdown(!dropdown)}
			>
				<Typography
					sx={{
						fontSize: "1rem",
						fontWeight: 500,
						lineHeight: "1.1rem",
						color: "#3A3A3A",
					}}
				>
					{toggleStrategy}
				</Typography>
				<DownMiniBlue
					style={{
						transform: dropdown ? "rotate(180deg)" : "rotate(0)",
						transitionDuration: "0.5s",
					}}
				/>
			</Box>
			<Box
				sx={{
					position: "absolute",
					borderRadius: "0.4rem",
					width: "8rem",
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					background: "#fff",
				}}
			>
				{dropdown &&
					searchDropdown(t).map(({ key, value }, index) => (
						<p
							style={{
								cursor: "pointer",
								display: "flex",
								flex: 1,
							}}
							onClick={() => [setToggleStrategy(value), setDropdown(!dropdown)]}
						>
							{key}
						</p>
					))}
			</Box>
		</Box>
	);
};

export default SelectStrategy;
