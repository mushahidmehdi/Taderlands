import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import {
	Button,
	Card,
	Grid,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
} from "@mui/material";

import { Breadcrumbs, PageCenteredProgress, RouteLayout } from "components";

import { useQuestBoxApi } from "api/questBox";
import useCatchError from "api/useCatchError";

import useQuery from "utils/useQuery";

import RankIcon from "../List/RankIcon";

export default function FullList() {
	const { profile } = useSelector((state) => state.user);

	const [processing, setProcessing] = useState(false);
	const [loadMoreDisabled, setLoadMoreDisabled] = useState(false);
	const [campaign, setCampaign] = useState();
	const [selfRank, setSelfRank] = useState();
	const [leaderboard, setLeaderboard] = useState([]);
	const [pageNumber, setPageNumber] = useState(0);

	const PAGE_SIZE = 5;

	const { id } = useParams();
	const navigate = useNavigate();
	const { t } = useTranslation();
	const query = useQuery();

	const { getCampaign, getSelfLeaderboard, getLeaderboard } = useQuestBoxApi();
	const catchError = useCatchError();

	const handleLoadMore = () => {
		setProcessing(true);

		getLeaderboard({ campaignId: id, pageNumber: pageNumber + 1, pageSize: PAGE_SIZE })
			.then((data) => {
				if (!data?.data?.leaderboard?.length) {
					setLoadMoreDisabled(true);
					return;
				}

				setLeaderboard([...leaderboard, ...data?.data?.leaderboard]);
				setPageNumber(pageNumber + 1);
			})
			.catch(catchError)
			.finally(() => setProcessing(false));
	};

	useEffect(() => {
		getCampaign(id)
			.then((res) => setCampaign(res.data.campaign))
			.catch(catchError);
	}, []);

	useEffect(() => {
		if (campaign?.leaderboardInfo) {
			const pageNumber = query.get("pageNumber") ?? 0;

			Promise.all([
				getSelfLeaderboard(id).then((data) => {
					setSelfRank(data?.data?.userRank);
				}),
				getLeaderboard({ campaignId: id, pageNumber, pageSize: PAGE_SIZE }).then((data) => {
					if (!data?.data?.leaderboard?.length) {
						return;
					}

					setLeaderboard(data?.data?.leaderboard);
				}),
			]).catch(catchError);
		}
	}, [campaign?.leaderboardInfo]);

	return (
		<>
			{!campaign || !leaderboard?.length ? (
				<PageCenteredProgress />
			) : (
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
									onClick: () => navigate(`/quest-box/${id}/details`),
								},
								{
									text: t("questbox_full_list_breadcrumbs_title"),
								},
							]}
						/>
					}
				>
					<Card sx={{ p: 3, mt: 2 }}>
						<Grid container justifyContent="center" alignItems="center" sx={{ ml: "auto", mr: "auto" }}>
							<Grid item xs={12}>
								<Typography sx={{ fontSize: "24px", fontWeight: 700, textAlign: "center", mb: 1 }}>
									{t("questbox_full_list_page_title")}
								</Typography>
								<Typography sx={{ textAlign: "center" }}>
									{t("questbox_full_list_page_text_1")}
								</Typography>
								<Typography sx={{ textAlign: "center", mb: 1 }}>
									{t("questbox_full_list_page_text_2")}
								</Typography>
							</Grid>
							<Grid item xs={12}>
								<TableContainer>
									<Table
										sx={{ minWidth: 750, borderCollapse: "separate", borderSpacing: "0 0.75rem" }}
									>
										<TableHead sx={{ borderRadius: 4, border: "none", backgroundColor: "#F0F0F5" }}>
											<TableRow>
												{["rank", "name", "average_profit", "volume", "prize", "score"].map(
													(title, ix) => (
														<TableCell key={ix}>
															{t(`questbox_table_head_${title}`)}
														</TableCell>
													)
												)}
											</TableRow>
										</TableHead>
										<TableBody>
											{[selfRank, ...leaderboard].map((item, ix) => (
												<TableRow
													{...(ix === 0
														? {
																sx: {
																	backgroundColor: (theme) =>
																		theme.palette.primary.main,
																},
														  }
														: {
																sx: {},
														  })}
												>
													<TableCell
														sx={{
															boxShadow: "none",
															borderLeft: "1px solid #0F20E8",
															borderTop: "1px solid #0F20E8",
															borderBottom: "1px solid #0F20E8",
														}}
													>
														<div>
															<Grid container spacing={1}>
																<Grid item>
																	<div style={{ width: "16px" }}>
																		<RankIcon
																			previousRank={item?.previousRank}
																			rank={item?.rank}
																		/>
																	</div>
																</Grid>
																<Grid item>
																	<Typography
																		sx={{
																			fontSize: "18px",
																			fontWeight: 700,
																			width: "18px",
																			color: (theme) =>
																				ix === 0
																					? "#fff"
																					: theme.palette.primary.main,
																		}}
																	>
																		{item?.rank ?? "-"}
																	</Typography>
																</Grid>
															</Grid>
														</div>
													</TableCell>
													<TableCell
														sx={{
															boxShadow: "none",
															borderTop: "1px solid #0F20E8",
															borderBottom: "1px solid #0F20E8",
														}}
													>
														{item?.email &&
														item?.tier !== null &&
														item?.tier !== undefined ? (
															<Grid container>
																<Grid item xs={1.5}>
																	<img
																		src={`https://cdn2.paratica.com/general/dashboard-icons/ori_tier_${
																			item.tier
																		}${ix === 0 ? "_white" : ""}.svg`}
																	/>
																</Grid>
																<Grid item>
																	<Typography
																		sx={{
																			fontSize: "14px",
																			color: (theme) =>
																				ix === 0
																					? "#fff"
																					: theme.palette.primary.main,
																		}}
																	>
																		{item.email}
																	</Typography>
																</Grid>
															</Grid>
														) : (
															<Typography color="white">-</Typography>
														)}
													</TableCell>
													<TableCell
														sx={{
															boxShadow: "none",

															borderTop: "1px solid #0F20E8",
															borderBottom: "1px solid #0F20E8",
														}}
													>
														<Typography
															{...(ix === 0 ? { color: "white" } : {})}
															fontSize="16px"
														>
															{item?.averageProfit ?? "-"}
														</Typography>
													</TableCell>
													<TableCell
														sx={{
															boxShadow: "none",
															borderTop: "1px solid #0F20E8",
															borderBottom: "1px solid #0F20E8",
														}}
													>
														<Typography
															{...(ix === 0 ? { color: "white" } : {})}
															fontSize="16px"
														>
															{item?.totalVolume ? `$${item.totalVolume}` : "-"}
														</Typography>
													</TableCell>
													<TableCell
														sx={{
															boxShadow: "none",

															borderTop: "1px solid #0F20E8",
															borderBottom: "1px solid #0F20E8",
														}}
													>
														<Typography
															sx={{
																color: (theme) => theme.palette.success.main,
																fontSize: "16px",
																fontWeight: 700,
															}}
														>
															{item?.tier !== null && item?.tier !== undefined
																? campaign.leaderboardInfo.tierList[item.tier]?.reward
																: "-"}
														</Typography>
													</TableCell>
													<TableCell
														sx={{
															boxShadow: "none",
															borderRight: "1px solid #0F20E8",
															borderTop: "1px solid #0F20E8",
															borderBottom: "1px solid #0F20E8",
														}}
													>
														<Typography
															{...(ix === 0 ? { color: "white" } : {})}
															sx={{ fontSize: "16px", fontWeight: 700 }}
														>
															{item?.score ?? "-"}
														</Typography>
													</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								</TableContainer>
							</Grid>
							<Grid item xs={12}>
								<Button
									disabled={processing || loadMoreDisabled}
									onClick={() => handleLoadMore()}
									variant="outlined"
									fullWidth
								>
									Load More
								</Button>
							</Grid>
						</Grid>
					</Card>
				</RouteLayout>
			)}
		</>
	);
}
