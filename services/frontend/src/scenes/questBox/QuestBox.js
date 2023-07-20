import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { Box, Grid } from "@mui/material";

import dayjs from "dayjs";
import { sortBy } from "lodash";

import { RouteLayout } from "components";

import { useQuestBoxApi } from "api/questBox";
import useCatchError from "api/useCatchError";

import TypeHandler from "./TypeHandler";
import { QuestBoxCard } from "./carousel";
import ArrivalCards from "./carousel/ArrivalCards";
import QuestBoxBanner from "./carousel/QuestBoxBanner";

const QuestBox = () => {
	const { t } = useTranslation();
	const [tab, setTab] = useState("ALL");

	const [campaigns, setCampaigns] = useState([]);
	const [campaignAttendances, setCampaignAttendances] = useState([]);

	const { getCampaigns, getCampaignAttendances } = useQuestBoxApi();
	const catchError = useCatchError();

	useEffect(() => {
		Promise.all([
			getCampaigns().then((data) => setCampaigns(data?.data?.campaigns)),
			getCampaignAttendances().then((data) => setCampaignAttendances(data?.data?.campaignAttendances)),
		]).catch(catchError);
	}, []);

	const scrollRef = useRef(null);

	const handleScrollLeft = () => {
		scrollRef.current.scrollBy({ left: -440, behavior: "smooth" });
	};

	const handleScrollRight = () => {
		scrollRef.current.scrollBy({ left: 440, behavior: "smooth" });
	};

	const today = dayjs();

	return (
		<RouteLayout header={t("Quest Box")}>
			<Grid container>
				<Grid item xs={12}>
					<TypeHandler tab={tab} setTab={setTab} showActiveTab={Boolean(campaignAttendances?.length)} />
					<Box
						sx={{
							display: "flex",
							overflowX: "auto",
							scrollbarWidth: "none",
							gap: "1rem",
							width: "84vw",
							"&::-webkit-scrollbar": {
								display: "none",
							},
						}}
						ref={scrollRef}
					>
						{sortBy(
							campaigns.filter((x) => {
								const onActiveTab =
									campaignAttendances.some((y) => y.campaignId === x.id) &&
									dayjs(x.startDate).isBefore(dayjs());

								return (
									x.onTop &&
									(tab === "ALL" ? !onActiveTab : true) &&
									(tab === "CREATOR" ? x.forMerchant : true) &&
									(tab === "ACTIVE" ? onActiveTab : true)
								);
							}),
							["order"]
						).map((campaign) => (
							<QuestBoxCard
								data={campaign}
								campaignAttendance={campaignAttendances.find((x) => x.campaignId === campaign.id)}
							/>
						))}
					</Box>

					<QuestBoxBanner />

					<Box
						sx={{
							display: "flex",
							overflowX: "auto",
							scrollbarWidth: "none",
							gap: "1rem",
							width: "84vw",
							"&::-webkit-scrollbar": {
								display: "none",
							},
							marginBlockStart: "1rem",
						}}
					>
						{sortBy(
							campaigns.filter((x) => !x.onTop),
							["order"]
						).map((campaign) => (
							<ArrivalCards campaign={campaign} />
						))}
					</Box>
				</Grid>
			</Grid>
		</RouteLayout>
	);
};

export default QuestBox;
