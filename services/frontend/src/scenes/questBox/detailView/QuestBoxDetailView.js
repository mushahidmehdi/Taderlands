import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Breadcrumbs, PageCenteredProgress, RouteLayout } from "components";

import { useMarketplaceApi } from "api/marketplace";
import { useQuestBoxApi } from "api/questBox";

import ClaimRequest from "./ClaimRequest";

const QuestBoxDetailView = () => {
	const [campaign, setCampaign] = useState();
	const [merchant, setMerchant] = useState();

	const { id } = useParams();
	const navigate = useNavigate();

	const { getCampaign } = useQuestBoxApi();
	const { getMerchantSelf } = useMarketplaceApi();

	useEffect(() => {
		getCampaign(id)
			.then((res) => {
				setCampaign(res.data.campaign);
				return res.data.campaign;
			})
			.then(() => getMerchantSelf())
			.then((res) => {
				setMerchant(res);
			});
	}, []);

	return (
		<RouteLayout
			headerComp={
				<Breadcrumbs
					paths={[
						{
							text: "Quest Box",
							onClick: () => navigate("/quest-box"),
						},
						{
							text: campaign?.title?.en,
						},
					]}
				/>
			}
		>
			{!campaign && <PageCenteredProgress />}
			{campaign && <ClaimRequest campaign={campaign} merchant={merchant} />}
		</RouteLayout>
	);
};

export default QuestBoxDetailView;
