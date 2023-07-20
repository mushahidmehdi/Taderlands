import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { Typography } from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { Box } from "@mui/system";

export default function Card({ query, title, data, dataKey, explanation, onChange }) {
	const { t } = useTranslation("accountCenter");

	return (
		<Box
			sx={{
				border: "1px solid #CFD2FA",
				width: "495px",
				borderRadius: "0.5rem",
				padding: "1rem",
			}}
		>
			<Typography
				sx={{
					fontSize: "24px",
					fontWeight: 700,
					lineHeight: "28px",
					marginBlockEnd: "0.5rem",
				}}
			>
				{title}
			</Typography>
			<Typography
				sx={{
					fontSize: "14px",
					fontWeight: 400,
					lineHeight: "18px",
				}}
			>
				{explanation}
			</Typography>
			{dataKey && (
				<FormControlLabel
					control={
						<Switch
							checked={data?.[dataKey]}
							onChange={(event) => onChange({ ...data, [dataKey]: event.target.checked })}
						/>
					}
					label={t("account_center_notifications_disable_text")}
				/>
			)}
			{(data[dataKey] || !dataKey) && (
				<Box>
					<Link
						style={{
							fontSize: "12px",
							fontWeight: 500,
							lineHeight: "16px",
						}}
						to={`/notification-settings?t=${query}`}
					>
						{t("account_center_notifications_customize_text")}
					</Link>
				</Box>
			)}
		</Box>
	);
}
