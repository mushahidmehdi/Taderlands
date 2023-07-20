import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { Box, Button, Checkbox, Container, FormControlLabel, Grid, Paper, Typography } from "@mui/material";

import { useSnackbar } from "notistack";

import { Dialog, Slider, TextField } from "components";

import { useUserApi } from "api/user";

import { useFetchAuthorized } from "services";

import { success } from "images";

export default function CreateReference() {
	const [error, setError] = useState();
	const [name, setName] = useState();
	const [profit, setProfit] = useState(1);
	const [isDefault, setIsDefault] = useState(false);
	const [code, setCode] = useState();
	const [successOpen, setSuccessOpen] = useState(false);

	const { createReferenceCode } = useUserApi();

	const { t } = useTranslation("accountCenter");
	const navigate = useNavigate();
	const fetchAuthorized = useFetchAuthorized();
	const { enqueueSnackbar } = useSnackbar();
	const prepareData = () => {
		setError({
			name: !name,
		});

		if (!name) {
			return;
		}

		return {
			name,
			inviterIncome: profit,
			inviteeIncome: 1 - profit,
			default: isDefault,
		};
	};

	const handleNext = () => {
		let body = prepareData();

		createReferenceCode(body)
			.then((data) => {
				setCode(data.data?.referenceCode?.code);
				setSuccessOpen(true);
			})
			.catch(() =>
				enqueueSnackbar("You can’t create a new code because you have reached your maximum inviting quota!", {
					variant: "error",
				})
			);
		return;
	};

	const handleSuccessClose = () => {
		setSuccessOpen(false);
		navigate("/reference-list");
	};

	const SuccessDialog = () => (
		<Dialog
			dialogProps={{ open: successOpen, onClose: handleSuccessClose }}
			title={<Box component="img" src={success} />}
			content={
				<>
					<Typography fontWeight={"Bold"} sx={{ mt: 2, textAlign: "center", fontSize: "24px" }}>
						{t("account_center_settings_update_protection_success_title")}
					</Typography>
					<Typography sx={{ mt: 2, textAlign: "center", fontSize: "14px" }}>
						{t(
							"referenceCenter.Your Referral Code has been generated, Invite your friends, earn 1% commission on every transaction they make."
						)}
					</Typography>
					{code && (
						<Paper
							sx={{
								mt: 2,
								backgroundColor: "#F4F5FC",
								padding: 1,
								display: "flex",
								flexDirection: "column",
								alignItems: "center",
							}}
						>
							<Typography sx={{ fontSize: "14px" }}>{t("referenceCenter.Referral Code")}</Typography>

							<Typography fontWeight={"Bold"} sx={{ fontSize: "14px" }}>
								{code}
							</Typography>
						</Paper>
					)}
					<Button
						variant="contained"
						sx={{ width: 300, mt: 2 }}
						color="secondary"
						onClick={() => handleSuccessClose()}
					>
						{t("referenceCenter.Go to referal list")}
					</Button>
				</>
			}
		></Dialog>
	);

	return (
		<React.Fragment>
			<SuccessDialog />
			<Container
				sx={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					mt: 10,
				}}
			>
				<Typography fontWeight={"Bold"} sx={{ mt: 5, fontSize: "24px" }}>
					{t("account_center_reference_center_create_code_step_2_title")}
				</Typography>
				<Typography sx={{ mt: 2, fontSize: "14px" }}>
					{t("account_center_reference_center_create_code_step_2_text")}
				</Typography>

				<Paper sx={{ mt: 2, backgroundColor: "#FFFFFF", width: "50%", padding: 10 }}>
					<Grid container>
						<Grid item xs={12}>
							<TextField
								size="small"
								fullWidth
								label={t("account_center_reference_center_create_code_step_2_name")}
								error={error?.name}
								onChange={(e) => setName(e.target.value)}
								inputProps={{ maxLength: 8 }}
							/>
						</Grid>
						<Grid item xs={12} sx={{ textAlign: "center" }}>
							<Typography
								fontWeight={"Bold"}
								sx={{ mt: 2, fontSize: "16px", color: (theme) => theme.palette.primary.main }}
							>
								{t("account_center_reference_center_create_code_step_2_sharing_ratio_title")}
							</Typography>
						</Grid>
						<Grid item xs={12} sx={{ textAlign: "center" }}>
							<Typography sx={{ mt: 2, fontSize: "16px" }}>
								{t("account_center_reference_center_create_code_step_2_calculation_main_title")}
							</Typography>
						</Grid>
						<Grid item xs={12}>
							<Slider
								step={0.01}
								min={0}
								max={1}
								valueLabelDisplay="auto"
								value={profit}
								onChange={(_, value) => setProfit(value)}
							/>
						</Grid>
						<Grid item xs={6} sx={{ textAlign: "left" }}>
							<Typography sx={{ fontSize: "12px", color: (theme) => theme.palette.primary.main }}>
								{t("account_center_reference_center_create_code_step_2_my_share_title")}
							</Typography>
						</Grid>
						<Grid item xs={6} sx={{ textAlign: "right" }}>
							<Typography sx={{ fontSize: "12px", color: (theme) => theme.palette.primary.main }}>
								{t("account_center_reference_center_create_code_step_2_invited_share_ratio")}
							</Typography>
						</Grid>
						<Grid item xs={6} sx={{ textAlign: "left" }}>
							<Typography sx={{ fontSize: "12px", color: (theme) => theme.palette.primary.main }}>
								{"₮" + (profit * 10).toFixed(1)}
							</Typography>
						</Grid>
						<Grid item xs={6} sx={{ textAlign: "right" }}>
							<Typography sx={{ fontSize: "12px", color: (theme) => theme.palette.primary.main }}>
								{"₮" + ((1 - profit) * 10).toFixed(1)}
							</Typography>
						</Grid>
						<Grid item xs={12} sx={{ textAlign: "center" }}>
							<FormControlLabel
								control={
									<Checkbox checked={isDefault} onChange={(e) => setIsDefault(e.target.checked)} />
								}
								label={t("account_center_reference_center_create_code_step_2_set_default")}
							/>
						</Grid>
					</Grid>
				</Paper>
				<Button variant="contained" sx={{ width: 300, mt: 3 }} onClick={handleNext}>
					{t("account_center_reference_center_create_code_step_2_create_code")}
				</Button>
			</Container>
		</React.Fragment>
	);
}
