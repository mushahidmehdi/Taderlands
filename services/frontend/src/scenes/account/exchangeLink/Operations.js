import { useTranslation } from "react-i18next";

import { Typography } from "@mui/material";

import { operationsCheck, operationsDelete, operationsDisable, operationsUpdate, Success } from "images";

export default function useOperations() {
	const { t } = useTranslation("accountCenter");

	const successObj = (type) => ({
		icon: <Success />,
		content: (
			<Typography sx={{ mt: 2, textAlign: "center", fontSize: "14px" }}>
				{type === "delete" && t("account_center_connections_delete_flow_modal_text")}
				{type === "update" && t("account_center_connections_update_flow_modal_text")}
				{type === "add" && t("account_center_connections_add_flow_modal_title")}
				{type === "check" && t("account_center_connections_check_flow_modal_text")}
				{type === "enable" && t("account_center_connections_enable_flow_modal_text")}
				{type === "disable" && t("account_center_connections_disable_flow_modal_text")}
			</Typography>
		),
	});

	const operations = {
		update: {
			icon: operationsUpdate,
			title: t("account_center_connections_operations_update_title"),
			text: t("account_center_connections_operations_update_text"),
			otp: {
				title: t("account_center_connections_otp_title"),
				explanation: t("account_center_connections_otp_text"),
			},
			value: "update",
			color: "#0F20E8",
			success: {
				...successObj("update"),
				title: t("account_center_connections_update_flow_modal_title"),
			},
		},
		check: {
			icon: operationsCheck,
			title: t("account_center_connections_operations_check_title"),
			text: t("account_center_connections_operations_check_text"),
			otp: {
				title: t("account_center_connections_otp_title"),
				explanation: t("account_center_connections_otp_text"),
			},
			value: "check",
			color: "#0F20E8",
			success: {
				...successObj("check"),
				title: t("account_center_connections_check_flow_modal_title"),
			},
		},
		disable: {
			icon: operationsDisable,
			title: t("account_center_connections_operations_disable_title"),
			text: t("account_center_connections_operations_disable_text"),
			otp: {
				title: t("account_center_connections_otp_title"),
				explanation: t("account_center_connections_otp_text"),
			},
			value: "disable",
			color: "#0F20E8",
			success: {
				...successObj("disable"),
				title: t("account_center_connections_disable_flow_modal_title"),
			},
		},
		enable: {
			icon: operationsDisable,
			title: t("account_center_connections_operations_enable_title"),
			text: t("account_center_connections_operations_enable_text"),
			otp: {
				title: t("account_center_connections_otp_title"),
				explanation: t("account_center_connections_otp_text"),
			},
			value: "enable",
			color: "#0F20E8",
			success: {
				...successObj("enable"),
				title: t("account_center_connections_enable_flow_modal_title"),
			},
		},
		delete: {
			icon: operationsDelete,
			title: t("account_center_connections_operations_delete_title"),
			text: t("account_center_connections_operations_delete_text"),
			otp: {
				title: t("account_center_connections_otp_title"),
				explanation: t("account_center_connections_otp_text"),
			},
			value: "delete",
			color: "#DE350B",
			success: {
				...successObj("delete"),
				title: t("account_center_settings_update_protection_success_title"),
			},
		},
	};

	return { operations };
}
