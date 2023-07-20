import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import { Edit } from "@mui/icons-material";
import { Button, Card, CardContent, CardHeader, Grid, Typography } from "@mui/material";

import { Config } from "services";

import PairDialog from "./PairDialog";

export default function ChoosePair() {
	const { parities } = useSelector((state) => state.parity);

	const { t } = useTranslation("workshop");

	const { strategy } = useSelector((state) => state.strategyBuilder);

	const [open, setOpen] = useState();

	const selectedParities = strategy?.parities?.symbols
		? parities?.filter((y) => strategy?.parities?.symbols?.some((x) => x === y.id))
		: null;

	return (
		<>
			<Card sx={{ borderRadius: "8px", border: "1px solid #CFD2FA", marginTop: 2 }}>
				<CardHeader
					title={
						<Typography
							sx={{ color: (theme) => theme.palette.primary.main, fontSize: "1rem", fontWeight: 700 }}
						>
							{t("workshop_presets_select_pair_dialog_main_title")}
						</Typography>
					}
					sx={{
						paddingBottom: "0",
					}}
				/>
				<CardContent>
					<Grid container spacing={1}>
						<Grid item xs={12}>
							<Typography variant="p" sx={{ fontSize: "14px" }}>
								{t("workshop_presets_choose_parities_text_1")}
								<span style={{ fontWeight: "bold" }}>
									{t("workshop_presets_choose_parities_text_2")}
								</span>
							</Typography>
						</Grid>
						{strategy?.parities && (
							<Grid item xs={12}>
								<Grid container>
									{selectedParities ? (
										<>
											{selectedParities?.slice(0, 10)?.map(({ base }) => (
												<>
													{base ? (
														<Grid item>
															<img
																style={{ marginRight: "8px" }}
																width="36px"
																height="36px"
																src={`${Config.cdnRoot()}/general/crypto-icons/${base}.png`}
															/>
														</Grid>
													) : (
														<> </>
													)}
												</>
											))}
										</>
									) : (
										<></>
									)}
									{strategy?.parities?.symbols?.length > 10 ? (
										<Grid item>
											<Button
												sx={{
													fontWeight: "bold",
													paddingLeft: 0,
													paddingRight: 0,
													minWidth: "32px",
													"&:hover": {
														textDecoration: "underline",
													},
												}}
												onClick={() => setOpen(true)}
												variant="text"
											>{`+ ${strategy?.parities.symbols.length - 10}`}</Button>
										</Grid>
									) : (
										<></>
									)}
								</Grid>
							</Grid>
						)}

						<Grid item xs={12}>
							<Button
								startIcon={<Edit />}
								variant="text"
								onClick={() => {
									setOpen(true);
								}}
								disabled={!strategy?.platformId}
							>
								{t("workshop_presets_choose_parities_edit")}
							</Button>
						</Grid>
					</Grid>
				</CardContent>
			</Card>
			{open && <PairDialog open={open} onClose={() => setOpen(false)} />}
		</>
	);
}
