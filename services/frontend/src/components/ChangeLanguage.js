import React from "react";
import { useTranslation } from "react-i18next";

import { Grid } from "@mui/material";

import { Select } from "components";

export default function ChangeLanguage() {
	const { i18n } = useTranslation("common");

	const obj = {
		"tr-tr": (
			<>
				<img
					loading="lazy"
					width="20"
					src={`https://flagcdn.com/w20/tr.png`}
					srcSet={`https://flagcdn.com/w40/tr.png 2x`}
					alt=""
					sx={{ mr: 1 }}
				/>
				&nbsp; Turkish
			</>
		),
		"en-us": (
			<>
				<img
					loading="lazy"
					width="20"
					src={`https://flagcdn.com/w20/gb.png`}
					srcSet={`https://flagcdn.com/w40/gb.png 2x`}
					alt=""
				/>
				&nbsp; English
			</>
		),
	};

	const handleChange = (e) => {
		i18n.changeLanguage(e.target.value);
	};

	return (
		<Grid container direction="row" justifyContent="space-between" alignItems="center">
			<Grid item></Grid>
			<Grid item>
				<Select
					value={i18n.language}
					onChange={handleChange}
					options={[
						{
							value: "tr-tr",
							content: (
								<>
									<img
										loading="lazy"
										width="20"
										src={`https://flagcdn.com/w20/tr.png`}
										srcSet={`https://flagcdn.com/w40/tr.png 2x`}
										alt=""
										sx={{ mr: 1 }}
									/>
									&nbsp; Turkish
								</>
							),
						},
						{
							value: "en-us",
							content: (
								<>
									<img
										loading="lazy"
										width="20"
										src={`https://flagcdn.com/w20/gb.png`}
										srcSet={`https://flagcdn.com/w40/gb.png 2x`}
										alt=""
									/>
									&nbsp; English
								</>
							),
						},
					]}
					selectProps={{
						renderValue: (p) => obj[p],
					}}
					// sx={{ p: "2px", border: (theme) => `1px solid ${theme.palette.primary.main}` }}
				></Select>
			</Grid>
		</Grid>
	);
}
