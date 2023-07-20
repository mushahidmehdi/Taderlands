import { useTranslation } from "react-i18next";

import { FormControl, FormControlLabel, Grid, Radio, RadioGroup, Typography } from "@mui/material";

import Metrics from "./Metrics";
import Results from "./Results";

const Layout = ({ quotes, filter, setFilter, data }) => {
	const { t } = useTranslation("marketplace");
	const TIME_RANGE_LABELS = {
		"1M": t("marketplace_strategy_page_charts_time_options_2"),
		"3M": t("marketplace_strategy_page_charts_time_options_3"),
		"6M": t("marketplace_strategy_page_charts_time_options_4"),
		"1Y": t("marketplace_strategy_page_charts_time_options_5"),
	};

	return (
		<Grid container>
			<Grid item xs={12} sx={{ mt: 2 }}>
				<Grid container direction="row" justifyContent="space-between" alignItems="center">
					<Grid item>
						<FormControl>
							<RadioGroup
								row
								value={filter?.quote}
								onChange={(e) => setFilter({ ...filter, quote: e.target.value })}
							>
								{quotes.map((item, ix) => (
									<FormControlLabel
										key={ix}
										sx={{
											fontSize: "14px",
											fontWeight: 700,
											color: (theme) =>
												item === filter?.quote
													? theme.palette.primary.main
													: theme.palette.info.dark,
										}}
										value={item}
										control={<Radio />}
										label={item}
									/>
								))}
							</RadioGroup>
						</FormControl>
					</Grid>
					<Grid item sx={{ mt: "8px" }}>
						<Grid container justifyContent={"space-between"} spacing={2}>
							{["1W", "1M", "3M", "6M", "1Y"].map((item, ix) => (
								<Grid item key={ix}>
									<Typography
										sx={{
											cursor: "pointer",
											color: (theme) =>
												filter?.timeRange === item
													? theme.palette.primary.main
													: theme.palette.info.dark,
										}}
										onClick={() => setFilter({ ...filter, timeRange: item })}
									>
										{TIME_RANGE_LABELS[item]}
									</Typography>
								</Grid>
							))}
						</Grid>
					</Grid>
				</Grid>
			</Grid>

			{!data && <Typography sx={{ mt: 2 }}>{t("marketplace_strategy_page_charts_no_data_text")}</Typography>}

			{data?.results && (
				<Grid item xs={12}>
					{/* https://github.com/recharts/recharts/issues/854 */}
					<Results results={data?.results} />
				</Grid>
			)}

			{data?.metrics && (
				<Grid item xs={12}>
					<Metrics metrics={data?.metrics} />
				</Grid>
			)}
		</Grid>
	);
};

export default Layout;
