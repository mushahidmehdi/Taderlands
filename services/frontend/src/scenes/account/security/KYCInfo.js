import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import { Box, Grid, Icon, Link, Paper, Typography } from "@mui/material";

import { useSnackbar } from "notistack";

import { Breadcrumbs, PageCenteredProgress, RouteLayout, Select } from "components";

import { useCommonApi } from "api/common";
import { useDashboardApi } from "api/dashboard";
import { usePaymentApi } from "api/payment";

import { ProveId, SmallLogo } from "images";

export default function KYCInfo() {
	const { profile } = useSelector((state) => state.user);

	const [processing, setProcessing] = useState(false);
	const [qrCode, setQrCode] = useState();
	const [countries, setCountries] = useState();
	const [selectedCountry, setSelectedCountry] = useState("");
	const [clientIp, setClientIp] = useState();

	const navigate = useNavigate();
	const { enqueueSnackbar } = useSnackbar();
	const { t, i18n } = useTranslation("accountCenter");

	const { getConfig } = useDashboardApi();
	const { kycStart } = usePaymentApi();
	const { getClientIp } = useCommonApi();

	useEffect(() => {
		if (selectedCountry && clientIp) {
			kycStart(clientIp).then((data) => setQrCode(data.data?.kycProcess));
		}
	}, [selectedCountry, clientIp]);

	useEffect(() => {
		if (profile?.userSecuritySetting?.kycStatus !== "NOT_COMPLETED") navigate("/account-center");
	}, [profile]);

	useEffect(() => {
		if (!clientIp) {
			getClientIp().then((data) => setClientIp(data.ip));
		}
	}, [clientIp]);

	useEffect(() => {
		setProcessing(true);

		Promise.all([
			getConfig("KYC_COUNTRIES").then((data) =>
				setCountries(
					[
						...data.data["Africa"],
						...data.data["Asia & Pacific"],
						...data.data["Europe"],
						...data.data["Middle East"],
						...data.data["North America"],
						...data.data["South America"],
					]?.sort((a, b) =>
						i18n.resolvedLanguage === "en" ? a.en.localeCompare(b.en) : a.tr.localeCompare(b.tr)
					)
				)
			),
		]).finally(() => {
			setProcessing(false);
		});
	}, []);

	return (
		<>
			{processing && <PageCenteredProgress />}
			<RouteLayout
				headerComp={
					<Breadcrumbs
						paths={[
							{
								text: t("common:Account Center"),
								onClick: () => navigate("/account-center"),
							},
							{
								text: t("account_center_security_kyc_main_title"),
							},
						]}
					/>
				}
			>
				<Grid container sx={{ mb: 2 }}>
					<Grid item xs={12}>
						<Paper sx={{ backgroundColor: "#FFFFFF", padding: 4 }}>
							<Grid container>
								<Grid item xs={12}>
									<Typography sx={{ mt: 2, fontSize: "24px" }}>
										{t("account_center_security_kyc_page_title")}
									</Typography>
								</Grid>
								<Grid item xs={12}>
									<Typography sx={{ mt: 2, fontSize: "14px" }}>
										{t("account_center_security_kyc_page_text")}
									</Typography>
								</Grid>
								<Paper
									sx={{
										mt: 2,
										backgroundColor: "#F4F5FC",
										width: "80%",
										padding: 5,
										display: "flex",
										flexDirection: "column",
										alignItems: "center",
									}}
								>
									<Typography sx={{ mt: 2, textAlign: "center" }}>
										{t("account_center_security_kyc_page_connection_text")}
									</Typography>

									<Box
										sx={{
											display: "flex",
											flexDirection: "row",
											alignItems: "center",
											justifyContent: "center",
											mt: 2,
										}}
									>
										<Icon color="primary" sx={{ width: 50, height: 50, backgroundColor: "white" }}>
											<Box sx={{ mt: "15%" }}>
												<SmallLogo />
											</Box>
										</Icon>
										<Icon color="primary" sx={{ width: 50, height: 50, mt: 3, ml: 1 }}>
											<SwapHorizIcon />
										</Icon>
										<Icon color="primary" sx={{ width: 50, height: 50, backgroundColor: "white" }}>
											<ProveId />
										</Icon>
									</Box>
									{countries && (
										<Select
											containerProps={{ sx: { width: "100%", textAlign: "center" } }}
											selectProps={{ sx: { width: "300px" } }}
											formControlProps={{ sx: { width: "300px" } }}
											label={t("account_center_security_kyc_page_select_text")}
											onChange={(e) => setSelectedCountry(e.target.value)}
											value={selectedCountry ? selectedCountry[i18n?.resolvedLanguage] : ""}
											options={countries?.map((item) => ({
												value: item,
												content: <Typography>{item[i18n?.resolvedLanguage]}</Typography>,
											}))}
										></Select>
									)}

									{qrCode && (
										<>
											<Paper
												sx={{
													backgroundColor: "#FFFFFF",
													padding: 4,
													mt: 2,
													textAlign: "center",
												}}
											>
												<Typography fontWeight={"bold"} sx={{ mt: 2, fontSize: "16px" }}>
													{t("account_center_security_kyc_page_qr_text")}
												</Typography>
												<Box component="img" src={qrCode.qr}></Box>
											</Paper>

											<Typography sx={{ fontSize: "14px", mt: 2, alignSelf: "center" }}>
												{t("account_center_security_2fa_page_or_text")}
											</Typography>

											<Link
												target="_blank"
												rel="noopener noreferrer"
												href={qrCode.kycProcessUrl}
												sx={{ fontSize: "14px", mt: 2, alignSelf: "center" }}
											>
												www.proveid.com/kyc/traderlands
											</Link>
										</>
									)}
								</Paper>
							</Grid>
						</Paper>
					</Grid>
				</Grid>
			</RouteLayout>
		</>
	);
}
