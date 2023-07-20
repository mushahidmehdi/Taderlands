import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import { Box, Button, Card, Grid, Paper, Typography } from "@mui/material";

import { useSnackbar } from "notistack";

import {
	ProfileCardActions,
	ProfileCardBio,
	ProfileCardInfo,
	ProfileCardMediaArea,
	RouteLayout,
	TabPanel,
} from "components";

import { useMarketplaceApi } from "api/marketplace";
import { useStrategyApi } from "api/strategy";

import { Sync } from "images";

import ExpertPanelSkeleton from "./ExpertPanelSkeleton";
import { EditProfileDialog } from "./editProfile";
import { Strategies } from "./strategies";

export default function ExpertPanel() {
	const { profile } = useSelector((state) => state.user);

	const [processing, setProcessing] = useState(true);
	const [tab, setTab] = useState(1);
	const [open, setOpen] = useState(false);
	const [merchant, setMerchant] = useState({});
	const [strategies, setStrategies] = useState({});

	const { enqueueSnackbar } = useSnackbar();

	const { t } = useTranslation("expertPanel");
	const { id } = useParams();
	const navigate = useNavigate();

	const { getMerchant } = useMarketplaceApi();
	const { getStrategies } = useStrategyApi();

	const handleRefreshStategies = () => {
		setProcessing(true);
		getStrategies()
			.then((data) => setStrategies(data))
			.finally(() => {
				setProcessing(false);
			});
	};

	useEffect(() => {
		if (!id || id != profile?.merchant?.id || profile?.merchant?.progressStatus !== "ACCEPTED") {
			navigate("/");
			return;
		}

		Promise.all([
			getMerchant(id).then((data) => setMerchant(data)),
			getStrategies().then((data) => setStrategies(data)),
		])
			.catch((err) => {
				enqueueSnackbar(t("common:Bir hata ile karşılaşıldı"), { variant: "error" });
			})
			.finally(() => {
				setProcessing(false);
			});
	}, []);

	return (
		<RouteLayout header={t("expert_panel_main_title")}>
			{processing ? (
				<ExpertPanelSkeleton />
			) : (
				<div style={{ marginRight: "4vw" }}>
					<Grid container spacing={2}>
						<Grid item xs={8}>
							<Paper elevation={0} sx={{ padding: "24px", marginBottom: "16px" }}>
								<Box sx={{ display: "flex", justifyContent: "space-between", paddingBlock: "1rem" }}>
									<Typography sx={{ fontSize: "24px", fontWeight: 700, marginBottom: "8px" }}>
										{t("expert_panel_strategies_page_title")}
									</Typography>

									<Button startIcon={<Sync />} onClick={handleRefreshStategies}>
										{t("expert_panel_share_strategy_refresh_button")}
									</Button>
								</Box>

								<Typography variant="p" sx={{ color: "#3A3A3A", fontSize: "14px" }}>
									{t("expert_panel_strategies_page_text")}
								</Typography>

								<TabPanel value={tab} index={1}>
									<Strategies
										strategies={strategies}
										handleRefreshStategies={handleRefreshStategies}
									/>
								</TabPanel>
							</Paper>
						</Grid>
						<Grid item xs={4}>
							<Card elevation={0}>
								<ProfileCardMediaArea
									bannerImgUrl={merchant?.bannerPictureUrl}
									profileImgUrl={merchant?.profilePictureUrl}
								/>
								<ProfileCardInfo title={merchant?.nickname} socialLinks={merchant?.socialLinks} />

								<ProfileCardBio
									bioContent={merchant.bio && merchant.bio.length > 0 ? merchant.bio[0].text : ""}
									merchantStatistics={merchant?.merchantStatistics}
								/>
								<ProfileCardActions
									onClick={() => {
										setOpen(true);
									}}
									buttonText={t("expert_panel_profile_card_edit_button")}
								/>
							</Card>
						</Grid>
					</Grid>
				</div>
			)}
			{open && (
				<EditProfileDialog
					open={open}
					merchant={merchant}
					onClose={() => {
						getMerchant(id).then((data) => setMerchant(data));
						setOpen(false);
					}}
				/>
			)}
		</RouteLayout>
	);
}
