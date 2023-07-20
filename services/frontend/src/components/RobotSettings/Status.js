import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import {
	Box,
	Button,
	DialogContent,
	FormControl,
	FormControlLabel,
	Grid,
	Radio,
	RadioGroup,
	Typography,
} from "@mui/material";

import { useSnackbar } from "notistack";

import { setStrategies } from "actions/StrategyActions";

import { useFetchAuthorized } from "services";
import Config from "services/config";

import { bolt, stop, trace, uri, virtual as virtualIcon } from "images";

import { RobotContext } from "./RobotDialog";
import { SUCCESS } from "./utils/constant";

const Status = ({ strategyName, contentProps, selectedStrategy, setSelectedStrategy }) => {
	const { setSelection, setSuccessMessage, selectedStrategyFollower, setSelectedStrategyFollower } =
		useContext(RobotContext);
	const { strategy, virtual: initialVirtual, status: initialStatus } = selectedStrategyFollower;
	const { strategies } = useSelector((state) => state.strategy);

	const [status, setStatus] = useState(initialStatus ?? "");
	const [virtual, setVirtual] = useState(initialVirtual ?? false);

	const fetchAuthorized = useFetchAuthorized();
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const { enqueueSnackbar } = useSnackbar();

	const changeRobotStatus = () => {
		fetchAuthorized(`${Config.apiRoot()}/strategy/strategy-followers/${strategy.id}`, {
			headers: {
				"Content-type": "application/json",
			},
			method: "PUT",
			body: JSON.stringify({
				status,
				virtual,
			}),
		})
			.then((data) => data.json())
			.then((_) => {
				dispatch(
					setStrategies(
						strategies?.map((item) =>
							item.strategy.id === strategy.id
								? {
										...item,
										status,
										virtual,
								  }
								: item
						)
					)
				);

				setSelectedStrategyFollower({ ...selectedStrategyFollower, status, virtual });

				setSuccessMessage({
					title: "Bot Status settings saved successfully",
					subtitle:
						"Also you can revert to the expert's settings at any time, for this the default button is waiting for you.",
				});

				setSelection(SUCCESS);
			})
			.catch((err) => {
				enqueueSnackbar(t("Bir hata ile karşılaşıldı"), { variant: "error" });
			});
	};

	const WorkingStatusCard = ({ icon, title, text, value }) => (
		<Grid container sx={{ borderRadius: 1, border: "1px solid #CFD2FA", marginTop: 2 }}>
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
					checked={value.toLowerCase() == status.toLowerCase()}
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
						<Typography variant="h5">{t("control_panel_robot_settings_status_title")}</Typography>
					</Grid>
					<Grid item xs={12}>
						{strategyName}
					</Grid>
					<Grid item xs={12}>
						<Typography variant="p">
							{!selectedStrategy?.public
								? t("control_panel_robot_settings_status_text", {
										name: strategy?.marketStrategy?.name ?? strategy?.name,
								  })
								: t("control_panel_robot_settings_status_text_small", {
										name: strategy?.marketStrategy?.name ?? strategy?.name,
								  })}
						</Typography>
					</Grid>
					{!strategy?.public && (
						<Grid container item xs={12} justifyContent="flex-start" direction="row" alignItems="left">
							<FormControl fullWidth>
								<Typography sx={{ fontSize: 16, mb: 1, color: (theme) => theme.palette.primary.main }}>
									{t("control_panel_robot_settings_status_page_sub_title")}
								</Typography>
								<RadioGroup
									row
									sx={{ paddingLeft: 0.5, marginTop: 1, flexWrap: "nowrap !important" }}
									value={String(virtual)}
									onChange={(_, value) => {
										setVirtual(value === "true");
									}}
								>
									<FormControlLabel
										sx={{ mr: 4 }}
										value={false}
										control={<Radio sx={{ padding: 0.5 }} />}
										label={
											<RobotStatusRadioLabel
												icon={uri}
												title={t("control_panel_robot_settings_status_page_real_trade_title")}
											/>
										}
									/>
									<FormControlLabel
										value={true}
										control={<Radio sx={{ padding: 0.5 }} />}
										label={
											<RobotStatusRadioLabel
												icon={virtualIcon}
												title={t(
													"control_panel_robot_settings_status_page_virtual_trade_title"
												)}
											/>
										}
									/>
								</RadioGroup>
							</FormControl>
						</Grid>
					)}
					<Grid item xs={12}>
						<WorkingStatusCard
							icon={bolt}
							title={t("control_panel_robot_settings_status_page_run_title")}
							text={t("control_panel_robot_settings_status_page_run_text")}
							value={"ON"}
						></WorkingStatusCard>
						<WorkingStatusCard
							icon={trace}
							title={t("control_panel_robot_settings_status_page_trace_title")}
							text={t("control_panel_robot_settings_status_page_trace_text")}
							value={"STANDBY"}
						></WorkingStatusCard>
						<WorkingStatusCard
							icon={stop}
							title={t("control_panel_robot_settings_status_page_stop_title")}
							text={t("control_panel_robot_settings_status_page_stop_text")}
							value={"OFF"}
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
							{t("control_panel_robot_settings_status_button_save")}
						</Button>
					</Grid>
				</Grid>
			</DialogContent>
		</>
	);
};

export default Status;
