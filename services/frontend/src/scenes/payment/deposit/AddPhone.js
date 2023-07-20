import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { Box, Button, Grid, Paper, Typography } from "@mui/material";

import { PhoneField, RouteLayout } from "components";

import { WallClock } from "images";

import AddPhoneOtp from "./AddPhoneOtp";

export default function AddPhone() {
	const { profile } = useSelector((state) => state.user);
	const [phoneNumber, setPhoneNumber] = useState();
	const [error, setError] = useState(false);
	const [otpOpen, setOtpOpen] = useState(false);
	const navigate = useNavigate();
	const { t } = useTranslation("wallet");

	const handleNext = () => {
		if (!phoneNumber) {
			setError(true);
			return;
		}
		setOtpOpen(true);
	};

	return (
		<>
			{otpOpen && <AddPhoneOtp otpOpen={otpOpen} setOtpOpen={setOtpOpen} phoneNumber={phoneNumber} />}
			<RouteLayout header={t("wallet_withdraw_add_phone_title")}>
				<div style={{ marginRight: "4vw" }}>
					<Grid container>
						<Grid item xs={12} md={8}>
							<Paper
								sx={{
									boxShadow: 0,
									backgroundColor: "#FFFFFF",
									padding: 2,
									display: "flex",
									flexDirection: "column",
									alignItems: "start",
									minHeight: "300px",
									marginBlockEnd: "0.5rem",
								}}
							>
								<Typography
									fontWeight={"Bold"}
									sx={{
										fontSize: "24px",
										mt: 2,
										ml: 2,
										color: (theme) => theme.palette.primary.main,
									}}
								>
									{t("wallet_withdraw_add_phone_title")}
								</Typography>

								<Box sx={{ mt: 2, ml: 2 }}>
									<PhoneField
										label={t("wallet_withdraw_add_phone_input_title")}
										labelProps={{
											sx: {
												color: (theme) => theme.palette.text.dark,
												fontSize: "16px",
												mt: 2,
											},
										}}
										margin="normal"
										{...(phoneNumber ? { value: phoneNumber } : {})}
										error={error}
										onChange={(e) => setPhoneNumber(e)}
									/>
								</Box>
							</Paper>
						</Grid>
						<Grid item xs={12} md={4}>
							<Paper
								sx={{
									boxShadow: 0,
									backgroundColor: "#FFFFFF",
									padding: 2,
									display: "flex",
									flexDirection: "column",
									alignItems: "start",
									ml: 1,
									minHeight: "300px",
								}}
							>
								<Box sx={{ ml: 2 }}>
									<WallClock />
								</Box>
								<Typography fontWeight={"Bold"} sx={{ ml: 2, mt: 1, fontSize: "24px" }}>
									{t("wallet_deposit_transfer_information_card_title")}
								</Typography>
								<Typography sx={{ ml: 2, mt: 1, fontSize: "12px" }}>
									{t("wallet_deposit_info_text")}
								</Typography>
							</Paper>
						</Grid>
						<Grid item xs={8}></Grid>
						<Grid item xs={12} md={4}>
							<Button
								variant="contained"
								onClick={handleNext}
								sx={{
									fontSize: "16px",
									width: "98%",
									ml: "0.5rem",
									mt: "0.6rem",
									padding: "0.8rem 1rem",
								}}
							>
								{t("wallet_withdraw_add_phone_otp_button")}
							</Button>
						</Grid>
					</Grid>
				</div>
			</RouteLayout>
		</>
	);
}
