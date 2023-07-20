import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { Grid, Paper, Tab, Tabs } from "@mui/material";

import { Config } from "services";

import useQuery from "utils/useQuery";

import TopBar from "./TopBar";

const fileArray = ["user_agreement", "privacy_policy", "cookies_policy", "aml_policy"];

export default function Agreements() {
	const [tab, setTab] = useState("1");
	const { t, i18n } = useTranslation("register");
	const query = useQuery();
	const navigate = useNavigate();

	useEffect(() => {
		if (query && query.get("tab")) {
			setTab(query.get("tab"));
		}
	}, [query]);

	const FrameAgreementsComponent = ({ fileName }) => (
		<Paper
			sx={{
				padding: "32px",
				color: "#3A3A3A",
				fontSize: "14px",
				mt: "8px",
				mb: "8px",
				mr: "auto",
				ml: "auto",
				height: "70vh",
				width: "52vw",
			}}
		>
			<iframe
				// sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
				style={{ backgroundColor: "transparent" }}
				allowTransparency="true"
				width="100%"
				height="100%"
				src={`${Config.cdnRoot()}/general/agreements/${
					i18n.resolvedLanguage
				}/${fileName}.pdf#toolbar=0&navpanes=0`}
				type="application/pdf"
			/>
		</Paper>
	);

	return (
		<Grid container>
			<TopBar />
			<Grid container spacing={2} sx={{ ml: "135px", mr: "135px" }}>
				<Grid item xs={12} sx={{ mt: "47px" }}>
					<Tabs variant="fullWidth" centered value={tab}>
						{[
							t("aggreements_user"),
							t("aggreements_privacy_policy"),
							t("aggreements_cookie_policy"),
							t("aggreements_aml"),
						].map((item, ix) => (
							<Tab
								sx={{ textTransform: "none" }}
								fullWidth
								value={(ix + 1).toString()}
								label={item}
								onClick={() => navigate(`/agreements?tab=${ix + 1}`)}
							></Tab>
						))}
					</Tabs>
				</Grid>
				<Grid item xs={12} sx={{ mt: "16px", padding: "32px" }}>
					{fileArray.map((item, ix) => (
						<>{tab == ix + 1 && <FrameAgreementsComponent fileName={item} />}</>
					))}
				</Grid>
			</Grid>
		</Grid>
	);
}
