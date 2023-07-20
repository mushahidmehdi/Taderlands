import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import { Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";

import { CustomDate, SmallText } from "components";

export default function Positions() {
	const { positions } = useSelector((state) => state.backtest);
	const { t } = useTranslation("workshop");

	const columns = [
		t("workshop_backtest_result_positions_table_text_1"),
		t("workshop_backtest_result_positions_table_text_2"),
		t("workshop_backtest_result_positions_table_text_3"),
		t("workshop_backtest_result_positions_table_text_4"),
		t("workshop_backtest_result_positions_table_text_5"),
		t("workshop_backtest_result_positions_table_text_6"),
		t("workshop_backtest_result_positions_table_text_7"),
		t("workshop_backtest_result_positions_table_text_8"),
	];

	const reflectChanges = (theme, value) =>
		value > 0 ? theme.palette.success.main : value === 0 ? theme.palette.info.main : theme.palette.error.main;

	return (
		<Grid container>
			<Grid item xs={12}>
				<SmallText>{t("workshop_backtest_positions_sub_text")}</SmallText>
			</Grid>
			<Grid item xs={12}>
				<TableContainer>
					<Table sx={{ minWidth: 750, borderCollapse: "separate", borderSpacing: "0 0.75rem" }}>
						<TableHead sx={{ borderRadius: 4, border: "none", mb: 4, backgroundColor: "#F0F0F5" }}>
							<TableRow>
								{columns.map((col, ix) => (
									<TableCell key={ix}>{col}</TableCell>
								))}
							</TableRow>
						</TableHead>
						<TableBody
							sx={{
								backgroundColor: "white",
							}}
						>
							{positions.map((position, ix) => (
								<TableRow key={ix}>
									<TableCell>
										<CustomDate date={position?.enterDate} />
									</TableCell>
									<TableCell>
										<CustomDate date={position?.exitDate} />
									</TableCell>
									<TableCell>
										<Typography sx={{ color: (theme) => theme.palette.primary.main }}>
											{`$${+parseFloat(position.averageEnterPrice).toFixed(10)}`}
										</Typography>
									</TableCell>
									<TableCell>
										<Typography sx={{ color: (theme) => theme.palette.primary.main }}>
											{`$${+parseFloat(position.averageExitPrice).toFixed(10)}`}
										</Typography>
									</TableCell>
									<TableCell>
										<Typography
											sx={{
												color: (theme) => reflectChanges(theme, position.averageEnterPrice),
											}}
										>
											{`${parseFloat(position.drawUpPercent).toFixed(2)}%`}
										</Typography>
									</TableCell>
									<TableCell>
										<Typography
											sx={{
												color: (theme) => reflectChanges(theme, position.drawDownPercent),
											}}
										>
											{`${parseFloat(position.drawDownPercent).toFixed(2)}%`}
										</Typography>
									</TableCell>
									<TableCell>
										<Typography
											sx={{
												color: (theme) => reflectChanges(theme, position.profitPercent),
											}}
										>
											{`${parseFloat(position.profitPercent).toFixed(2)}%`}
										</Typography>
									</TableCell>
									<TableCell>
										<Typography>{position.exitSource}</Typography>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			</Grid>
		</Grid>
	);
}
