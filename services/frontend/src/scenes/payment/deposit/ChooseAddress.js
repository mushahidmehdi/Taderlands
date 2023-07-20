import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { omit } from "lodash";
import { useSnackbar } from "notistack";

import { Button, CircularProgress, Grid, IconButton, Paper, Radio, Typography } from "@mui/material";

import { RouteLayout } from "components";
import PageCenteredProgress from "components/PageCenteredProgress";
import { Plus, WallClock } from "images";
import { useFetchAuthorized } from "services";
import Config from "services/config";

import AddressDialog from "./AddressDialog";

export default function ChooseAddress() {
	const [processing, setProcessing] = useState(true);
	const [addresses, setAddresses] = useState();
	const [selected, setSelected] = useState();
	const [dialogOpen, setDialogOpen] = useState(false);
	const [updateAddress, setUpdateAddress] = useState();

	const fetchAuthorized = useFetchAuthorized();
	const { enqueueSnackbar } = useSnackbar();
	const { t } = useTranslation("wallet");
	const navigate = useNavigate();

	const getAddresses = () => {
		fetchAuthorized(`${Config.apiRoot()}/user/billing-address`, {
			headers: {
				"Content-type": "application/json",
			},
			method: "GET",
		})
			.then((data) => data.json())
			.then((data) => {
				if (data?.error?.code) {
					enqueueSnackbar(t("Bir hata ile karşılaşıldı"), { variant: "error" });
					return;
				}
				setAddresses(data?.data?.userShoppingAddresses);
				setProcessing(false);
			})
			.catch((err) => {
				console.log(err);
				enqueueSnackbar(t("Bir hata ile karşılaşıldı"), { variant: "error" });
			});
	};

	const saveAddress = (address) => {
		fetchAuthorized(`${Config.apiRoot()}/user/billing-address${updateAddress ? "/" + address.id.toString() : ""}`, {
			headers: {
				"Content-type": "application/json",
			},
			method: updateAddress ? "PATCH" : "POST",
			body: JSON.stringify(omit(address, ["id", "updatedAt", "userId", "createdAt", "createdBy", "postalCode"])),
		})
			.then((data) => data.json())
			.then((data) => {
				if (data?.error?.code) {
					enqueueSnackbar(t("Bir hata ile karşılaşıldı"), { variant: "error" });
					return;
				}
				setDialogOpen(false);
				getAddresses();
			})
			.catch((err) => {
				enqueueSnackbar(t("Bir hata ile karşılaşıldı"), { variant: "error" });
			});
	};

	useEffect(() => {
		getAddresses();
	}, []);

	const handleNext = () => {
		navigate("/payment/crypto-deposit");
	};

	const handleUpdate = (address) => {
		setUpdateAddress(address);
		setDialogOpen(true);
	};

	const handleAdd = () => {
		setUpdateAddress();
		setDialogOpen(true);
	};

	const AddressCard = ({ address }) => (
		<Paper
			sx={{
				mt: 2,
				ml: 2,
				minHeight: "120px",
				borderColor: (theme) =>
					selected === address?.id ? theme.palette.primary.main : theme.palette.primary.light,
			}}
			variant="outlined"
		>
			<Grid container>
				<Grid item xs={1} sx={{ alignSelf: "center" }}>
					<Radio
						sx={{ color: (theme) => theme.palette.primary.main }}
						checked={selected === address?.id?.toString()}
						value={address?.id?.toString()}
						onChange={(e) => setSelected(e.target.value)}
					/>
				</Grid>
				<Grid item xs={8}>
					<Typography sx={{ ml: 1, mt: 1.5, fontSize: "14px", color: (theme) => theme.palette.primary.main }}>
						{address?.label + " - " + address?.person}
					</Typography>
				</Grid>
				<Grid item xs={3}>
					<Button
						variant="text"
						sx={{ mt: 1, fontSize: "14px", color: (theme) => theme.palette.secondary.main }}
						onClick={(e) => handleUpdate(address)}
					>
						{t("wallet_deposit_address_card_edit_button_text")}
					</Button>
				</Grid>
				<Grid item xs={12}>
					<Typography
						fontWeight={"Bold"}
						sx={{ ml: 2, fontSize: "14px", color: (theme) => theme.palette.primary.main }}
					>
						{t("wallet_deposit_address_card_title")}
					</Typography>
				</Grid>
				<Grid item xs={12}>
					<Typography sx={{ ml: 2, fontSize: "14px" }}>{address?.details?.openAddress}</Typography>
				</Grid>
				<Grid item xs={12}>
					<Typography sx={{ ml: 2, fontSize: "14px" }}>{address?.province + "/" + address?.city}</Typography>
				</Grid>
			</Grid>
		</Paper>
	);

	return (
		<>
			{dialogOpen && (
				<AddressDialog
					open={dialogOpen}
					setOpen={setDialogOpen}
					onSave={saveAddress}
					address={updateAddress}
				></AddressDialog>
			)}
			{processing ? (
				<PageCenteredProgress open={processing} />
			) : (
				<RouteLayout header={t("wallet_deposit_address_main_title")}>
					<div style={{ marginRight: "4vw" }}>
						<Grid container>
							<Grid item xs={8}>
								<Paper
									sx={{
										boxShadow: 0,
										backgroundColor: "#FFFFFF",
										padding: 2,
										display: "flex",
										flexDirection: "column",
										alignItems: "start",
										minHeight: "350px",
									}}
								>
									<Typography
										fontWeight={"Bold"}
										sx={{
											fontSize: "24px",
											mt: 2,
											ml: 2,
											color: (theme) => theme.palette.primary.main,
										}}
									>
										{t("wallet_deposit_address_sub_title")}
									</Typography>

									{addresses ? (
										<Grid container>
											{addresses.map((item, index) => {
												return (
													<Grid item xs={6} key={index}>
														<AddressCard address={item}></AddressCard>
													</Grid>
												);
											})}
											<Grid xs={6}>
												<Paper
													sx={{
														mt: 2,
														ml: 2,
														borderColor: (theme) => theme.palette.primary.light,
														minHeight: "120px",
													}}
													variant="outlined"
												>
													<Grid container>
														<Grid item xs={12}>
															<IconButton
																onClick={(e) => handleAdd()}
																sx={{
																	ml: 1,
																	mt: 1,
																}}
															>
																<Plus />
															</IconButton>
														</Grid>
														<Grid item xs={12}>
															<Typography
																sx={{
																	ml: 2,
																	fontSize: "16px",
																	color: (theme) => theme.palette.primary.main,
																}}
															>
																{t("wallet_deposit_address_card_add_new_title")}
															</Typography>
														</Grid>
														<Grid item xs={12}>
															<Typography sx={{ ml: 2, fontSize: "14px" }}>
																{t("wallet_deposit_address_card_add_new_sub_title")}
															</Typography>
														</Grid>
													</Grid>
												</Paper>
											</Grid>
										</Grid>
									) : (
										<CircularProgress />
									)}
								</Paper>
							</Grid>
							<Grid item xs={4}>
								<Paper
									sx={{
										boxShadow: 0,
										backgroundColor: "#FFFFFF",
										padding: 2,
										display: "flex",
										flexDirection: "column",
										alignItems: "start",
										ml: 1,
										minHeight: "350px",
									}}
								>
									<WallClock />

									<Typography fontWeight={"Bold"} sx={{ ml: 2, mt: 1, fontSize: "24px" }}>
										{t("wallet_deposit_address_info_card_title")}
									</Typography>
									<Typography sx={{ ml: 2, mt: 1, fontSize: "12px" }}>
										{t("wallet_deposit_address_info_card_text")}
									</Typography>
								</Paper>
							</Grid>
							<Grid item xs={8}></Grid>
							<Grid item xs={4}>
								<Button
									disabled={!selected}
									variant="contained"
									onClick={handleNext}
									sx={{ ml: 2, mt: 1, fontSize: "16px", width: "90%" }}
								>
									{t("wallet_deposit_address_continue_button_text")}
								</Button>
							</Grid>
						</Grid>
					</div>
				</RouteLayout>
			)}
		</>
	);
}
