import { useTranslation } from "react-i18next";

import { Link, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import Joi from "joi";
import { omit } from "lodash";
import { useSnackbar } from "notistack";

import { PhoneField, TextField } from "components";

import { Config } from "services";

import FileUploader from "./FileUploader";

export default function PersonalInformation({
	profile,
	form,
	error,
	setError,
	onChangeList,
	onChange,
	onClickNext,
	profilePicture,
	setProfilePicture,
}) {
	const { i18n, t } = useTranslation("expertPanel");
	const { enqueueSnackbar } = useSnackbar();

	const personalInfoSchema = Joi.object({
		nickname: Joi.string()
			.required()
			.error(() => new Error("nickname")),
		name: Joi.string()
			.required()
			.error(() => new Error("name")),
		surname: Joi.string()
			.required()
			.error(() => new Error("surname")),
		email: Joi.string()
			.optional()
			.error(() => new Error("email")),
		phoneNumber: Joi.string()
			.optional()
			.allow("")
			.error(() => new Error("phoneNumber")),
		bio: Joi.array()
			.items(
				Joi.object({
					language: Joi.string(),
					text: Joi.string().allow("").optional(),
				})
			)
			.optional()
			.error(() => new Error("bio")),
	});

	const validate = () => {
		try {
			Joi.attempt(
				omit(form, ["strategyInfo", "socialLinks", "bannerPictureUrl", "profilePictureUrl"]),
				personalInfoSchema
			);

			if (!profilePicture) {
				throw new Error("profilePictureUrl");
			}

			return true;
		} catch (error) {
			setError({ [error.message]: true });
			enqueueSnackbar(t(`expert_application_form_missing_fields_error`), { variant: "error" });
			return false;
		}
	};

	const handleClickNext = () => {
		if (!validate()) return;

		onClickNext();
	};

	return (
		<>
			<Box
				sx={{
					backgroundColor: "#fff",
					padding: "2rem",
					marginBlockStart: "-1rem",
					paddingBlockEnd: "0",
					borderRadius: "0.8rem",
				}}
			>
				<Box
					sx={{
						display: "flex",
						flexDirection: "column",
						justifyContent: "center",
						alignItems: "center",
					}}
				>
					<FileUploader
						error={error?.profilePictureUrl}
						profilePicture={profilePicture}
						setProfilePicture={setProfilePicture}
					/>

					<Box
						sx={{
							display: "flex",
							gap: "2rem",
							marginBlock: "1rem",
							width: "22.666rem",
							maxWidth: "100%",
						}}
					>
						<TextField
							name="nickname"
							variant="outlined"
							label={t("expert_application_form_nickname_title")}
							fullWidth
							value={form?.nickname ?? ""}
							error={error?.nickname}
							onChange={(e) => {
								onChange("nickname", e.target.value);
							}}
						/>
					</Box>
				</Box>

				<Box sx={{ display: "flex", gap: "2rem", marginBlock: "1rem" }}>
					<Box sx={{ width: "100%" }}>
						<TextField
							name="name"
							variant="outlined"
							label={t("expert_application_form_name_title")}
							value={form?.name ?? ""}
							error={error?.name}
							onChange={(e) => {
								onChange("name", e.target.value);
							}}
							fullWidth
						/>
					</Box>

					<Box sx={{ width: "100%" }}>
						<TextField
							name="surname"
							variant="outlined"
							label={t("expert_application_form_last_name_title")}
							fullWidth
							value={form?.surname ?? ""}
							error={error?.surname}
							onChange={(e) => {
								onChange("surname", e.target.value);
							}}
						/>
					</Box>
				</Box>
				<Box sx={{ display: "flex", gap: "2rem", marginBlock: "1rem" }}>
					<Box sx={{ width: "100%" }}>
						<TextField
							name="email"
							variant="outlined"
							label={t("expert_application_form_email_title")}
							placeholder="jhon@tradeland.com"
							fullWidth
							value={form?.email ?? ""}
							error={error?.email}
							disabled={Boolean(profile?.email)}
							onChange={(e) => {
								onChange("email", e.target.value);
							}}
							labelProps={{
								sx: {
									color: "#2c3bea",
								},
							}}
						/>
					</Box>

					<Box sx={{ width: "100%" }}>
						<PhoneField
							color="primary"
							name="phone"
							label={t("expert_application_form_phone_title")}
							{...(form?.phoneNumber ? { value: form?.phoneNumber } : {})}
							error={error?.phoneNumber}
							disabled={Boolean(profile?.phoneNumber)}
							onChange={(value) => {
								onChange("phoneNumber", value);
							}}
							fullWidth
						/>
					</Box>
				</Box>

				<Box sx={{ width: "100%", marginBlock: "2rem" }}>
					<TextField
						name="text"
						variant="outlined"
						label={t("expert_application_form_bio_title")}
						placeholder={t("expert_application_form_bio_placeholder")}
						multiline
						rows={5}
						fullWidth
						value={form?.bio[0].text ?? ""}
						error={error?.bio}
						onChange={(e) => {
							onChangeList(e, "bio");
						}}
						sx={{
							border: "1px solid #2c3bea",
						}}
						labelProps={{
							sx: {
								color: "#2c3bea",
							},
						}}
					/>
				</Box>
			</Box>

			<Box
				sx={{
					display: "flex",
					flexDirection: "column",
					alignItems: "flex-end",
					marginBlockStart: "2rem",
				}}
			>
				<Typography
					sx={{
						fontSize: "12px",
						fontWeight: 400,
						lineHeight: "1rem",
						maxWidth: "24rem",
						textAlign: "center",
					}}
					gutterBottom
				>
					{t("expert_application_form_disclaimer_text_1")}
					<Typography
						color="primary"
						sx={{
							fontSize: "12px",
							fontWeight: 600,
							lineHeight: "1rem",
							maxWidth: "24rem",
							textAlign: "center",
							display: "inline",
						}}
					>
						<Link
							href={`${Config.cdnRoot()}/general/agreements/${
								i18n.resolvedLanguage
							}/creator_agreement.pdf`}
							target="_blank"
						>
							{t("expert_application_form_disclaimer_text_2")}{" "}
						</Link>
					</Typography>
					{t("expert_application_form_disclaimer_text_3")}
				</Typography>
				<Button
					variant="contained"
					color="primary"
					onClick={handleClickNext}
					type="button"
					sx={{
						fontSize: 16,
						padding: "0.6rem 10.4rem ",
					}}
				>
					{t("expert_application_form_next_button_text")}
				</Button>
			</Box>
		</>
	);
}
