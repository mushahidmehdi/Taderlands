import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { Box, Button, CircularProgress, Grid, Paper, Typography } from "@mui/material";

import { setActiveStep } from "actions/StrategyBuilderActions";
import { Chip, Dialog } from "components";
import { Edit, SpotRight } from "images";
import { useTranslation } from "react-i18next";
import Config from "services/config";

const StrategyCard = ({ strategy }) => {
	const { parities: allParities } = useSelector((state) => state.parity);
	const { name, executionType, platform, labels, id, webhookToken } = strategy;
	const parities = allParities.filter((x) => strategy?.parities?.symbols?.some((y) => y == x.id));

	const [open, setOpen] = useState(false);
	const { t } = useTranslation();

	const navigate = useNavigate();
	const dispatch = useDispatch();

	const handleClose = () => {
		setOpen(false);
	};

	return (
		<>
			<Dialog
				dialogProps={{ open, onClose: handleClose }}
				title={"Parities"}
				content={
					<Grid container>
						{parities &&
							parities?.map(({ base, quote }, ix) => (
								<Button
									key={ix}
									sx={{
										ml: 2,
										mt: 1,
										borderRadius: "8px",
										minWidth: "150px",
										maxWidth: "150px",
										maxHeight: "100px",
										padding: "8px",
										cursor: "pointer",
										color: "black",
										border: "1px solid #CFD2FA",
									}}
									startIcon={
										<img
											width="24px"
											height="24px"
											style={{ marginLeft: 8 }}
											src={`${Config.cdnRoot()}/general/crypto-icons/${base}.png`}
										/>
									}
								>
									<Grid container sx={{ marginLeft: 1 }}>
										<Grid item>
											<Typography
												variant="subtitle1"
												fontWeight="bold"
												sx={{ textAlign: "left" }}
											>
												{base}
											</Typography>
											<Grid container>
												<Grid item>
													<SpotRight style={{ marginTop: 2, marginRight: 4 }} />
												</Grid>
												<Grid item>
													<Typography variant="p">{quote}</Typography>
												</Grid>
											</Grid>
										</Grid>
									</Grid>
								</Button>
							))}
					</Grid>
				}
			></Dialog>
			<Paper sx={{ mt: 2, padding: 2 }} variant="outlined">
				<Grid container>
					<Grid item xs={1}>
						<Box
							component="img"
							src={`${Config.cdnRoot()}/general/exchange-icons/${platform?.exchange}.png`}
							sx={{ width: 60, height: 60 }}
						/>
					</Grid>
					<Grid item xs={5}>
						<Grid item xs={12}>
							<Typography
								sx={{
									ml: 2,
									fontSize: "16px",
									fontWeight: "bold",
									color: (theme) => theme.palette.primary.main,
								}}
							>
								{`${name}${webhookToken ? " (tradingview)" : ""}`}
							</Typography>
						</Grid>
						<Grid item xs={12}>
							<Chip
								variant="contained"
								backgroundColor={"#6A1FC2"}
								label={executionType}
								sx={{ fontSize: "12px", ml: 2, mt: 1 }}
							/>
							{labels &&
								labels.map(
									(label, ix) =>
										label && (
											<Chip
												key={ix}
												variant="contained"
												backgroundColor={"#0F20E8"}
												label={label}
												sx={{ fontSize: "12px", ml: 1, mt: 1 }}
											/>
										)
								)}
						</Grid>
					</Grid>
					<Grid item xs={4}>
						<Grid item xs={12}>
							<Grid container>
								{parities &&
									parities.slice(0, 10).map(({ base }, ix) => (
										<Grid item key={ix}>
											<img
												style={{ marginRight: "-8px" }}
												width="24px"
												height="24px"
												src={`${Config.cdnRoot()}/general/crypto-icons/${base}.png`}
											/>
										</Grid>
									))}
								{strategy?.parities?.symbols?.length > 10 ? (
									<Grid item>
										<Button
											sx={{
												mt: "-4px",
												ml: 2,
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
						<Grid item xs={12}>
							<Button
								sx={{
									ml: 5,
									fontSize: "14px",
									"&:hover": {
										textDecoration: "underline",
									},
								}}
								onClick={() => setOpen(true)}
								variant="text"
							>
								{t("workshop:workshop_my_strategies_see_all_button")}
							</Button>
						</Grid>
					</Grid>
					<Grid item xs={2}>
						<Button
							startIcon={<Edit />}
							variant="text"
							onClick={() => {
								dispatch(setActiveStep(0));
								navigate(`/strategy-builder/${id}`);
							}}
						>
							{t("workshop:workshop_my_strategies_edit_button")}
						</Button>
					</Grid>
				</Grid>
			</Paper>
		</>
	);
};

export default function MyStrategies() {
	const { strategies } = useSelector((state) => state.strategyBuilder);

	return (
		<React.Fragment>
			{strategies ? (
				<>
					{strategies.map((strategy, ix) => (
						<StrategyCard key={ix} strategy={strategy} />
					))}
				</>
			) : (
				<CircularProgress />
			)}
		</React.Fragment>
	);
}
