import { useTranslation } from "react-i18next";

import { CheckCircle } from "@mui/icons-material";
import { Grid, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import { TextField } from "components";

export default function AdditionalInformation({ form, error, onChangeList, onSubmit, onClickPrevious }) {
	const { t } = useTranslation("expertPanel");

	const socialMediaList = [
		{
			source: "linkedin",
			regex: new RegExp("^(http(s)?://)?(www.)?linkedin.com/(in|profile|pub)/([A-z 0-9 _ -]+)/?$"),
			placeholder: t("expert_application_form_socials_example_placeholder") + " www.linkedin.com/in/traderlands",
		},
		{
			source: "twitter",
			regex: new RegExp("^(http(s)?://)?(www.)?twitter.com/[A-z 0-9 _]{1,15}/?$"),
			placeholder: t("expert_application_form_socials_example_placeholder") + " twitter.com/traderlands",
		},
		{
			source: "youtube",
			regex: new RegExp("^(http(s)?://)?(www.)?youtube.com/@[A-z 0-9 _]{1,15}/?$"),
			placeholder: t("expert_application_form_socials_example_placeholder") + " youtube.com/@traderlands",
		},
		{
			source: "tradingview",
			regex: new RegExp("^(http(s)?://)?(www.)?tradingview.com/(u)/([A-z 0-9 _ -]+)/?$"),
			placeholder: t("expert_application_form_socials_example_placeholder") + " tradingview.com/u/traderlands",
		},
	];

	return (
		<>
			<Box
				sx={{
					backgroundColor: "#fff",
					paddingInline: "2rem",
					paddingBlockEnd: "2rem",
					borderRadius: "2rem",
					marginBlockStart: "-1rem",
				}}
			>
				<Box sx={{ width: "100%", marginBlockEnd: "-1rem" }}>
					<TextField
						name="text"
						variant="outlined"
						label={t("expert_application_form_strategy_info_title")}
						placeholder={t("expert_application_form_strategy_info_placeholder")}
						multiline
						rows={5}
						value={form?.strategyInfo[0].text ?? ""}
						error={error?.strategyInfo}
						onChange={(e) => {
							onChangeList(e, "strategyInfo");
						}}
						fullWidth
					/>
				</Box>

				<Box sx={{ width: "60%", marginBlock: "2rem" }}>
					<Typography gutterBottom sx={{ color: "#2c3bea" }}>
						{t("expert_application_form_socials_title")}
					</Typography>
					{socialMediaList.map(({ source, placeholder, regex }, index) => (
						<Grid key={index} container sx={{ mb: 2 }}>
							<Grid item xs={10}>
								<TextField
									name="link"
									variant="outlined"
									placeholder={placeholder}
									fullWidth
									value={form?.socialLinks?.[index]?.link ?? ""}
									error={error?.[`socialLinks.${index}`]}
									onChange={(e) => {
										onChangeList(e, "socialLinks", index);
									}}
								/>
							</Grid>
							<Grid item xs={2}>
								{regex.test(form?.socialLinks?.[index]?.link) && (
									<Box sx={{ pl: 2, pt: 2 }}>
										<CheckCircle
											sx={{
												color: (theme) => theme.palette.primary.main,
											}}
										/>
									</Box>
								)}
							</Grid>
						</Grid>
					))}
				</Box>
			</Box>

			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
					marginBlockStart: "2rem",
				}}
			>
				<Button
					variant="outlined"
					color="primary"
					onClick={onClickPrevious}
					type="button"
					sx={{
						fontSize: 16,
						padding: "0.6rem 3.4rem ",
					}}
				>
					{t("expert_application_form_back_button_text")}
				</Button>
				<Button
					variant="contained"
					color="primary"
					type="submit"
					onClick={async () => await onSubmit()}
					sx={{
						fontSize: 16,
						padding: "0.6rem 5.4rem ",
					}}
				>
					{t("expert_application_form_submit_button_text")}
				</Button>
			</Box>
		</>
	);
}
