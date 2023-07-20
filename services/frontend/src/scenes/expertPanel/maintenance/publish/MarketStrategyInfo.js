import { useState } from "react";
import { useTranslation } from "react-i18next";

import {
	Box,
	Button,
	DialogContent,
	FormControl,
	FormControlLabel,
	FormGroup,
	Grid,
	Switch,
	Typography,
} from "@mui/material";

import { useSnackbar } from "notistack";

import { InputWithSlider, TextField } from "components";

import { useMarketplaceApi } from "api/marketplace";
import useCatchError from "api/useCatchError";

const marksDecimal = [
	{
		value: 0.0,
		label: "%0",
	},
	{
		value: 0.07,
		label: "%0.07",
	},
];

export default function MarketStrategyInfo({ strategy }) {
	const [marketStrategy, setMarketStrategy] = useState(strategy?.marketStrategy);
	const [isFree, setIsFree] = useState(strategy?.marketStrategy?.onDiscount ?? false);

	const { enqueueSnackbar } = useSnackbar();
	const { t, i18n } = useTranslation("expertPanel");

	const { createMarketStrategy } = useMarketplaceApi();
	const catchError = useCatchError();

	const handleSubmit = () => {
		createMarketStrategy({
			name: marketStrategy?.name,
			explanations: marketStrategy?.explanations,
			pricing: { ...marketStrategy?.pricing, amount: isFree ? 0 : marketStrategy?.pricing?.amount },
			status: marketStrategy?.status,
			strategyId: strategy.id,
			onDiscount: isFree,
		})
			.then(() => {
				enqueueSnackbar(t("You have published your strategy to the market"), { variant: "success" });
			})
			.then(() => {
				window.location.reload();
			})
			.catch(catchError);
	};

	const calculatePercentage = parseFloat(`${(marketStrategy?.pricing?.amount ?? 0) * 100}`).toFixed(1);

	return (
		<DialogContent>
			<Box
				sx={{
					padding: "70px 36px 48px 36px",
				}}
			>
				<Grid container spacing={2} direction="column" alignItems="center" justifyContent="center">
					<Grid item xs={12}>
						<Typography textAlign={"center"} variant="h5">
							{t("expert_panel_share_strategy_main_title")}
						</Typography>
					</Grid>
					<Grid item xs={12}>
						<Typography sx={{ fontSize: "14px" }} paragraph textAlign={"center"}>
							{t("expert_panel_share_strategy_main_text")}
						</Typography>
					</Grid>
				</Grid>
			</Box>
			<Grid sx={{ paddingTop: "16px" }}>
				<Box component="form" autocomplete="off">
					<FormControl fullWidth margin="normal">
						<TextField
							margin="normal"
							fullWidth
							placeholder="Marketplace Name"
							id={"name"}
							label={t("expert_panel_share_strategy_name_title")}
							onChange={(e) => {
								setMarketStrategy({
									...marketStrategy,
									name: e.target.value,
								});
							}}
							value={marketStrategy?.name}
							labelProps={{ sx: { color: (theme) => theme.palette.primary.main } }}
							inputProps={{ maxLength: 32 }}
						/>
					</FormControl>

					<FormControl fullWidth margin="normal">
						<TextField
							margin="normal"
							fullWidth
							multiline
							minRows="6"
							id={"explanations"}
							value={marketStrategy?.explanations?.[i18n.resolvedLanguage]?.text}
							onChange={(e) => {
								setMarketStrategy({
									...marketStrategy,
									explanations: {
										[i18n.resolvedLanguage]: { text: e.target.value },
									},
								});
							}}
							placeholder={t("expert_panel_share_strategy_explanation_placeholder")}
							label={t("expert_panel_share_strategy_explanation_title")}
							labelProps={{ sx: { color: (theme) => theme.palette.primary.main } }}
							inputProps={{ maxLength: 200 }}
						/>
					</FormControl>

					<FormControl>
						<FormGroup>
							<FormControlLabel
								checked={isFree}
								control={<Switch />}
								label={
									<Typography sx={{ color: "#0F20E8" }}>
										{t("expert_panel_share_strategy_free_button")}
									</Typography>
								}
								onChange={() => {
									setIsFree(!isFree);
								}}
							/>
						</FormGroup>
					</FormControl>

					{!isFree && (
						<>
							<FormControl
								fullWidth
								margin="normal"
								sx={{
									display: "flex",
									justifyContent: "center",
									maxWidth: "30.5rem",
									marginInlineStart: "1rem",
								}}
							>
								<InputWithSlider
									label={t("expert_panel_share_strategy_price_title")}
									step={0.001}
									min={0.0}
									max={0.07}
									marks={marksDecimal}
									value={marketStrategy?.pricing?.amount}
									onSliderChange={(_, value) => {
										setMarketStrategy({
											...marketStrategy,
											pricing: {
												...marketStrategy?.pricing,
												amount: value,
											},
										});
									}}
									onTextChange={(e) => {
										const { value } = e.target;

										setMarketStrategy({
											...marketStrategy,
											pricing: {
												...marketStrategy?.pricing,
												amount: value,
											},
										});
									}}
								/>
							</FormControl>

							<Grid>
								<Typography
									sx={{
										margin: "0",
										fontFamily: "Comfortaa",
										fontWeight: "400",
										fontSize: "1rem",
										lineHeight: "1.5",
										color: "#0F20E8",
									}}
								>
									{t("expert_panel_edit_profile_result_button")}
								</Typography>
								<Box>
									<Typography component={"span"}>
										{t("expert_panel_share_strategy_summary_text", { calculatePercentage })}
									</Typography>
								</Box>
							</Grid>
						</>
					)}

					<Grid
						container
						spacing={2}
						sx={{
							paddingTop: "3vh",
						}}
					>
						<Grid item xs={12}>
							<Button
								sx={{
									paddingBlock: "0.75rem",
								}}
								variant="contained"
								fullWidth
								onClick={() => handleSubmit()}
							>
								{t("expert_panel_share_strategy_publish_button")}
							</Button>
						</Grid>
					</Grid>
				</Box>
			</Grid>
		</DialogContent>
	);
}
