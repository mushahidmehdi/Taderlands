import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { Grid, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from "@mui/material";

import { CustomTableHead } from "components";
import { Side } from "components/Positions/columns";

import shortenNumber from "utils/shortenNumber";

import { Uri } from "images";

const HEAD_CELLS = (t) => [
	{
		id: "name",
		label: t("marketplace_merchant_profile_details_tab_name"),
	},
	{
		id: "type",
		label: t("marketplace_merchant_profile_details_tab_execution_type"),
	},
	{
		id: "exchange",
		label: t("marketplace_merchant_profile_details_tab_exchange"),
	},
	{
		id: "followers",
		label: t("marketplace_merchant_profile_details_tab_followers"),
	},
	{
		id: "totalVolume",
		label: t("marketplace_merchant_profile_details_tab_total_volume"),
	},
	{
		id: "totalProfit",
		label: t("marketplace_merchant_profile_details_tab_total_profit"),
	},
	{
		id: "averageProfit",
		label: t("marketplace_merchant_profile_details_tab_avg_profit"),
	},
];

export default function MerchantStrategies({ merchantStrategies }) {
	const { t } = useTranslation("marketplace");
	const navigate = useNavigate();
	return (
		<>
			{merchantStrategies && (
				<TableContainer>
					<Table
						sx={{
							minWidth: 750,
							borderCollapse: "separate",
							borderSpacing: "0 0.75rem",
						}}
					>
						<CustomTableHead expand headCells={HEAD_CELLS(t)} />
						<TableBody
							sx={{
								backgroundColor: "white",
							}}
						>
							{merchantStrategies?.map((item, index) => {
								return (
									<TableRow key={index}>
										<TableCell>
											<Grid
												container
												sx={{
													cursor: "pointer",
												}}
												onClick={() => navigate(`/marketplace/strategy/${item.id}`)}
											>
												<Grid item>
													<Uri active={true} width={36} height={36}></Uri>
												</Grid>
												<Grid item>
													<Typography fontWeight="bold" sx={{ ml: "1px", mt: "5px" }}>
														{item.name}
													</Typography>
												</Grid>
											</Grid>
										</TableCell>
										<TableCell>
											<Side label={item.strategy?.executionType}></Side>
										</TableCell>
										<TableCell>
											<Typography
												sx={{
													color: (theme) => theme.palette.primary.main,
												}}
											>
												{item.strategy?.platform?.exchange}
											</Typography>
										</TableCell>
										<TableCell>
											<Typography
												sx={{
													fontSize: "14px",
												}}
											>
												{item.followerCount}
											</Typography>
										</TableCell>
										<TableCell>
											<Typography
												sx={{
													fontSize: "14px",
												}}
											>
												{item.strategy?.strategyStatistics?.totalVolume
													? "$" +
													  shortenNumber(item.strategy?.strategyStatistics?.totalVolume)
													: "0"}
											</Typography>
										</TableCell>
										<TableCell>
											<Typography
												sx={{
													fontSize: "14px",
												}}
											>
												{item.strategy?.strategyStatistics?.totalProfit
													? "$" +
													  shortenNumber(item.strategy?.strategyStatistics?.totalProfit)
													: "0"}
											</Typography>
										</TableCell>
										<TableCell>
											<Typography
												sx={{
													color: (theme) => theme.palette.primary.main,
													fontSize: "14px",
												}}
											>
												{item.strategy?.strategyStatistics?.averageProfit
													? "$" +
													  shortenNumber(item.strategy?.strategyStatistics?.averageProfit)
													: "0"}
											</Typography>
										</TableCell>
										<TableCell />
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				</TableContainer>
			)}
		</>
	);
}
