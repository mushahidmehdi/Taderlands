import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { Box, Button, DialogContent, Divider, Grid, Icon, List, ListItem, Paper, Typography } from "@mui/material";

import { useSnackbar } from "notistack";

import { setStrategies } from "actions/StrategyActions";

import { useFetchAuthorized } from "services";
import Config from "services/config";

import { Follower, Uri } from "images";

import { RobotContext } from "./RobotDialog";
import { SUCCESS } from "./utils/constant";

const Unfollow = ({ contentProps }) => {
	const { setSelection, setSuccessMessage, selectedStrategyFollower, setSelectedStrategyFollower } =
		useContext(RobotContext);
	const { strategies } = useSelector((state) => state.strategy);

	const { t } = useTranslation();
	const { enqueueSnackbar } = useSnackbar();
	const fetchAuthorized = useFetchAuthorized();
	const dispatch = useDispatch();

	const unfollowStrategy = () => {
		fetchAuthorized(`${Config.apiRoot()}/strategy/strategy-followers/${selectedStrategyFollower?.strategy.id}`, {
			headers: {
				"Content-type": "application/json",
			},
			method: "PUT",
			body: JSON.stringify({
				status: "UNFOLLOWED",
			}),
		})
			.then((data) => data.json())
			.then((_) => {
				dispatch(
					setStrategies(
						strategies?.map((item) =>
							item.strategy.id === selectedStrategyFollower?.strategy.id
								? { ...item, status: "UNFOLLOWED" }
								: item
						)
					)
				);

				setSelectedStrategyFollower({ ...selectedStrategyFollower, status: "UNFOLLOWED" });

				setSuccessMessage({
					title: t("control_panel_robots_robot_settings_unfollow_flow_success_title"),
					subtitle: t("control_panel_robots_robot_settings_unfollow_flow_success_text"),
				});

				setSelection(SUCCESS);
			})
			.catch((err) => {
				enqueueSnackbar(t("Bir hata ile karşılaşıldı"), { variant: "error" });
			});
	};

	return (
		<DialogContent sx={{ paddingTop: "10vh !important" }} {...contentProps}>
			<Grid container spacing={2} direction="column" alignItems="center" justifyContent="center">
				<Grid item xs={12}>
					<Typography fontWeight={"bold"} sx={{ fontSize: "24px", textAlign: "center" }}>
						{t("control_panel_robots_robot_settings_unfollow_flow_title")}
					</Typography>
				</Grid>
				<Grid item xs={12}>
					<Typography sx={{ fontSize: "14px", textAlign: "center" }}>
						{t("control_panel_robots_robot_settings_unfollow_flow_text")}
					</Typography>
				</Grid>
				<Grid item xs={12}>
					<Paper
						sx={{
							mt: 2,
							backgroundColor: (theme) => theme.palette.info.light,
							padding: 5,
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
						}}
					>
						<Typography fontWeight={"bold"} sx={{ mt: 2, textAlign: "center", fontSize: "14px" }}>
							{selectedStrategyFollower?.strategy?.marketStrategy?.name ??
								selectedStrategyFollower?.strategy?.name}
						</Typography>

						<Box
							sx={{
								display: "flex",
								flexDirection: "row",
								alignItems: "center",
								justifyContent: "center",
								mt: 2,
							}}
						>
							<Icon color="primary" sx={{ width: 40, height: 35, backgroundColor: "white" }}>
								<Uri active={true} width={"20"} height={"20"} />
							</Icon>
							<Divider
								sx={{
									width: "30px",
									mr: "20px",
									ml: "20px",
									color: (theme) => theme.palette.info.dark,
								}}
							/>
							<Icon color="primary" sx={{ width: 40, height: 35, backgroundColor: "white" }}>
								<Follower width={"20"} height={"20"} />
							</Icon>
						</Box>

						<Typography
							fontWeight={"bold"}
							sx={{
								mt: 2,
								textAlign: "center",
								fontSize: "16px",
								color: (theme) => theme.palette.primary.main,
							}}
						>
							{t("control_panel_robots_robot_settings_unfollow_flow_warning_title")}
						</Typography>

						<List
							sx={{
								pl: 1,
								"& .MuiListItem-root": {
									display: "list-item",
								},
								listStyleType: "disc",

								fontSize: "14px",
							}}
						>
							<ListItem>{t("control_panel_robots_robot_settings_unfollow_flow_warning_text_1")}</ListItem>
							<ListItem>{t("control_panel_robots_robot_settings_unfollow_flow_warning_text_2")}</ListItem>
						</List>
					</Paper>
				</Grid>
			</Grid>
			<Grid container spacing={2} sx={{ paddingTop: "3vh" }}>
				<Grid item xs={12}>
					<Button fullWidth variant="contained" onClick={unfollowStrategy}>
						{t("control_panel_robot_settings_status_button_save")}
					</Button>
				</Grid>
			</Grid>
		</DialogContent>
	);
};

export default Unfollow;
