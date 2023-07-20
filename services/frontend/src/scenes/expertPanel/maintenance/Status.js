import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { Box, Button, DialogContent, Grid, Radio, Typography } from "@mui/material";

import { useSnackbar } from "notistack";

import { useMarketplaceApi } from "api/marketplace";

import { setStrategies } from "actions/StrategyActions";

import { useFetchAuthorized } from "services";

import { run, trace } from "images";

import { MaintenanceContext } from "./MaintenanceDialog";
import { SUCCESS } from "./utils/constant";

const Status = ({ strategyName, contentProps }) => {
	const { setSelection, setSuccessMessage, selectedStrategy, setSelectedStrategy } = useContext(MaintenanceContext);
	const { marketStrategy } = selectedStrategy;
	const { status: initialStatus } = marketStrategy;
	const { strategies } = useSelector((state) => state.strategy);

	const [status, setStatus] = useState(initialStatus ?? "");

	const { postMarketStrategyStatus } = useMarketplaceApi();
	const fetchAuthorized = useFetchAuthorized();
	const { t } = useTranslation("expertPanel");
	const dispatch = useDispatch();
	const { enqueueSnackbar } = useSnackbar();

	const changeRobotStatus = () => {
		const body = { status };

		postMarketStrategyStatus(marketStrategy?.id, body)
			.then((_) => {
				dispatch(
					setStrategies(
						strategies?.map((item) =>
							item.strategy.id === selectedStrategy.id
								? {
										...item,
										marketStrategy: { ...item.marketStrategy, status },
								  }
								: item
						)
					)
				);

				setSelectedStrategy({
					...selectedStrategy,
					marketStrategy: { ...selectedStrategy.marketStrategy, status },
				});

				setSuccessMessage({
					title: t("expert_panel_market_status_settings_success_title"),
					subtitle: t("expert_panel_market_status_settings_success_text"),
				});

				setSelection(SUCCESS);
			})
			.catch((err) => {
				enqueueSnackbar(t("Bir hata ile karşılaşıldı"), { variant: "error" });
			});
	};

	const WorkingStatusCard = ({ icon, title, text, value }) => (
		<Grid container sx={{ borderRadius: 1, border: "1px solid #CFD2FA", marginTop: 2, minHeight: "100px" }}>
			<Grid item xs={2} sx={{ alignSelf: "center" }}>
				<Box component="img" src={icon} sx={{ ml: 3, width: 25, height: 25 }} />
			</Grid>
			<Grid item xs={9}>
				<Typography variant="h6" sx={{ mt: 2, color: (theme) => theme.palette.primary.main }}>
					{title}
				</Typography>
				<Typography sx={{ mt: 1, fontSize: "14px" }}>{text} </Typography>
			</Grid>
			<Grid item xs={1} sx={{ alignSelf: "center" }}>
				<Radio
					checked={value.toLowerCase() === status.toLowerCase()}
					value={value}
					onChange={() => {
						setStatus(value);
					}}
				/>
			</Grid>
		</Grid>
	);

	const RobotStatusRadioLabel = ({ icon, title }) => (
		<Grid container spacing={1} sx={{ maxWidth: 200 }}>
			<Grid item sx={{ alignSelf: "center" }}>
				<Box component="img" src={icon} />
			</Grid>
			<Grid item>
				<Typography sx={{ pt: 1 }}>{title}</Typography>
			</Grid>
		</Grid>
	);

	return (
		<>
			<DialogContent sx={{ paddingTop: "10vh !important" }} {...contentProps}>
				<Grid container spacing={2} direction="column" alignItems="center" justifyContent="center">
					<Grid item xs={12}>
						<Typography variant="h5">{t("expert_panel_market_status_settings_main_title")}</Typography>
					</Grid>

					<Grid item xs={12}>
						<Typography variant="p">{t("expert_panel_market_status_settings_main_text")}</Typography>
					</Grid>

					<Grid item xs={12}>
						<WorkingStatusCard
							icon={run}
							title={t("expert_panel_market_status_settings_run_title")}
							text={t("expert_panel_market_status_settings_run_text")}
							value={"ACCEPTED"}
						></WorkingStatusCard>
						<WorkingStatusCard
							icon={trace}
							title={t("expert_panel_market_status_settings_trace_title")}
							text={t("expert_panel_market_status_settings_trace_text")}
							value={"MAINTENANCE"}
						></WorkingStatusCard>
					</Grid>
				</Grid>
				<Grid container spacing={2} sx={{ paddingTop: "3vh" }}>
					<Grid item xs={12}>
						<Button
							fullWidth
							variant="contained"
							onClick={() => {
								changeRobotStatus();
							}}
						>
							{t("expert_panel_market_strategy_settings_next_button_text")}
						</Button>
					</Grid>
				</Grid>
			</DialogContent>
		</>
	);
};

export default Status;
