import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import {
	Box,
	Button,
	Dialog,
	DialogContent,
	DialogTitle,
	FormControl,
	Grid,
	IconButton,
	Typography,
} from "@mui/material";

import Joi from "joi";
import { useSnackbar } from "notistack";
import { v4 as uuidv4 } from "uuid";

import { TextField } from "components";

import { useCommonApi } from "api/common";
import useCatchError from "api/useCatchError";

import { useFetchAuthorized } from "services";
import Config from "services/config";

import { Close as CloseSvg } from "images";

import { expertEditSchema, expertProfileSocialLinks } from "../config";
import EditBannerAndAvatar from "./EditBannerAndAvatar";

export default function EditProfileDialog({ merchant, open, onClose }) {
	const [error, setError] = useState({});
	const [initialSocialLinks, setInitialSocialLinks] = useState([]);

	const { t } = useTranslation("expertPanel");
	const fetchAuthorized = useFetchAuthorized();
	const { enqueueSnackbar } = useSnackbar();
	const { getProfilePostLink, putFileOnS3 } = useCommonApi();
	const catchError = useCatchError();

	const [processing, setProcessing] = useState(false);
	const [profilePicture, setProfilePicture] = useState();
	const [bannerPicture, setBannerPicture] = useState();
	const [profile, setProfile] = useState({
		name: merchant.name,
		surname: merchant.surname,
		nickname: merchant.nickname,
		profilePictureUrl: merchant.profilePictureUrl,
		bannerPictureUrl: merchant.bannerPictureUrl,
		bio: merchant?.bio,
		socialLinks: [],
	});

	const { socialLinks } = profile;

	useEffect(() => {
		const newArray = expertProfileSocialLinks.map((el) => {
			const merchantObj = merchant.socialLinks?.find((el2) => el2.source === el.source);
			return {
				...el,
				link: merchantObj ? merchantObj.link : "",
			};
		});
		if (merchant.socialLinks) {
			setProfile({
				...profile,
				socialLinks: newArray,
			});

			setInitialSocialLinks(newArray);
		}
	}, [merchant.socialLinks.length]);

	const getExtension = (file) => /(?:\.([^.]+))?$/.exec(file.name)[1];

	const validateImage = (img, extension) => {
		if (["jpeg", "jpg", "png"].every((x) => extension !== x)) {
			enqueueSnackbar("Image type should be either jpeg, jpg or png.", { variant: "error" });
			return false;
		}
		if (img.size > 3145728) {
			enqueueSnackbar("Image size should be less than 3MB", { variant: "error" });
			return false;
		}

		return true;
	};

	const onBannerImageChange = (e) => {
		if (!e.target.files?.[0]) return;

		const extension = getExtension(e.target.files[0]);

		if (!validateImage(e.target.files[0], extension)) {
			return;
		}

		setBannerPicture(e.target.files[0]);
	};

	const onAvatarImageChange = (e) => {
		if (!e.target.files?.[0]) return;

		const extension = getExtension(e.target.files[0]);

		if (!validateImage(e.target.files[0], extension)) {
			return;
		}

		setProfilePicture(e.target.files[0]);
	};

	const handleReset = () => {
		setProfile({
			name: merchant.name,
			surname: merchant.surname,
			nickname: merchant.nickname,
			profilePictureUrl: merchant.profilePictureUrl,
			bannerPictureUrl: merchant.bannerPictureUrl,
			bio: merchant?.bio,
			socialLinks: initialSocialLinks,
		});
	};

	const handleInputChange = (event) => {
		setProfile({
			...profile,
			[event.target.id]: event.target.value,
		});
	};

	const handleArrayFieldChange = (e, index, array) => {
		const { name, value } = e.target;
		setProfile({
			...profile,
			[array]: [
				...profile?.[array].slice(0, index),
				{ ...expertProfileSocialLinks[index], [name]: value },
				...profile?.[array].slice(index + 1),
			],
		});
	};

	const checkSocialError = (index, regex) => {
		if (socialLinks?.[index]?.link !== "" && !regex.test(socialLinks?.[index]?.link)) {
			return true;
		}
		return false;
	};

	const validate = () => {
		try {
			Joi.attempt(profile, expertEditSchema);

			return true;
		} catch (err) {
			setError({ [error.message]: true });
			enqueueSnackbar(err.message + " " + err.details, { variant: "error" });
			return false;
		}
	};

	const validateSocials = () => {
		for (let i = 0; i < expertProfileSocialLinks?.length; i++) {
			if (checkSocialError(i, expertProfileSocialLinks[i].regex)) {
				return false;
			}
		}
		return true;
	};

	const handleSubmit = async () => {
		try {
			if (!validate()) return;
			if (!validateSocials()) {
				enqueueSnackbar("There is an error in social link", { variant: "error" });
				return;
			}

			setProcessing(true);

			let profilePictureUrl;
			let bannerPictureUrl;

			if (profilePicture) {
				const extension = getExtension(profilePicture);
				const image = `merchant/profile_pictures/${uuidv4()}.${extension}`;

				const link = await getProfilePostLink(image);
				await putFileOnS3(link?.url, profilePicture);

				profilePictureUrl = `https://cdn2.paratica.com/${image}`;
			}

			if (bannerPicture) {
				const extension = getExtension(bannerPicture);
				const image = `merchant/banner_pictures/${uuidv4()}.${extension}`;

				const link = await getProfilePostLink(image);
				await putFileOnS3(link?.url, bannerPicture);

				bannerPictureUrl = `https://cdn2.paratica.com/${image}`;
			}

			await fetchAuthorized(`${Config.apiRoot()}/marketplace/merchant`, {
				headers: {
					"Content-type": "application/json",
				},
				method: "PUT",
				body: JSON.stringify({
					...profile,
					...(profilePictureUrl ? { profilePictureUrl } : {}),
					...(bannerPictureUrl ? { bannerPictureUrl } : {}),
					...(profile?.socialLinks?.length
						? {
								socialLinks: profile?.socialLinks.filter((x) => Boolean(x?.link)),
						  }
						: {}),
				}),
			});

			enqueueSnackbar("Creator information updated successfully", { variant: "success" });

			onClose();
		} catch (e) {
			catchError(e);
		} finally {
			setProcessing(false);
		}
	};

	return (
		<Dialog
			open={open}
			onClose={onClose}
			sx={{
				"& .MuiPaper-root": {
					margin: "0 0 0 auto",
					height: "100%",
					maxHeight: "none",
					maxWidth: "600px",
					minWidth: "540px",
				},
			}}
		>
			<DialogTitle sx={{ fontSize: 24 }}>
				<IconButton
					aria-label="close"
					onClick={onClose}
					sx={{
						position: "absolute",
						right: 8,
						top: 8,
						color: (theme) => theme.palette.grey[500],
					}}
				>
					<CloseSvg />
				</IconButton>
			</DialogTitle>
			<DialogContent>
				<Grid container spacing={2} direction="column" alignItems="center" justifyContent="center">
					<Grid item xs={12}>
						<Typography variant="h5">{t("expert_panel_edit_profile_main_title")}</Typography>
					</Grid>
					<Grid item xs={12}>
						<Typography paragraph textAlign={"center"}>
							{t("expert_panel_edit_profile_main_text")}
						</Typography>
					</Grid>
				</Grid>
				<Grid sx={{ paddingTop: "16px" }}>
					<Box autocomplete="off">
						<FormControl fullWidth margin="normal">
							<EditBannerAndAvatar
								banner={bannerPicture ? URL.createObjectURL(bannerPicture) : profile?.bannerPictureUrl}
								avatar={
									profilePicture ? URL.createObjectURL(profilePicture) : profile?.profilePictureUrl
								}
								onBannerImageChange={onBannerImageChange}
								onAvatarImageChange={onAvatarImageChange}
							/>
						</FormControl>

						<FormControl fullWidth margin="normal">
							<TextField
								margin="normal"
								fullWidth
								placeholder="Your name"
								error={error.name}
								id={"nickname"}
								onChange={handleInputChange}
								label={t("expert_panel_edit_profile_nickname_title")}
								value={profile?.nickname}
								labelProps={{ sx: { color: (theme) => theme.palette.primary.main } }}
								inputProps={{ maxLength: 20 }}
							/>
						</FormControl>

						<FormControl fullWidth margin="normal">
							<TextField
								margin="normal"
								name="text"
								fullWidth
								multiline
								label={t("expert_panel_edit_profile_bio_title")}
								minRows="6"
								value={profile?.bio[0].text}
								onChange={(e) => handleArrayFieldChange(e, 0, "bio")}
								placeholder="I am an industrial engineer and work as a senior specialist business analysis in a global software company."
								labelProps={{ sx: { color: (theme) => theme.palette.primary.main } }}
								inputProps={{ maxLength: 340 }}
							/>
						</FormControl>

						{expertProfileSocialLinks.map(({ placeholder, regex }, index) => (
							<Grid key={index} container sx={{ mt: 2 }}>
								<Grid item xs={12}>
									<TextField
										name="link"
										variant="outlined"
										placeholder={placeholder}
										fullWidth
										value={socialLinks?.[index]?.link ?? ""}
										error={checkSocialError(index, regex)}
										onChange={(e) => {
											handleArrayFieldChange(e, index, "socialLinks");
											setError({ ...error, source: false });
										}}
									/>
								</Grid>
							</Grid>
						))}

						<Grid container spacing={2} sx={{ paddingTop: "3vh" }}>
							<Grid item xs={12}>
								<Button
									variant={"outlined"}
									disabled={processing}
									onClick={handleReset}
									fullWidth
									type="reset"
								>
									{t("expert_panel_share_strategy_reset_button")}
								</Button>
							</Grid>
							<Grid item xs={12}>
								<Button
									variant="contained"
									disabled={processing}
									fullWidth
									onClick={async () => await handleSubmit()}
								>
									{t("expert_panel_share_strategy_save_button")}
								</Button>
							</Grid>
						</Grid>
					</Box>
				</Grid>
			</DialogContent>
		</Dialog>
	);
}
