import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { Typography } from "@mui/material";
import Box from "@mui/material/Box";

import Joi from "joi";
import { omit, pick } from "lodash";
import { useSnackbar } from "notistack";
import { v4 as uuidv4 } from "uuid";

import { Breadcrumbs, PageCenteredProgress, RouteLayout } from "components";

import { useCommonApi } from "api/common";
import { useMarketplaceApi } from "api/marketplace";
import useCatchError from "api/useCatchError";
import { useUserApi } from "api/user";

import { setProfile } from "actions/UserActions";

import AdditionalInformation from "./AdditionalInformation";
import PersonalInformation from "./PersonalInformation";

const bannerPictureUrl = "https://cdn2.paratica.com/merchant/expert_banner.png";

export default function ExpertApplication() {
	const { postExpertForm } = useMarketplaceApi();
	const { getProfile } = useUserApi();
	const { getProfilePostLink, putFileOnS3 } = useCommonApi();

	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { t } = useTranslation("expertPanel");
	const { enqueueSnackbar } = useSnackbar();
	const catchError = useCatchError();

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

	const { profile } = useSelector((state) => state.user);

	const [active, setActive] = useState(1);
	const [error, setError] = useState({});

	const [form, setForm] = useState({
		name: "",
		surname: "",
		nickname: "",
		email: profile?.email ?? "",
		phoneNumber: profile?.phoneNumber ?? "",
		bannerPictureUrl,
		profilePictureUrl: null,
		bio: [{ language: "tr", text: "" }],
		strategyInfo: [{ language: "tr", text: "" }],
		socialLinks: socialMediaList.map(({ source }) => ({
			source,
			link: "",
		})),
	});
	const [profilePicture, setProfilePicture] = useState();
	const [processing, setProcessing] = useState();

	useEffect(() => {
		getProfile().then((data) => {
			const profileData = data?.data?.profile;

			dispatch(setProfile(profileData));

			if (profileData?.merchant?.id) {
				if (profileData?.merchant?.progressStatus !== "ACCEPTED") {
					navigate("/workshop");
				} else {
					navigate(`/expert-panel/${profileData?.merchant?.id}`);
				}
			}
		});
	}, []);

	const handleClickNext = () => {
		if (active < 2) {
			setActive(active + 1);
		}
	};

	const handleClickPrevious = () => {
		if (active > 0) {
			setActive(active - 1);
		}
	};

	const handleFormChange = (key, value) => {
		setForm({ ...form, [key]: value });
		setError({ ...error, [key]: false });
	};

	const handleChangeList = (e, key, index = 0) => {
		const { name, value } = e.target;
		const copiedList = [...form?.[key]];

		copiedList[index][name] = value;

		setForm({ ...form, [key]: copiedList });
		setError({ ...error, [key]: false });
	};

	const additionalInfoSchema = Joi.object({
		strategyInfo: Joi.array()
			.items(
				Joi.object({
					language: Joi.string(),
					text: Joi.string().allow("").optional(),
				})
			)
			.optional()
			.error(() => new Error("strategyInfo")),
		socialLinks: Joi.array().optional(),
	});

	const validateSocialMediaLinks = () => {
		for (let i = 0; i < socialMediaList.length; i++) {
			if (form.socialLinks[i].link && !socialMediaList[i].regex.test(form.socialLinks[i].link)) {
				throw new Error(`socialLinks.${i}`);
			}
		}
	};

	const validate = () => {
		try {
			Joi.attempt(pick(form, ["strategyInfo", "socialLinks"]), additionalInfoSchema);

			validateSocialMediaLinks();

			return true;
		} catch (error) {
			setError({ [error.message]: true });
			enqueueSnackbar(t(`expert_application_form_missing_fields_error`), { variant: "error" });
			return false;
		}
	};

	const getExtension = (file) => /(?:\.([^.]+))?$/.exec(file.name)[1];

	const handleSubmit = async () => {
		try {
			if (!validate()) return;

			setProcessing(true);

			let profilePictureUrl;

			if (profilePicture) {
				const extension = getExtension(profilePicture);
				const image = `merchant/profile_pictures/${uuidv4()}.${extension}`;

				const link = await getProfilePostLink(image);
				await putFileOnS3(link?.url, profilePicture);

				profilePictureUrl = `https://cdn2.paratica.com/${image}`;
			}

			const nonEmptySocialLinks = form.socialLinks.filter((x) => Boolean(x.link));

			await postExpertForm(
				!nonEmptySocialLinks.length
					? omit({ ...form, profilePictureUrl }, ["socialLinks"])
					: {
							...form,
							profilePictureUrl,
							socialLinks: nonEmptySocialLinks,
					  }
			);

			navigate("/workshop");
		} catch (e) {
			catchError(e);
		} finally {
			setProcessing(false);
		}
	};

	return (
		<>
			{processing ? (
				<PageCenteredProgress />
			) : (
				<RouteLayout
					headerComp={
						<Breadcrumbs
							paths={[
								{
									text: t("expert_application_form_top_title"),
									onClick: () => navigate("/workshop"),
								},
								{
									text: t("expert_application_form_main_title"),
								},
							]}
						/>
					}
				>
					<Box sx={{ flex: 1, display: "flex", flexDirection: "column", mb: 5 }}>
						<Box
							sx={{
								backgroundColor: "#fff",
								padding: "2rem",
								paddingBlockStart: "1.5rem",
								borderRadius: "0.8rem",
							}}
						>
							<Typography
								sx={{
									fontSize: "24px",
									fontWeight: 700,
									lineHeight: "28px",
								}}
							>
								{t("expert_application_form_main_title")}
							</Typography>

							<Typography
								sx={{
									mt: "8px",
									fontSize: "14px",
									fontWeight: 400,
									lineHeight: "18px",
									marginBlockEnd: "1rem",
								}}
							>
								{t("expert_application_form_main_text")}
							</Typography>
						</Box>
						{active === 1 && (
							<PersonalInformation
								profile={profile}
								form={form}
								error={error}
								setError={setError}
								onChange={handleFormChange}
								onChangeList={handleChangeList}
								onClickNext={handleClickNext}
								profilePicture={profilePicture}
								setProfilePicture={setProfilePicture}
							/>
						)}
						{active === 2 && (
							<AdditionalInformation
								form={form}
								error={error}
								onChangeList={handleChangeList}
								onClickPrevious={handleClickPrevious}
								onSubmit={handleSubmit}
							/>
						)}
					</Box>
				</RouteLayout>
			)}
		</>
	);
}
