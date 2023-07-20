import React from "react";
import { useTranslation } from "react-i18next";

import { Box, Button, Grid, LinearProgress, Typography } from "@mui/material";

import { Dialog } from "components";

import Config from "services/config";

import shortenNumber from "utils/shortenNumber";

export default function PortfolioDialog({ dialogOpen, setDialogOpen, item }) {
	const { t } = useTranslation();

	const handleClose = () => {
		setDialogOpen(false);
	};

	return (
		<Dialog
			dialogProps={{ open: dialogOpen, onClose: handleClose }}
			title={<Typography sx={{ fontSize: "24px" }}>{t("dashboard_portfolio_details_exhange")}</Typography>}
			content={
				<React.Fragment
					sx={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
					}}
				>
					<Box
						component="img"
						src={`${Config.cdnRoot()}/general/exchange-icons/${item?.platform?.exchange}.png`}
						sx={{ width: 90, height: 90 }}
					/>
					<Typography
						sx={{
							fontSize: "16px",
							mt: 1,
						}}
					>
						{item.platform?.name}
					</Typography>
					<Typography
						sx={{
							fontSize: "24px",
							color: (theme) => theme.palette.secondary.main,
							mt: 1,
						}}
					>
						{`$${
							item?.stableAmounts?.totalUsdtAmount
								? shortenNumber(item?.stableAmounts?.totalUsdtAmount)
								: "0.00"
						}`}
					</Typography>
					<Typography
						sx={{
							fontSize: "9px",
							color: "#AEAEAE",
						}}
					>
						{new Date(item.createdAt).toLocaleString()}
					</Typography>
					<Grid container sx={{ width: 500 }}>
						{item?.portfolio?.assets
							?.sort((a, b) => {
								return b?.usdtAmount - a?.usdtAmount;
							})
							?.slice(0, 4)
							?.map((asset, ix) => (
								<>
									<Grid xs={4}>
										<Typography
											sx={{
												fontSize: "16px",
												color: (theme) => theme.palette.secondary.main,
												mt: 1,
											}}
										>
											{asset.coinName}
										</Typography>
									</Grid>
									<Grid xs={4}>
										<LinearProgress
											sx={{
												mt: 2,
											}}
											variant="determinate"
											value={(100 * asset.usdtAmount) / item.stableAmounts.totalUsdtAmount}
										></LinearProgress>
									</Grid>
									<Grid xs={4}>
										<Typography
											sx={{
												fontSize: "16px",
												color: (theme) => theme.palette.secondary.main,
												mt: 1,
												textAlign: "end",
											}}
										>
											{`$${asset.usdtAmount ? shortenNumber(asset.usdtAmount) : "0.00"}`}
										</Typography>
									</Grid>
								</>
							))}
						{item?.portfolio?.assets?.length > 4 && (
							<>
								<Grid xs={4}>
									<Typography
										sx={{
											fontSize: "16px",
											color: (theme) => theme.palette.secondary.main,
											mt: 1,
										}}
									>
										{"Others"}
									</Typography>
								</Grid>
								<Grid xs={4}>
									<LinearProgress
										sx={{
											mt: 2,
										}}
										variant="determinate"
										value={
											(100 *
												item.portfolio?.assets
													?.sort((a, b) => {
														return b?.usdtAmount - a?.usdtAmount;
													})
													?.slice(4, item?.portfolio?.assets?.length)
													?.reduce(function (a, b) {
														return a + b["usdtAmount"];
													}, 0)) /
											item.total_usd_amount
										}
									></LinearProgress>
								</Grid>
								<Grid xs={4}>
									<Typography
										sx={{
											fontSize: "16px",
											color: (theme) => theme.palette.secondary.main,
											mt: 1,
											textAlign: "end",
										}}
									>
										{`$${shortenNumber(
											item.portfolio?.assets
												?.sort((a, b) => {
													return b?.usdtAmount - a?.usdtAmount;
												})
												?.slice(4, item?.portfolio?.assets?.length)
												?.reduce(function (a, b) {
													return a + b["usdtAmount"];
												}, 0)
										)}`}
									</Typography>
								</Grid>
							</>
						)}
					</Grid>
					<Button
						variant="outlined"
						sx={{ fontSize: "16px", mt: 2, width: 250 }}
						onClick={(e) => handleClose()}
					>
						{t("exchangeLink.Close")}
					</Button>
				</React.Fragment>
			}
		></Dialog>
	);
}
