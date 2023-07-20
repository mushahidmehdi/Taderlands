import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { Button, Container, Grid, Paper, Typography } from "@mui/material";

import { BigCheck, Bullet } from "images";

export default function CreateReferenceInfo() {
	const { t } = useTranslation("accountCenter");
	const navigate = useNavigate();

	const handleNext = () => {
		navigate("/create-reference");
		return;
	};

	return (
		<Container
			sx={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				mt: 10,
			}}
		>
			<Typography fontWeight={"Bold"} sx={{ mt: 5, fontSize: "24px" }}>
				{t("account_center_reference_center_create_code_title")}
			</Typography>
			<Typography sx={{ mt: 2, fontSize: "14px" }}>
				{t("account_center_reference_center_create_code_text")}
			</Typography>
			<Paper sx={{ mt: 2, backgroundColor: "#FFFFFF", width: "50%", padding: 5 }}>
				<Grid container>
					<Grid item xs={12}>
						<Typography fontWeight={"Bold"} sx={{ fontSize: "14px", textAlign: "center" }}>
							{t("account_center_reference_center_create_code_sub_title")}
						</Typography>
					</Grid>
					<Grid item xs={3} sx={{ textAlign: "right", alignContent: "center", mt: 5 }}>
						<Bullet />
					</Grid>
					<Grid item xs={9}>
						<Typography sx={{ fontSize: "14px", ml: 2, mt: 4 }}>
							{t("account_center_reference_center_create_code_info_1")}
						</Typography>
					</Grid>
					<Grid
						item
						xs={3}
						sx={{
							textAlign: "right",
							mt: 5,
						}}
					>
						<Bullet />
					</Grid>
					<Grid item xs={9} sx={{ mt: 2 }}>
						<Typography sx={{ fontSize: "14px", ml: 2, mt: 1 }}>
							{t("account_center_reference_center_create_code_info_2")}
						</Typography>
					</Grid>
					<Grid
						item
						xs={3}
						sx={{
							textAlign: "right",
							mt: 3,
						}}
					>
						<BigCheck width={24} height={24} />
					</Grid>
					<Grid item xs={9}>
						<Typography sx={{ fontSize: "14px", ml: 2, pt: 3 }}>
							{t("account_center_reference_center_create_code_info_3")}
						</Typography>
					</Grid>
				</Grid>
			</Paper>
			<Button variant="contained" sx={{ width: 300, mt: 3 }} onClick={handleNext}>
				{t("account_center_reference_center_create_code_continue_button_text")}
			</Button>
		</Container>
	);
}
