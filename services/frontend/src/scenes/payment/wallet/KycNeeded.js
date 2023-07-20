import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { Paper, Typography } from "@mui/material";

export default function KycNeeded() {
	const { t } = useTranslation("wallet");

	const navigate = useNavigate();

	return (
		<Paper sx={{ mt: 1, p: 2, borderRadius: "8px", backgroundColor: (theme) => theme.palette.warning.light }}>
			<Typography sx={{ fontSize: "14px", fontWeight: 700 }}>{t("wallet_no_kyc_warning_title")}</Typography>
			<Typography sx={{ fontSize: "10px" }}>
				{t("wallet_no_kyc_warning_text_1")}
				&nbsp;
				<Typography
					component="span"
					onClick={() => navigate("/kyc/application")}
					sx={{ cursor: "pointer", fontSize: "10px", color: (theme) => theme.palette.secondary.main }}
				>
					{t("wallet_no_kyc_warning_text_2")}
				</Typography>
			</Typography>
		</Paper>
	);
}
