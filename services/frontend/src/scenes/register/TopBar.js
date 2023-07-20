import * as React from "react";
import { useTranslation } from "react-i18next";

import { ArrowLeft } from "@mui/icons-material";
import { AppBar, Box, IconButton, Link, Toolbar } from "@mui/material";

import { Config } from "services";

import { logo } from "images";

export default function TopBar() {
	// eslint-disable-next-line react-hooks/rules-of-hooks
	const { t } = useTranslation("common");

	return (
		<React.Fragment>
			<AppBar position="static">
				<Toolbar
					sx={{
						backgroundColor: "#FFFFFF",
						display: "flex",
						flexDirection: "row",
						alignItems: "center",
						justifyContent: "space-between",
					}}
				>
					<IconButton size="large" sx={{ color: "#B5B5B5", ml: 10 }}>
						<ArrowLeft />
						<Link
							href={Config.landingRoot()}
							fontSize={"14px"}
							fontWeight={400}
							color={"#AEAEAE"}
							fontFamily={"Comfortaa"}
							style={{ textDecoration: "none" }}
						>
							{t("Return To Main")}
						</Link>
					</IconButton>
					<Box component="img" src={logo} sx={{ color: "#B5B5B5", ml: -30 }} />
					<div sx={{ width: 20 }}></div>
				</Toolbar>
			</AppBar>
		</React.Fragment>
	);
}
