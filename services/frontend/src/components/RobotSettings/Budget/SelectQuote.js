import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Button, Card, CardContent, Grid, Radio } from "@mui/material";

import { CoinIcon } from "components";

import { QuoteMap } from "../utils";

const SelectQuote = ({ quotes, addParity, portfolio }) => {
	const { t } = useTranslation();

	const [selectedQuote, setSelectedQuote] = useState();

	const getQuoteBudget = (quote) => {
		const quoteBudget = portfolio?.portfolio?.assets?.find((x) => x.coinName === quote);

		return quoteBudget ? quoteBudget.coinAmount.toFixed(2) : "00.00";
	};

	const handleSave = () => {
		if (selectedQuote) {
			addParity(selectedQuote);
		}
	};

	return (
		<>
			<Grid container>
				{quotes.map((quote) => (
					<Grid item xs={12} style={{ marginBottom: "5px", marginTop: "15px" }}>
						<Card sx={{ borderRadius: 2, border: "1px solid #CFD2FA", marginTop: 2 }} onClick={() => {}}>
							<CardContent>
								<Grid container>
									<Grid item xs={1} sx={{ alignSelf: "left" }}>
										<Radio
											checked={selectedQuote === quote}
											onChange={(e) => setSelectedQuote(quote)}
											value={quote}
										/>
									</Grid>
									<Grid item xs={1} sx={{ alignSelf: "center" }}>
										<CoinIcon quote={quote} />
									</Grid>
									<Grid item xs={5} sx={{ alignSelf: "center" }} style={{ paddingLeft: "5px" }}>
										{QuoteMap[quote]} ({quote})
									</Grid>
									<Grid item xs={5}>
										<div>
											<span style={{ color: "#3A3A3A" }}>
												{t(
													"control_panel_robot_settings_budget_page_select_base_pair_budget_amount_info_text"
												)}
											</span>
											<br />
											<span>
												{getQuoteBudget(quote)}
												<span style={{ color: "#AEAEAE" }}>{quote}</span>
											</span>
										</div>
									</Grid>
								</Grid>
							</CardContent>
						</Card>
					</Grid>
				))}
			</Grid>

			<Grid container spacing={2} sx={{ paddingTop: "3vh" }}>
				<Grid item xs={12}>
					<Button
						fullWidth
						variant="contained"
						onClick={() => {
							handleSave();
						}}
					>
						{t("common:Save")}
					</Button>
				</Grid>
			</Grid>
		</>
	);
};

export default SelectQuote;
