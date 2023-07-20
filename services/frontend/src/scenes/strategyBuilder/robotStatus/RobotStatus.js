import { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { Box, FormControl, FormControlLabel, Grid, Paper, Radio, RadioGroup, Typography } from "@mui/material";

import { pick } from "lodash";
import { useSnackbar } from "notistack";

import { setFollower } from "actions/StrategyBuilderActions";

import { Config, useFetchAuthorized } from "services";

import { bolt, stop, trace, uri, virtual } from "images";

import { StrategyBuilderContext } from "../StrategyBuilder";

export default function RobotStatus() {
	const { strategy, follower } = useSelector((state) => state.strategyBuilder);
	const { statusMap, status, setStatus } = useContext(StrategyBuilderContext);

	const dispatch = useDispatch();
	const fetchAuthorized = useFetchAuthorized();
	const { t } = useTranslation("workshop");
	const { enqueueSnackbar } = useSnackbar();

	const validate = () => {
		if (!follower?.status) {
			enqueueSnackbar(t("error.Status should not be empty"), { variant: "error" });
			setStatus();
			return;
		}

		if (typeof follower?.virtual === "undefined" || typeof follower?.virtual === "null") {
			enqueueSnackbar(t("error.Virtual should not be empty"), { variant: "error" });
			setStatus();
			return;
		}

		return true;
	};

	useEffect(() => {
		if (["continue", "save"].some((x) => x === status)) {
			if (!validate()) {
				return;
			}

			(follower?.strategyId
				? fetchAuthorized(`${Config.apiRoot()}/strategy/strategy-followers/${strategy?.id}`, {
						headers: {
							"Content-type": "application/json",
						},
						method: "PUT",
						body: JSON.stringify(pick(follower, ["status", "virtual"])),
				  })
				: fetchAuthorized(`${Config.apiRoot()}/strategy/strategy-follower`, {
						headers: {
							"Content-type": "application/json",
						},
						method: "POST",
						body: JSON.stringify({ ...follower, strategyId: strategy?.id }),
				  })
			)
				.then((data) => data.json())
				.then((data) => {
					enqueueSnackbar(t("All information saved successfully"), { variant: "success" });

					dispatch(setFollower({ ...follower, strategyId: strategy?.id }));

					setStatus(statusMap[status]);
				})
				.catch((_) => {
					enqueueSnackbar(t("error.An error occurred"), { variant: "error" });
					setStatus();
				});
		}
	}, [status]);

	const RobotStatusRadioLabel = ({ icon, title }) => (
		<Grid container sx={{ width: 250 }}>
			<Grid item xs={3} sx={{ alignSelf: "center" }}>
				<Box component="img" src={icon} />
			</Grid>
			<Grid item xs={9}>
				<Grid container>
					<Grid item xs={12}>
						<Typography>{title}</Typography>
					</Grid>
				</Grid>
			</Grid>
		</Grid>
	);

	const WorkingStatusCard = ({ icon, title, text, value }) => (
		<Paper sx={{ mt: 2, backgroundColor: follower?.status === value ? "#F4F5FC" : "#FFFFFF" }} variant="outlined">
			<Grid container>
				<Grid item xs={2} sx={{ alignSelf: "center" }}>
					<Box component="img" src={icon} sx={{ ml: 3, width: 25 }} />
				</Grid>
				<Grid item xs={9}>
					<Typography variant="h6" sx={{ mt: 2 }}>
						{title}
					</Typography>
					<Typography sx={{ mt: 1, fontSize: "14px" }}>{text} </Typography>
				</Grid>
				<Grid item xs={1} sx={{ alignSelf: "center" }}>
					<Radio
						checked={follower?.status === value}
						value={value}
						onChange={(e) => dispatch(setFollower({ ...follower, status: value }))}
					/>
				</Grid>
			</Grid>
		</Paper>
	);

	return (
		<Paper sx={{ padding: "24px", marginBottom: "16px" }}>
			<Typography sx={{ fontSize: "24px", fontWeight: 700, marginBottom: "8px" }}>
				{t("workshop_robot_status_main_title")}
			</Typography>
			<Typography variant="p" sx={{ color: "#3A3A3A", fontSize: "14px" }}>
				{t("workshop_robot_status_main_text")}
			</Typography>
			<Grid container sx={{ mt: "10px" }}>
				<Grid item xs={12}>
					<FormControl>
						<Typography sx={{ fontSize: "20px" }}>
							{t("workshop:workshop_robot_status_main_title")}
						</Typography>
						<RadioGroup
							row
							sx={{ paddingLeft: 0.5, marginTop: 1 }}
							value={String(follower?.virtual)}
							onChange={(_, value) => {
								dispatch(setFollower({ ...follower, virtual: value === "true" }));
							}}
						>
							<FormControlLabel
								value={false}
								control={<Radio sx={{ padding: 0.5 }} />}
								label={
									<RobotStatusRadioLabel
										icon={uri}
										title={t("workshop:workshop_robot_status_choose_option_1")}
									/>
								}
							/>
							<FormControlLabel
								value={true}
								control={<Radio sx={{ padding: 0.5 }} />}
								label={
									<RobotStatusRadioLabel
										icon={virtual}
										title={t("workshop:workshop_robot_status_choose_option_2")}
									/>
								}
							/>
						</RadioGroup>
					</FormControl>
				</Grid>
				<Grid item xs={8}>
					<Typography component="h6" variant="h6" sx={{ mt: 2 }}>
						{t("workshop:workshop_robot_working_status_choose_title")}
					</Typography>
				</Grid>
				<Grid item xs={10}>
					<WorkingStatusCard
						icon={bolt}
						title={t("workshop:workshop_robot_working_status_option_1_title")}
						text={t("workshop:workshop_robot_working_status_option_1_text")}
						value={"ON"}
					></WorkingStatusCard>
					<WorkingStatusCard
						icon={trace}
						title={t("workshop:workshop_robot_working_status_option_2_title")}
						text={t("workshop:workshop_robot_working_status_option_2_text")}
						value={"STANDBY"}
					></WorkingStatusCard>
					<WorkingStatusCard
						icon={stop}
						title={t("workshop:workshop_robot_working_status_option_3_title")}
						text={t("workshop:workshop_robot_working_status_option_3_text")}
						value={"OFF"}
					></WorkingStatusCard>
				</Grid>
			</Grid>
		</Paper>
	);
}
