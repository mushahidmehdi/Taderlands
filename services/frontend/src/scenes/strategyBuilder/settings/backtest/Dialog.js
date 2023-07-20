import React, { createContext, useState } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@mui/material";

import { Dialog } from "components";

import { ArrowLeft } from "images";

import Results from "./Results";
import Settings from "./Settings";

export const BacktestContext = createContext();

export default function BacktestDialog({ open, onClose }) {
	// Settings, Results
	const [page, setPage] = useState("Settings");
	const [backtest, setBacktest] = useState();

	const { t } = useTranslation("workshop");

	return (
		<BacktestContext.Provider value={{ page, setPage, backtest, setBacktest }}>
			<Dialog
				title={
					page === "Results" && (
						<>
							<Button
								aria-label="select-exchange"
								onClick={() => {
									setPage("Settings");
								}}
								sx={{
									position: "absolute",
									left: 8,
									top: 8,
									fontWeight: 700,
									color: "black",
									"&:hover": {
										backgroundColor: "inherit",
									},
								}}
								startIcon={<ArrowLeft />}
							>
								{t("workshop_backtest_settings_main_title")}
							</Button>
						</>
					)
				}
				titleProps={{ sx: { alignSelf: "flex-start", fontSize: "16px" } }}
				content={page === "Settings" ? <Settings /> : <Results />}
				dialogProps={{ open, onClose, maxWidth: "lg", fullWidth: true }}
			/>
		</BacktestContext.Provider>
	);
}
