import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { Box, Typography } from "@mui/material";

import { DownMiniBlue } from "images";
import { searchDropdown } from "scenes/marketplace/config";

const SelectSearchType = ({ setSearchConfig, searchConfig }) => {
	const [dropdown, setDropdown] = useState(false);
	const { searchType } = searchConfig;
	const dropdownRef = useRef();
	const { t } = useTranslation("marketplace");

	useEffect(() => {
		document.addEventListener("click", closeDropdown, true);
		return () => document.removeEventListener("click", closeDropdown, true);
	}, []);

	const closeDropdown = (evt) => {
		if (!dropdownRef.current?.contains(evt.target)) {
			setDropdown(false);
		}
	};

	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				fontSize: "1rem",
				cursor: "pointer",
				position: "relative",
			}}
		>
			<Box
				sx={{
					display: "flex",
					width: "11rem",
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
						marginInlineStart: "1rem",
					}}
				>
					{t(`marketplace_search_for_${searchType.toLowerCase()}`)}
				</Typography>
				<DownMiniBlue
					style={{
						marginInlineStart: "1.4rem",
						transform: dropdown ? "rotate(180deg)" : "rotate(0)",
						transitionDuration: "0.5s",
					}}
				/>
				<Box
					sx={{
						border: "0.6px solid #CFD2FA",
						height: "2.9rem",
					}}
				/>
			</Box>
			<Box
				sx={{
					position: "absolute",
					borderRadius: "0.4rem",
					width: "9.8rem",
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					background: "#fff",
					zIndex: "9",
					border: dropdown && "1px solid #CFD2FA",
					top: "100%",
				}}
				ref={dropdownRef}
			>
				{dropdown &&
					searchDropdown(t).map(({ key, value }, index) => (
						<p
							key={(index, t)}
							style={{
								cursor: "pointer",
								display: "flex",
								flex: 1,
							}}
							onClick={() => {
								setSearchConfig((prev) => ({
									...prev,
									searchType: value,
									searchText: key,
								}));
								setDropdown(!dropdown);
							}}
						>
							{key}
						</p>
					))}
			</Box>
		</Box>
	);
};

export default SelectSearchType;
