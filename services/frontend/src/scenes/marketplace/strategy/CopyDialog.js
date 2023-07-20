import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import { Button, Grid, Typography } from "@mui/material";
import { Box } from "@mui/system";

import { Dialog } from "components";

import shortenNumber from "utils/shortenNumber";

import { SpotRight, uri } from "images";

import useStatisticsMap from "./Constants";

const SummaryItem = ({ icon, label, value }) => {
	return (
		<Grid item>
			<Grid
				container
				sx={{
					backgroundColor: "white",
					p: 2,
					borderRadius: "8px",
					border: (theme) => `1px solid ${theme.palette.primary.main}`,
					textAlign: "center",
					width: "174px",
					height: "151px",
				}}
			>
				<Grid item xs={12}>
					{icon}
				</Grid>
				<Grid item xs={12}>
					<Typography sx={{ fontSize: "16px", fontWeight: 700 }}>{label}</Typography>
				</Grid>
				<Grid item xs={12}>
					<Typography
						sx={{ fontSize: "18px", fontWeight: 700, color: (ahmet) => ahmet.palette.primary.main }}
					>
						{value}
					</Typography>
				</Grid>
			</Grid>
		</Grid>
	);
};

export default function CopyDialog({ strategy, name, merchant, pricing, open, onClose, onSubmit }) {
	const { t, i18n } = useTranslation("marketplace");
	const { profile } = useSelector((state) => state.user);
	const { statisticsMap } = useStatisticsMap();

	return (
		<Dialog
			dialogProps={{ open, onClose, maxWidth: "md", fullWidth: true }}
			title={
				<>
					<Box
						sx={{
							mr: "auto",
							ml: "auto",
							width: "100px",
							height: "100px",
							borderRadius: "50px",
							border: "6px solid #FAFAFE",
						}}
					>
						<img src={uri} style={{ marginLeft: "26px", marginTop: "26px" }} />
					</Box>
					<Typography sx={{ fontSize: "24px", fontWeight: 700, textAlign: "center" }}>{name}</Typography>
					<Typography
						sx={{
							fontSize: "14px",
							textDecoration: "underline",
							cursor: "pointer",
							fontWeight: 500,
							textAlign: "center",
							color: (theme) => theme.palette.primary.main,
						}}
					>
						{merchant?.nickname}
					</Typography>
				</>
			}
			content={
				<>
					<Grid
						container
						spacing={2}
						sx={{ mt: 1 }}
						direction="row"
						alignItems="center"
						justifyContent="center"
					>
						{Object.keys(statisticsMap)
							.filter((x) => !x?.icon)
							.map((item, ix) => (
								<SummaryItem
									key={ix}
									icon={statisticsMap?.[item]?.icon}
									label={statisticsMap?.[item]?.label}
									value={
										strategy?.strategyStatistics?.[item]
											? `${statisticsMap?.[item]?.price ? "$" : ""}${shortenNumber(
													strategy?.strategyStatistics?.[item] *
														(statisticsMap?.[item]?.multiplier ?? 1)
											  )}${statisticsMap?.[item]?.percent ? "%" : ""}`
											: "0"
									}
								/>
							))}
					</Grid>
					<Box
						sx={{
							mt: 3,
							p: 2,
							textAlign: "center",
							width: "374px",
							backgroundColor: (theme) => theme.palette.info.light,
							borderRadius: "8px",
						}}
					>
						<Typography sx={{ fontSize: "16px", color: (theme) => theme.palette.primary.main }}>
							{t("marketplace_strategy_page_follow_modal_credit_cost_title")}
						</Typography>
						<Typography sx={{ fontSize: "14px" }}>
							{t("marketplace_strategy_page_follow_modal_credit_cost_profit_share_title")} <SpotRight />
							{`${(
								(pricing.amount +
									(profile?.baseFees?.profitFee -
										(profile?.usedReferenceCode
											? profile?.usedReferenceCode?.inviteeIncome / 100
											: 0))) *
								100
							).toFixed(2)}%`}
						</Typography>
						<Typography sx={{ fontSize: "14px" }}>
							{t("marketplace_strategy_page_follow_modal_credit_cost_volume_share_title")} <SpotRight />{" "}
							{`${(profile?.baseFees?.volumeFee * 100).toFixed(2)}%`}
						</Typography>
					</Box>
				</>
			}
			action={
				<>
					<Button
						variant="contained"
						color="primary"
						sx={{ width: "360px", borderRadius: "8px", height: "50px" }}
						onClick={onSubmit}
					>
						{t("marketplace_strategy_page_follow_modal_coppy_button_text")}
					</Button>
				</>
			}
		/>
	);
}
