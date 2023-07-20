import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { Button, Divider, Grid, IconButton, Paper, Typography } from "@mui/material";

import { useSnackbar } from "notistack";

import { useFetchAuthorized } from "services";
import Config from "services/config";

import useCopyToClipboard from "utils/useCopyToClipboard";

import { Duplicate, Plus, ReferansParaticas, StarEmpty, StarFilled } from "images";

export default function ReferenceList() {
	const [references, setReferences] = useState();

	const { t } = useTranslation("accountCenter");
	const navigate = useNavigate();
	const fetchAuthorized = useFetchAuthorized();
	const copyToClipboard = useCopyToClipboard();
	const { enqueueSnackbar } = useSnackbar();

	const makeDefault = (id, isDefault) => {
		const body = { default: isDefault };

		fetchAuthorized(`${Config.apiRoot()}/user/reference-code/${id}`, {
			headers: {
				"Content-type": "application/json",
			},
			method: "PATCH",
			body: JSON.stringify(body),
		})
			.then((data) => data.json())
			.then((data) => {
				if (data?.error?.code !== 0) {
					return;
				}
				setReferences();
			})
			.catch((err) => {});
	};

	const inviteFriends = () => {
		const defaultCode = references?.find((x) => x.default);

		navigator.clipboard.writeText(`${window.location.origin}/register?referenceCode=${defaultCode?.code}`);
		enqueueSnackbar(t("account_center_reference_center_copied_to_clipbord"), { variant: "success" });
	};

	const handleDefault = (reference) => {
		makeDefault(reference.id, !reference.default);
		window.location.reload();
	};

	useEffect(() => {
		if (!references) {
			fetchAuthorized(`${Config.apiRoot()}/user/reference-codes`, {
				headers: {
					"Content-type": "application/json",
				},
				method: "GET",
			})
				.then((data) => data.json())
				.then((data) => {
					setReferences(data.data?.referenceCodes);
				})
				.catch((err) => {});
		}
	}, [references]);

	const ReferenceCard = ({ reference }) => (
		<Paper
			sx={{
				mt: 2,
				backgroundColor: reference.default ? "#F4F5FC" : "#FFFFFF",
				padding: 3,
			}}
			variant="outlined"
		>
			<Grid container>
				<Grid item xs={4}>
					<Typography fontWeight={"Bold"} sx={{ fontSize: "16px" }}>
						{t("account_center_reference_center_table_ref_code")}
					</Typography>
				</Grid>
				<Grid item xs={3}>
					<Typography fontWeight={"Bold"} sx={{ fontSize: "16px" }}>
						{t("account_center_reference_center_table_sharing_ratio")}
					</Typography>
				</Grid>
				<Grid item xs={3}>
					<Typography fontWeight={"Bold"} sx={{ fontSize: "16px" }}>
						{t("account_center_reference_center_table_invited_count")}
					</Typography>
				</Grid>
				<Grid item xs={2}>
					<Button
						sx={{ mt: 1 }}
						variant="text"
						startIcon={reference.default ? <StarFilled /> : <StarEmpty />}
						onClick={() => handleDefault(reference)}
					>
						{reference.default
							? t("account_center_reference_center_table_default_code")
							: t("account_center_reference_center_table_set_default_button")}
					</Button>
				</Grid>
				<Grid item xs={4} sx={{ display: "flex" }}>
					<Typography sx={{ fontSize: "16px", color: (style) => style.palette.primary.main }}>
						{reference.code}
					</Typography>

					<IconButton
						onClick={(e) => {
							copyToClipboard(reference.code);
						}}
						sx={{ mt: -0.5 }}
					>
						<Duplicate />
					</IconButton>
				</Grid>
				<Grid item xs={3}>
					<Typography sx={{ fontSize: "16px", color: (style) => style.palette.primary.main }}>
						{"%" + reference.inviterIncome * 100}
					</Typography>
				</Grid>
				<Grid item xs={3}>
					<Typography sx={{ fontSize: "16px", color: (style) => style.palette.primary.main }}>
						{reference._count?.usedBy}
					</Typography>
				</Grid>
			</Grid>
		</Paper>
	);

	return (
		<React.Fragment>
			<Grid container>
				<Grid
					item
					xs={8}
					sx={{
						mt: 10,
					}}
				>
					<Paper
						sx={{
							mt: 2,
							backgroundColor: "#FFFFFF",
							padding: 5,
						}}
					>
						<Grid container>
							<Grid item xs={12}>
								<Typography fontWeight={"Bold"} sx={{ fontSize: "24px" }}>
									{t("account_center_reference_center_main_title")}
								</Typography>
							</Grid>
							<Grid item xs={12}>
								<Typography sx={{ mt: 2, fontSize: "14px" }}>
									{t("account_center_reference_center_main_text")}
								</Typography>
							</Grid>
							<Grid item xs={12}>
								<Divider sx={{ mt: 2, fontSize: "14px" }}></Divider>
							</Grid>
							{references &&
								references
									.sort((a, b) => Number(b.default) - Number(a.default))
									.map((reference, ix) => (
										<Grid item xs={12} key={ix}>
											<ReferenceCard reference={reference} />
										</Grid>
									))}
							<Grid item xs={12}>
								<Paper
									sx={{
										mt: 2,
										padding: 3,
									}}
									variant="outlined"
								>
									<Grid container>
										<Grid item xs={2}>
											<Duplicate />
										</Grid>
										<Grid item xs={9}>
											<Typography
												fontWeight={"Bold"}
												sx={{ fontSize: "16px", color: (theme) => theme.palette.primary.main }}
											>
												{t("account_center_reference_center_table_create_code_title")}
											</Typography>
											<Typography sx={{ fontSize: "14px", mt: 1 }}>
												{t("account_center_reference_center_table_create_code_text")}
											</Typography>
										</Grid>
										<Grid item xs={1}>
											<IconButton sx={{ mt: 1 }}>
												<Plus onClick={(e) => navigate("/create-reference-info")} />
											</IconButton>
										</Grid>
									</Grid>
								</Paper>
							</Grid>
						</Grid>
					</Paper>
				</Grid>
				<Grid item xs={4}>
					<Paper
						sx={{
							ml: 1,
							mt: 12,
							backgroundColor: "#FFFFFF",
							padding: 5,
						}}
					>
						<Grid container>
							<Grid item xs={6}>
								<Typography
									fontWeight={"Bold"}
									sx={{ fontSize: "32px", color: (theme) => theme.palette.primary.main }}
								>
									{t("account_center_reference_center_info_card_main_title")}
								</Typography>
							</Grid>
							<Grid item xs={6}>
								<ReferansParaticas />
							</Grid>
							<Grid item xs={12}>
								<Typography sx={{ fontSize: "14px" }}>
									{t("account_center_reference_center_info_card_main_text")}
								</Typography>
							</Grid>
							<Grid item xs={12}>
								<Button fullWidth sx={{ mt: 1 }} variant="contained" onClick={inviteFriends}>
									{t("account_center_reference_center_info_card_invite_button_text")}
								</Button>
							</Grid>
						</Grid>
					</Paper>
				</Grid>
			</Grid>
		</React.Fragment>
	);
}
