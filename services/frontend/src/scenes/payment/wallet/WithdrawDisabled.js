import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { Paper, Typography, useMediaQuery } from "@mui/material";

export default function WithdrawDisabled({ type }) {
	const { t } = useTranslation("wallet");

	const navigate = useNavigate();

	const inMobileKycMessage = useMediaQuery("(max-width:900px)", { noSsr: true });

	return (
		<>
			{type ? (
				<Paper
					sx={{ mt: 1, p: 2, borderRadius: "8px", backgroundColor: (theme) => theme.palette.warning.light }}
				>
					<Typography sx={{ fontSize: "14px", fontWeight: 700 }}>
						{type === "KYC_REQUIRED" && <>{t("wallet_no_kyc_warning_title")}</>}
						{type === "BALANCE_TOO_LOW" && <>{t("wallet_not_enough_real_credits_warning_title")}</>}
					</Typography>
					{type === "KYC_REQUIRED" && (
						<Typography sx={{ fontSize: "10px" }}>
							{inMobileKycMessage
								? t("wallet_no_kyc_warning_text_mobile")
								: t("wallet_no_kyc_warning_text_1")}
							&nbsp;
							<Typography
								component="span"
								onClick={() => navigate("/security")}
								sx={{
									cursor: "pointer",
									fontSize: "10px",
									color: (theme) => theme.palette.secondary.main,
								}}
							>
								{t("wallet_no_kyc_warning_text_2")}
							</Typography>
						</Typography>
					)}
					{type === "BALANCE_TOO_LOW" && (
						<Typography sx={{ fontSize: "10px" }}>
							{t("wallet_not_enough_real_credits_warning_text")}
						</Typography>
					)}
				</Paper>
			) : (
				<> </>
			)}
		</>
	);
}
