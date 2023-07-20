import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { Button, Card, Switch, Typography } from "@mui/material";
import { Box } from "@mui/system";

export default function Template({ data, dataKey, title, explanation, properties, onChange, ...rest }) {
	const { t } = useTranslation("accountCenter");
	const navigate = useNavigate();

	return (
		<Card>
			<Typography
				gutterBottom
				sx={{
					fontSize: "24px",
					fontWeight: 700,
					lineHeight: "28px",
				}}
			>
				{title}
			</Typography>
			<Typography
				gutterBottom
				sx={{
					fontSize: "14px",
					fontWeight: 400,
					lineHeight: "18px",
				}}
			>
				{explanation}
			</Typography>
			{properties.map((property, ix) => (
				<Box
					key={ix}
					sx={{
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						width: "22rem",
						maxWidth: "100%",
						marginBlock: "0.5rem",
					}}
				>
					<Typography
						sx={{
							fontSize: "14px",
							fontWeight: 700,
							lineHeight: "16px",
						}}
					>
						{property.title}
					</Typography>
					<Switch
						checked={data?.[dataKey]?.[property.key] ?? false}
						onChange={(event) =>
							onChange({
								...data,
								[dataKey]: { ...data?.[dataKey], [property.key]: event.target.checked },
							})
						}
					/>
				</Box>
			))}
			{rest?.telegramInfo && (
				<>
					<Box
						sx={{
							backgroundColor: "#F4F5FC",
							padding: "1rem",
							width: "33rem",
							borderRadius: "0.5rem",
						}}
					>
						<Typography
							gutterBottom
							sx={{
								fontSize: "14px",
								fontWeight: 700,
								lineHeight: "16px",
							}}
						>
							{t("account_center_notifications_telegram_info_card_title")}
						</Typography>
						<Typography
							sx={{
								fontSize: "10px",
								fontWeight: 500,
								lineHeight: "13px",
							}}
						>
							{t("account_center_notifications_telegram_info_card_text")}
						</Typography>
					</Box>
					<Button variant="contained" sx={{ mt: 2 }} onClick={(x) => navigate("telegram-info")}>
						{t("account_center_notifications_telegram_generate_code_button_text")}
					</Button>
				</>
			)}
		</Card>
	);
}
