import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import SearchIcon from "@mui/icons-material/Search";
import { Button, Checkbox, DialogContent, Grid, InputAdornment, Typography } from "@mui/material";

import { useSnackbar } from "notistack";

import { CoinIcon, TextField } from "components";

import { setStrategies } from "actions/StrategyActions";

import { useFetchAuthorized } from "services";
import Config from "services/config";

import { SpotRight } from "images";

import { RobotContext } from "./RobotDialog";
import { SUCCESS } from "./utils/constant";

const Portfolio = ({ strategyName, contentProps }) => {
	const { parities: allParities } = useSelector((state) => state.parity);
	const { strategies } = useSelector((state) => state.strategy);

	const { setSelection, setSuccessMessage, selectedStrategyFollower, setSelectedStrategyFollower } =
		useContext(RobotContext);

	const { strategy, blacklist } = selectedStrategyFollower;

	const [parities, setParities] = useState(
		allParities
			.filter((x) => strategy?.parities?.symbols?.includes(x.id))
			.map((item) => (blacklist?.symbols?.includes(item.id) ? { ...item, blacklist: true } : item))
	);
	const [search, setSearch] = useState();

	const dispatch = useDispatch();
	const fetchAuthorized = useFetchAuthorized();
	const { t } = useTranslation();
	const { enqueueSnackbar } = useSnackbar();

	const updateBlackList = () => {
		const blacklist = parities.reduce(
			(acc, curr) => {
				if (curr.blacklist) {
					acc.symbols = [...acc.symbols, curr.id];
					acc.quotes = [...new Set([...acc.quotes, curr.quote])];
				}
				return acc;
			},
			{
				symbols: [],
				quotes: [],
			}
		);

		fetchAuthorized(`${Config.apiRoot()}/strategy/strategy/${strategy.id}/followed/blacklist`, {
			headers: {
				"Content-type": "application/json",
			},
			method: "POST",
			body: JSON.stringify(blacklist),
		})
			.then((data) => data.json())
			.then((_) => {
				dispatch(
					setStrategies(
						strategies?.map((item) => (item.strategy.id === strategy.id ? { ...item, blacklist } : item))
					)
				);

				setSelectedStrategyFollower({ ...selectedStrategyFollower, blacklist });

				setSuccessMessage({
					title: "Portfolio settings are saved successfully",
					subtitle:
						"Also you can revert to the expert's settings at any time, for this the default button is waiting for you.",
				});

				setSelection(SUCCESS);
			})
			.catch((err) => {
				enqueueSnackbar(t("Bir hata ile karşılaşıldı"), { variant: "error" });
			});
	};

	return (
		<>
			<DialogContent sx={{ paddingTop: "10vh !important" }} {...contentProps}>
				<Grid container spacing={2} direction="column" alignItems="center" justifyContent="center">
					<Grid item xs={12}>
						<Typography variant="h5">
							{t("control_panel_robot_settings_portfolio_settings_title")}
						</Typography>
					</Grid>
					<Grid item xs={12}>
						{strategyName}
					</Grid>
					<Grid item xs={12}>
						<Typography variant="p">
							{t("control_panel_robot_settings_portfolio_settings_text", {
								name: strategy?.marketStrategy?.name ?? strategy?.name,
							})}
						</Typography>
					</Grid>
				</Grid>

				<Grid container>
					<Grid item xs={12} sx={{ marginTop: 3 }}>
						<TextField
							placeholder="Search..."
							fullWidth
							style={{ backgroundColor: "#F1F1F5", border: "gray" }}
							startAdornment={
								<InputAdornment position="start">
									<SearchIcon />
								</InputAdornment>
							}
							onChange={(e) => setSearch(e.target.value)}
						/>
					</Grid>

					{parities.map((parity, index) => (
						<>
							{search && !parity.base.toLowerCase().startsWith(search.toLowerCase()) ? (
								<></>
							) : (
								<Grid
									item
									sx={{
										borderRadius: 1,
										border: "1px solid #CFD2FA",
										marginTop: 5,
										marginLeft: 1,
										position: "relative",
										px: 0.2,
									}}
									key={index}
								>
									<Checkbox
										style={{
											position: "absolute",
											top: "-15px",
											right: "40%",
											marginBottom: "2px",
											padding: "2px",
										}}
										checked={!parity.blacklist}
										onChange={(e) => {
											setParities([
												...parities.slice(0, index),
												{
													...parities[index],
													blacklist: !e.target.checked,
												},
												...parities.slice(index + 1),
											]);
										}}
									/>
									<Button
										sx={{
											borderRadius: "8px",
											minWidth: "150px",
											maxWidth: "150px",
											maxHeight: "100px",
											padding: "8px",
											cursor: "pointer",
										}}
										startIcon={
											<CoinIcon
												width="24px"
												height="24px"
												quote={parity.base}
												styleInfo="marginLeft:8"
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
													{parity.base}
												</Typography>
												<Grid container>
													<Grid item>
														<SpotRight style={{ marginTop: 2, marginRight: 4 }} />
													</Grid>
													<Grid item>
														<Typography variant="p">{parity.quote}</Typography>
													</Grid>
												</Grid>
											</Grid>
										</Grid>
									</Button>
								</Grid>
							)}
						</>
					))}
				</Grid>

				<Grid container spacing={2} sx={{ paddingTop: "3vh" }}>
					<Grid item xs={12}>
						<Button
							fullWidth
							variant="contained"
							onClick={() => {
								updateBlackList();
							}}
						>
							{t("control_panel_robot_settings_status_button_save")}
						</Button>
					</Grid>
				</Grid>
			</DialogContent>
		</>
	);
};

export default Portfolio;
