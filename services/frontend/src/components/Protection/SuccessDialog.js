import { useTranslation } from "react-i18next";

import { Button, Typography } from "@mui/material";

import Dialog from "components/Dialog";
import { Success } from "images";

export default function SuccessDialog({ open, onClose, title, content, icon, actions }) {
	const { t } = useTranslation("accountCenter");

	return (
		<Dialog
			dialogProps={{ open, onClose }}
			title={icon ?? <Success />}
			content={
				<>
					{title ?? (
						<Typography fontWeight={"Bold"} sx={{ mt: 2, textAlign: "center", fontSize: "24px" }}>
							{t("account_center_settings_update_protection_success_title")}
						</Typography>
					)}

					{content ?? (
						<Typography sx={{ mt: 2, textAlign: "center", fontSize: "14px" }}>
							{t("account_center_settings_update_protection_success_text")}
						</Typography>
					)}

					{actions ?? (
						<Button variant="outlined" sx={{ width: 300, mt: 2 }} color="primary" onClick={() => onClose()}>
							{t("account_center_connections_delete_flow_button_success")}
						</Button>
					)}
				</>
			}
		/>
	);
}
