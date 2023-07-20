import { createContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { Grid, Paper, Tab, Tabs, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { useSnackbar } from "notistack";

import { RouteLayout } from "components";

import { useUserApi } from "api/user";

import { setParities } from "actions/ParityActions";
import { setStrategies } from "actions/StrategyBuilderActions";

import { useFetchAuthorized } from "services";
import Config from "services/config";

import useQuery from "utils/useQuery";

import { Uri, UriCharacter, UriPrime, UriRejected, UriWait } from "images";

import CreateStrategy from "./CreateStrategy";
import MerchantStatusCard from "./MerchantStatusCard";
import MyStrategies from "./MyStrategies";

function a11yProps(index) {
	return {
		id: `simple-tab-${index}`,
		"aria-controls": `simple-tabpanel-${index}`,
	};
}

export const WorkshopContext = createContext();

export default function Workshop() {
	const [tab, setTab] = useState(0);
	const [merchantStatus, setMerchantStatus] = useState();
	const [merchantStrategies, setMerchantStrategies] = useState();

	const theme = useTheme();
	const { t } = useTranslation("workshop");
	const fetchAuthorized = useFetchAuthorized();
	const dispatch = useDispatch();
	const query = useQuery();
	const { enqueueSnackbar } = useSnackbar();
	const navigate = useNavigate();
	const { getProfile } = useUserApi();

	const getParities = () => {
		fetchAuthorized(`${Config.apiRoot()}/platform/parities?status=ACTIVE`, {
			headers: {
				"Content-type": "application/json",
			},
			method: "GET",
		})
			.then((data) => data.json())
			.then((data) => {
				dispatch(setParities([...data?.data?.parities].sort((a, b) => a.symbol.localeCompare(b.symbol))));
			});
	};

	const getStrategies = () => {
		fetchAuthorized(`${Config.apiRoot()}/strategy/strategies`, {
			headers: {
				"Content-type": "application/json",
			},
			method: "GET",
		})
			.then((data) => data.json())
			.then((data) => {
				setMerchantStrategies(data?.data?.strategies);
				dispatch(setStrategies(data?.data?.strategies));
			});
	};

	useEffect(() => {
		getParities();
		getStrategies();
	}, []);

	useEffect(() => {
		const currentTab = query.get("t");

		if (!currentTab || currentTab === "create") {
			setTab(0);
		}

		if (currentTab === "strategies") {
			setTab(1);
		}
	}, [query]);

	useEffect(() => {
		getProfile().then((data) => setMerchantStatus(data?.data.profile.merchant));
	}, []);

	return (
		<RouteLayout header={t("workshop_main_page_title")}>
			<Grid container>
				<Grid item xs={7.5}>
					<Paper sx={{ padding: "24px", marginBottom: "16px" }}>
						<Typography sx={{ color: "#3A3A3A", fontSize: "14px", mt: "8px", mb: "8px" }}>
							{t("workshop_main_page_main_text_1")}
						</Typography>
						<Tabs
							sx={{ textTransform: "null" }}
							variant="fullWidth"
							centered
							value={tab}
							onChange={(_, newValue) => {
								navigate(`/workshop?t=${newValue === 0 ? "create" : "strategies"}`);
							}}
						>
							<Tab
								sx={{ textTransform: "none" }}
								fullWidth
								label={t("workshop_main_page_tab_1_title")}
								{...a11yProps(0)}
							></Tab>
							<Tab
								sx={{ textTransform: "none" }}
								fullWidth
								label={t("workshop_main_page_tab_2_title")}
								{...a11yProps(1)}
							></Tab>
						</Tabs>
						{tab === 0 ? <CreateStrategy /> : <MyStrategies />}
					</Paper>
				</Grid>

				<Grid
					item
					xs={4}
					sx={{
						display: "flex",
						alignItems: "flex-start",
						marginInlineStart: "1rem",
					}}
				>
					{merchantStatus?.progressStatus === "PENDING" ? (
						<MerchantStatusCard
							title={t("workshop_main_page_info_title_3")}
							text={t("workshop_main_page_info_text_3")}
							buttonText={t("workshop_main_page_info_button_3")}
							icon={<UriWait />}
							buttonAction={(x) => navigate("/")}
							color={theme.palette.warning.main}
						/>
					) : merchantStatus?.progressStatus === "ACCEPTED" ? (
						<MerchantStatusCard
							title={t("workshop_main_page_info_title_5")}
							text={t("workshop_main_page_info_text_5")}
							buttonText={t("workshop_main_page_info_button_5")}
							icon={<UriCharacter />}
							buttonAction={(x) => navigate("/expert-panel/" + merchantStatus?.id)}
							color={theme.palette.primary.main}
						/>
					) : merchantStatus?.progressStatus === "REJECTED" ? (
						<MerchantStatusCard
							title={t("workshop_main_page_info_title_4")}
							text={t("workshop_main_page_info_text_4")}
							buttonText={t("workshop_main_page_info_button_4")}
							icon={<UriRejected />}
							buttonAction={(x) => navigate("/workshop/expert-application")}
							color={theme.palette.danger.main}
						/>
					) : merchantStrategies?.length > 0 ? (
						<MerchantStatusCard
							title={t("workshop_main_page_info_title_2")}
							text={t("workshop_main_page_info_text_2")}
							buttonText={t("workshop_main_page_info_button_2")}
							icon={<UriPrime width="96" height="96" color={theme.palette.secondary.main} />}
							buttonAction={(x) => navigate("/workshop/expert-application")}
							color={theme.palette.secondary.main}
						/>
					) : (
						<MerchantStatusCard
							title={t("workshop_main_page_info_title_1")}
							text={t("workshop_main_page_info_text_1")}
							buttonText={t("workshop_main_page_info_button_1")}
							icon={<Uri width="96" height="96" active={true} />}
							buttonAction={(x) =>
								window.open(
									"https://www.youtube.com/watch?v=XpKfINGfPuc&list=PLsU0nkggS3KjTlVHSPIESMDIYNmd0abCm"
								)
							}
							color={theme.palette.primary.main}
						/>
					)}
				</Grid>
			</Grid>
		</RouteLayout>
	);
}
