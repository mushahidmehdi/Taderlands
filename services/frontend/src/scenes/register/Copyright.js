import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { Box, FormControl, Link, MenuItem, Select, Typography } from "@mui/material";

export default function Copyright({ sx }) {
	const [language, setLanguage] = useState();
	const { t, i18n } = useTranslation("common");

	useEffect(() => {
		if (i18n.language) {
			setLanguage(i18n.language);
			return;
		}
		i18n.changeLanguage("tr-tr");
		setLanguage("tr-tr");
	}, [i18n]);

	const handleChange = (e) => {
		i18n.changeLanguage(e.target.value);
		setLanguage(e.target.value);
	};

	return (
		<>
			{language && (
				<Box
					sx={{
						width: "100%",
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						...sx,
					}}
				>
					<FormControl size="small">
						<Select value={language} sx={{ borderWidth: 0 }} onChange={handleChange}>
							<MenuItem value={"tr-tr"}>
								<img
									loading="lazy"
									width="20"
									src={`https://flagcdn.com/w20/tr.png`}
									srcSet={`https://flagcdn.com/w40/tr.png 2x`}
									alt=""
									sx={{ mr: 1 }}
								/>
								&nbsp; Turkish
							</MenuItem>
							<MenuItem value={"en-us"}>
								<img
									loading="lazy"
									width="20"
									src={`https://flagcdn.com/w20/gb.png`}
									srcSet={`https://flagcdn.com/w40/gb.png 2x`}
									alt=""
								/>
								&nbsp; English
							</MenuItem>
						</Select>
					</FormControl>

					<Typography variant="body2" color="text.secondary" align="center">
						{"© "}
						{new Date().getFullYear()}{" "}
						<Link color="inherit" href="https://paratica.com/">
							Paratica.
						</Link>{" "}
						{t("Copyright")}
						{"."}
					</Typography>
				</Box>
			)}
		</>
	);
}
