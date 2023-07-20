import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import { Grid } from "@mui/material";

import { RouteLayout } from "components";
import PageCenteredProgress from "components/PageCenteredProgress";

import { useMarketplaceApi } from "api/marketplace";
import useCatchError from "api/useCatchError";

import MerchantCard from "./MerchantCard";
import MerchantStatistics from "./MerchantStatistics";
import MerchantStrategies from "./MerchantStrategies";

export default function Merchant() {
	const [processing, setProcessing] = useState(true);
	const [merchant, setMerchant] = useState();
	const [marketStrategies, setMarketStrategies] = useState();
	const { id } = useParams();

	const { t } = useTranslation("marketplace");

	const { getMerchant, getMarketStrategies } = useMarketplaceApi();
	const catchError = useCatchError();

	useEffect(() => {
		Promise.all([
			getMerchant(id).then((data) => setMerchant(data)),
			getMarketStrategies({ where: { merchantId: id } }).then((data) => setMarketStrategies(data)),
		]).finally(() => setProcessing(false));
	}, []);

	return (
		<>
			{processing ? (
				<PageCenteredProgress open={processing} />
			) : (
				<RouteLayout header={t("marketplace_merchant_profile_title")}>
					<div style={{ marginRight: "4vw" }}>
						<Grid container spacing={2}>
							<Grid item xs={12} sx={{ mt: 2 }}>
								<Grid container>
									<Grid item xs={8}>
										<MerchantStatistics merchantStatistics={merchant?.merchantStatistics} />
									</Grid>
									<Grid item xs={4}>
										<MerchantCard merchant={merchant} />
									</Grid>
									<Grid item xs={12}>
										<MerchantStrategies merchantStrategies={marketStrategies} />
									</Grid>
								</Grid>
							</Grid>
						</Grid>
					</div>
				</RouteLayout>
			)}
		</>
	);
}
