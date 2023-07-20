import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid } from "@mui/material";

import { TextField } from "components";

export default function AddressDialog({ open, setOpen, onSave, address }) {
	const [form, setForm] = useState(address ? address : { type: "BILL-TO", default: true });

	const { t } = useTranslation("wallet");

	const handleClose = () => {
		setOpen(false);
	};

	const handleChange = (key, value) => {
		setForm({ ...form, [key]: value });
	};

	return (
		<Dialog maxWidth="md" open={open} onClose={handleClose}>
			<DialogTitle textAlign="center">{t("wallet_deposit_address_card_title")}</DialogTitle>
			<DialogContent>
				<Grid container spacing={2}>
					<Grid item xs={12}>
						<Grid direction="column" alignItems="center" justifyContent="center">
							<Grid item xs={12}></Grid>
						</Grid>
					</Grid>
					<Grid item xs={6}>
						<TextField
							value={form?.label ?? ""}
							onChange={(e) => {
								handleChange("label", e.target.value);
							}}
							fullWidth
							placeholder={t("wallet_deposit_address_card_edit_title_placeholder")}
							label={t("wallet_deposit_address_card_edit_title")}
						/>
					</Grid>
					<Grid item xs={6}>
						<TextField
							value={form?.person ?? ""}
							onChange={(e) => {
								handleChange("person", e.target.value);
							}}
							fullWidth
							placeholder={t("wallet_deposit_address_card_edit_name_placeholder")}
							label={t("wallet_deposit_address_card_edit_name")}
						/>
					</Grid>
					<Grid item xs={6}>
						<TextField
							value={form?.nationalIdentificationId ?? ""}
							onChange={(e) => {
								handleChange("nationalIdentificationId", e.target.value);
							}}
							fullWidth
							placeholder={t("wallet_deposit_address_card_edit_identity_placeholder")}
							label={t("wallet_deposit_address_card_edit_identity")}
						/>
					</Grid>
					<Grid item xs={6}>
						<TextField
							value={form?.phone ?? ""}
							onChange={(e) => {
								handleChange("phone", e.target.value);
							}}
							fullWidth
							placeholder={t("wallet_deposit_address_card_edit_phone_number_placeholder")}
							label={t("wallet_deposit_address_card_edit_phone_number")}
						/>
					</Grid>
					<Grid item xs={6}>
						<TextField
							value={form?.mail ?? ""}
							onChange={(e) => {
								handleChange("mail", e.target.value);
							}}
							fullWidth
							placeholder={t("wallet_deposit_address_card_edit_email_placeholder")}
							label={t("wallet_deposit_address_card_edit_email")}
						/>
					</Grid>
					<Grid item xs={6}>
						<TextField
							value={form?.country ?? ""}
							onChange={(e) => {
								handleChange("country", e.target.value);
							}}
							fullWidth
							placeholder={t("wallet_deposit_address_card_edit_country_placeholder")}
							label={t("wallet_deposit_address_card_edit_country")}
						/>
					</Grid>
					<Grid item xs={6}>
						<TextField
							value={form?.city ?? ""}
							onChange={(e) => {
								handleChange("city", e.target.value);
							}}
							fullWidth
							placeholder={t("wallet_deposit_address_card_edit_city_placeholder")}
							label={t("wallet_deposit_address_card_edit_city")}
						/>
					</Grid>
					<Grid item xs={6}>
						<TextField
							value={form?.province ?? ""}
							onChange={(e) => {
								handleChange("province", e.target.value);
							}}
							fullWidth
							placeholder={t("wallet_deposit_address_card_edit_disctrict_placeholder")}
							label={t("wallet_deposit_address_card_edit_disctrict")}
						/>
					</Grid>
					<Grid Grid spacing={5} item xs={12}>
						<TextField
							value={form?.details?.openAddress ?? ""}
							onChange={(e) => {
								setForm({ ...form, details: { openAddress: e.target.value } });
							}}
							fullWidth
							multiline
							rows={4}
							placeholder={t("wallet_deposit_address_card_edit_address_placeholder")}
							label={t("wallet_deposit_address_card_edit_address")}
						/>
					</Grid>
				</Grid>
			</DialogContent>
			<DialogActions>
				<Button fullWidth variant="contained" onClick={(e) => onSave(form)}>
					{t("wallet_deposit_address_card_edit_address_save_button")}
				</Button>
				<Button
					fullWidth
					variant="outlined"
					onClick={(e) => setForm(address ? address : { type: "BILL-TO", default: true })}
				>
					{t("wallet_deposit_address_card_edit_address_reset_button")}
				</Button>
			</DialogActions>
		</Dialog>
	);
}
