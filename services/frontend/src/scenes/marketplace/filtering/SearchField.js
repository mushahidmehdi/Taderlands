import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { Box } from "@mui/material";

import queryBuilder from "utils/queryBuilder";

import { SearchIcon } from "images";

const SearchField = ({ filter, tab }) => {
	const [keyWord, setKeyWord] = useState(filter?.where?.search ?? "");
	const { t } = useTranslation("marketplace");
	const navigate = useNavigate();

	const onPressEnter = (e) => {
		if (e.key === "Enter") {
			if (tab === "EXPERT") {
				navigate(
					`/marketplace?${queryBuilder({
						merchant: e.target.value,
					})}`
				);
				return;
			}

			navigate(
				`/marketplace?${queryBuilder({
					...filter?.where,
					...filter.orderBy,
					search: e.target.value,
				})}`
			);
		}
	};
	return (
		<Box
			sx={{
				display: "flex",
				alignItems: "center",
				marginInline: "auto",
				position: "relative",
				backgroundColor: "#fff",
				border: "1px solid #CFD2FA",
				height: "43px",
				width: "289px",
				borderRadius: "4px",
				padding: "15px 16px 15px 16px",
			}}
		>
			<SearchIcon style={{ width: "1.5rem", height: "1.4rem", marginInlineStart: "0.4rem" }} />
			<input
				placeholder={t("Search")}
				style={{
					padding: "0.8rem",
					width: "100%",
					fontSize: "1rem",
					fontWeight: 300,
					outline: "none",
					border: "none",
					backgroundColor: "transparent",
					color: "#AEAEAE",
				}}
				value={keyWord}
				onChange={(e) => setKeyWord(e.target.value)}
				onKeyDown={(e) => onPressEnter(e)}
			/>
		</Box>
	);
};

export default SearchField;
