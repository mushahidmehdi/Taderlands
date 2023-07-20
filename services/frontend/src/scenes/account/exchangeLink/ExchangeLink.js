import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { Grid, Paper, Typography } from "@mui/material";

import { EXCHANGE_TEXT_MAP } from "constants";
import { useSnackbar } from "notistack";

import { Breadcrumbs, PageCenteredProgress, RouteLayout } from "components";

import { usePlatformApi } from "api/platform";

import { setConnections } from "actions/ConnectionActions";
import { setPlatforms } from "actions/PlatformActions";

import Config from "services/config";

import ExchangeCard from "./ExchangeCard";
import ExchangeLinkOperations from "./ExchangeLinkOperations";

export default function ExchangeLink() {
	const { platforms } = useSelector((state) => state.platform);
	const { connections } = useSelector((state) => state.connection);

	const [operationsOpen, setOperationsOpen] = useState(false);
	const [operationConnection, setOperationConnection] = useState();
	const [operationPlatform, setOperationPlatform] = useState();
	const [processing, setProcessing] = useState(false);

	const { t } = useTranslation("accountCenter");
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { enqueueSnackbar } = useSnackbar();

	const { getPlatforms, getConnections } = usePlatformApi();

	const handleNext = (exchange) => {
		if (exchange && exchange in connections) {
			setOperationConnection(connections[exchange][0]);
			setOperationPlatform(groupedPlatforms[exchange][0]);
			setOperationsOpen(true);
		} else {
			navigate("add-info", {
				state: {
					platformName: groupedPlatforms?.[exchange]?.[0]?.name,
					platform: groupedPlatforms?.[exchange]?.[0],
				},
			});
			return;
		}
	};

	useEffect(() => {
		setProcessing(true);

		Promise.all([
			getPlatforms()
				.then((data) => dispatch(setPlatforms(data?.data?.platforms)))
				.catch((err) => {
					console.log(err);
					enqueueSnackbar(t("common:Bir hata ile karşılaşıldı"), { variant: "error" });
				}),
			getConnections()
				.then((data) =>
					dispatch(
						setConnections(
							data?.data?.connections?.reduce((group, connection) => {
								const { exchange } = connection.platform;
								group[exchange] = group[exchange] ?? [];
								group[exchange].push(connection);
								return group;
							}, {})
						)
					)
				)
				.catch((err) => {
					enqueueSnackbar(t("common:Bir hata ile karşılaşıldı"), { variant: "error" });
				}),
		]).finally(() => {
			setProcessing(false);
		});
	}, []);

	const groupedPlatforms = platforms?.reduce((group, platform) => {
		const { exchange } = platform;

		group[exchange] = group[exchange] ?? [];
		group[exchange].push(platform);
		return group;
	}, {});

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
								text: t("account_center_connections_main_title"),
							},
						]}
					/>
				}
			>
				{operationConnection && operationPlatform && (
					<ExchangeLinkOperations
						open={operationsOpen}
						onClose={() => setOperationsOpen(false)}
						operationsOpen={operationsOpen}
						setOperationsOpen={setOperationsOpen}
						connection={operationConnection}
						platform={operationPlatform}
					></ExchangeLinkOperations>
				)}

				<Grid container>
					<Grid item xs={12}>
						<Paper sx={{ mt: 2, backgroundColor: "#FFFFFF", padding: 5 }}>
							<Grid container>
								{groupedPlatforms && (
									<>
										<Grid item xs={12}>
											<Typography fontWeight={"Bold"} sx={{ fontSize: "24px" }}>
												{t("account_center_connections_add_connection_main_title")}
											</Typography>
										</Grid>
										<Grid item xs={12}>
											<Typography sx={{ mt: 2, fontSize: "14px" }}>
												{t("account_center_connections_add_connection_main_text")}
											</Typography>
										</Grid>
									</>
								)}
								{groupedPlatforms &&
									connections &&
									Object.keys(groupedPlatforms)?.map(
										(exchange, ix) =>
											!(exchange in connections) &&
											groupedPlatforms[exchange][0].active &&
											groupedPlatforms[exchange][0].info?.portfolioTracking && (
												<Grid item xs={3} sx={{ mt: 2, mr: 2 }} key={ix}>
													<ExchangeCard
														title={EXCHANGE_TEXT_MAP[exchange]}
														exchange={exchange}
														icon={`${Config.cdnRoot()}/general/exchange-icons/${exchange}.png`}
														marketTypes={groupedPlatforms[exchange].reduce((acc, curr) => {
															acc = [...acc, ...curr?.info.marketTypes];
															return acc;
														}, [])}
														featured={groupedPlatforms[exchange][0].info.featured}
														handleNext={handleNext}
													></ExchangeCard>
												</Grid>
											)
									)}
								{connections && (
									<Grid item xs={12}>
										<Typography fontWeight={"Bold"} sx={{ mt: 3, fontSize: "24px" }}>
											{t("account_center_connections_connected_accounts_main_title")}
										</Typography>
									</Grid>
								)}
								{groupedPlatforms &&
									connections &&
									Object.keys(connections)?.map((exchange, ix) => (
										<Grid item xs={3} sx={{ mt: 2, mr: 2 }} key={ix}>
											<ExchangeCard
												title={`${
													EXCHANGE_TEXT_MAP[connections[exchange][0].platform.exchange]
												} (${connections[exchange][0].name})`}
												exchange={exchange}
												icon={`${Config.cdnRoot()}/general/exchange-icons/${exchange}.png`}
												marketTypes={groupedPlatforms[exchange].reduce((acc, curr) => {
													acc = [...acc, ...curr?.info.marketTypes];
													return acc;
												}, [])}
												featured={false}
												active={connections[exchange][0].isActive}
												connection={connections[exchange][0]}
												handleNext={handleNext}
											></ExchangeCard>
										</Grid>
									))}
							</Grid>
						</Paper>
					</Grid>
				</Grid>
			</RouteLayout>
		</>
	);
}
