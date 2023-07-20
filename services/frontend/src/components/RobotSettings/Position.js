import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { Button, DialogContent, FormControlLabel, Grid, Radio, RadioGroup, Typography } from "@mui/material";

import { useSnackbar } from "notistack";

import { InputWithSlider } from "components";

import { useStrategyApi } from "api/strategy";

import { setStrategies } from "actions/StrategyActions";

import { useFetchAuthorized } from "services";
import Config from "services/config";

import { RobotContext } from "./RobotDialog";
import { POSITION, SUCCESS } from "./utils/constant";

const marksDecimal = [
	{
		value: 0,
		label: "0.0",
	},
	{
		value: 100,
		label: "100.0",
	},
];

const Position = ({ strategyName, contentProps, selectedStrategy, setSelectedStrategy }) => {
	const {
		backButton,
		setBackButton,
		setSelection,
		setSuccessMessage,
		selectedStrategyFollower,
		setSelectedStrategyFollower,
	} = useContext(RobotContext);

	const { strategies } = useSelector((state) => state.strategy);
	const [positionSettings, setPositionSettings] = useState(selectedStrategyFollower?.positionSettings ?? {});
	const [reflect, setReflect] = useState(selectedStrategyFollower?.reflect ?? true);

	const fetchAuthorized = useFetchAuthorized();
	const dispatch = useDispatch();
	const { t } = useTranslation();
	const { enqueueSnackbar } = useSnackbar();
	const { getFollowedStrategies } = useStrategyApi();

	const validate = () => {
		const { startsAt, followDistance } = positionSettings?.trailingStop?.steps?.[0] ?? {};

		if (!Number(startsAt) && Number(followDistance)) {
			enqueueSnackbar(t("error.If follow distance has been set but trailing stop set as zero after"), {
				variant: "error",
			});
			return false;
		}

		if (Number(startsAt) && !Number(followDistance)) {
			enqueueSnackbar(t("error.If trailing stop is enabled, follow distance can not be 0"), {
				variant: "error",
			});
			return false;
		}

		return true;
	};

	const changePage = () => {
		if (!validate()) {
			return;
		}

		setBackButton({
			to: POSITION,
			label: "Position Settings",
		});
	};

	const setExpertSettings = () => {
		setPositionSettings(selectedStrategyFollower?.strategy?.tradeSettings);
	};

	const updatePositionSettings = () => {
		fetchAuthorized(
			`${Config.apiRoot()}/strategy/strategy/${selectedStrategyFollower.strategy.id}/followed/position-settings`,
			{
				headers: {
					"Content-type": "application/json",
				},
				method: "PATCH",
				body: JSON.stringify({ positionSettings, reflect }),
			}
		)
			.then((data) => data.json())
			.then((_) => {
				dispatch(
					setStrategies(
						strategies?.map((item) =>
							item.strategy.id === selectedStrategyFollower.strategy.id
								? { ...item, positionSettings }
								: item
						)
					)
				);

				setSelectedStrategyFollower({ ...selectedStrategyFollower, positionSettings });

				setSuccessMessage({
					title: "Bot Status settings saved successfully",
					subtitle:
						"Also you can revert to the expert's settings at any time, for this the default button is waiting for you.",
				});

				setSelection(SUCCESS);
			})
			.catch((err) => {
				console.log(err);
				enqueueSnackbar(t("Bir hata ile karşılaşıldı"), { variant: "error" });
			});
	};

	const handleChange = (key, value, valueField) => {
		setPositionSettings({
			...positionSettings,
			[key]: {
				...positionSettings?.[key],
				by: "PERCENT",
				steps: [
					{
						...positionSettings?.[key]?.steps?.[0],
						...(valueField ? { [valueField]: value } : { value }),
					},
				],
				...(valueField !== "followDistance" && { enabled: Boolean(Number(value)) }),
			},
		});
	};

	const handleChangeRadio = (event) => {
		setReflect(event.target.value);
	};

	return (
		<DialogContent sx={{ paddingTop: "10vh !important" }} {...contentProps}>
			<Grid container spacing={2} direction="column" alignItems="center" justifyContent="center">
				<Grid item xs={12}>
					<Typography variant="h5">
						{backButton.to === POSITION
							? t("control_panel_robot_settings_position_settings_customize_main_title")
							: t("control_panel_robot_settings_position_settings_title")}
					</Typography>
				</Grid>
				<Grid item xs={12}>
					{strategyName}
				</Grid>
				<Grid item xs={12}>
					<Typography variant="p">
						{t(
							backButton.to === POSITION
								? "control_panel_robot_settings_position_settings_customize_main_text"
								: "control_panel_robot_settings_position_settings_text",
							{
								name:
									selectedStrategyFollower?.strategy?.marketStrategy?.name ??
									selectedStrategyFollower?.strategy?.name,
							}
						)}
					</Typography>
				</Grid>
			</Grid>
			{backButton.to !== POSITION ? (
				<Grid container sx={{ mt: 3 }} rowSpacing={4}>
					<Grid item xs={12}>
						<InputWithSlider
							label={t("control_panel_robot_settings_position_settings_sl_title")}
							step={0.1}
							min={0.0}
							max={positionSettings?.stopLoss?.steps?.[0]?.amount}
							valueLabelDisplay="auto"
							value={positionSettings?.stopLoss?.steps?.[0]?.value}
							marks={marksDecimal}
							onSliderChange={(_, value) => handleChange("stopLoss", value)}
							onTextChange={(e) => {
								const { value } = e.target;

								handleChange("stopLoss", value);
							}}
						/>
					</Grid>
					<Grid item xs={12}>
						<InputWithSlider
							label={t("control_panel_robot_settings_position_settings_tp_title")}
							step={0.1}
							min={0.0}
							max={positionSettings?.takeProfit?.steps?.[0]?.amount ?? 100.0}
							valueLabelDisplay="auto"
							marks={marksDecimal}
							value={positionSettings?.takeProfit?.steps?.[0]?.value ?? 0}
							onSliderChange={(_, value) => handleChange("takeProfit", value)}
							onTextChange={(e) => {
								const { value } = e.target;

								handleChange("takeProfit", value);
							}}
						/>
					</Grid>
					<Grid item xs={12}>
						<InputWithSlider
							label={t("control_panel_robot_settings_position_settings_ts_title")}
							step={0.1}
							min={0.0}
							max={positionSettings?.trailingStop?.steps?.[0]?.amount ?? 100.0}
							valueLabelDisplay="auto"
							marks={marksDecimal}
							value={positionSettings?.trailingStop?.steps?.[0]?.startsAt ?? 0}
							onSliderChange={(_, value) => handleChange("trailingStop", value, "startsAt")}
							onTextChange={(e) => {
								const { value } = e.target;

								handleChange("trailingStop", value, "startsAt");
							}}
						/>
					</Grid>
					<Grid item xs={12}>
						<InputWithSlider
							label={t("control_panel_robot_settings_position_settings_fw_title")}
							step={0.1}
							min={0.0}
							max={positionSettings?.trailingStop?.steps?.[0]?.amount ?? 100.0}
							valueLabelDisplay="auto"
							marks={marksDecimal}
							value={positionSettings?.trailingStop?.steps?.[0]?.followDistance ?? 0}
							onSliderChange={(_, value) => handleChange("trailingStop", value, "followDistance")}
							onTextChange={(e) => {
								const { value } = e.target;

								handleChange("trailingStop", value, "followDistance");
							}}
						/>
					</Grid>
				</Grid>
			) : (
				<>
					<Typography
						sx={{
							color: (theme) => theme.palette.primary.main,
							fontSize: "16px",
							mr: 2,
							mt: "2rem",
							mb: "0.5rem",
							alignSelf: "start",
						}}
					>
						{t("control_panel_robot_settings_position_settings_customize_disclaimer_title")}
					</Typography>

					<RadioGroup value={reflect} onChange={handleChangeRadio}>
						<FormControlLabel
							value={true}
							control={<Radio />}
							label={
								<>
									<span style={{ fontWeight: "bold" }}>
										{t(
											"control_panel_robot_settings_position_settings_customize_disclaimer_text_creator_start"
										)}
									</span>
									<span>
										{t(
											"control_panel_robot_settings_position_settings_customize_disclaimer_text_creator"
										)}
									</span>
								</>
							}
						/>
						<FormControlLabel
							sx={{ mt: "0.6rem" }}
							value={false}
							control={<Radio />}
							label={
								<>
									<span style={{ fontWeight: "bold" }}>
										{t(
											"control_panel_robot_settings_position_settings_customize_disclaimer_text_own_start"
										)}
									</span>
									<span>
										{t(
											"control_panel_robot_settings_position_settings_customize_disclaimer_text_own"
										)}
									</span>
								</>
							}
						/>
					</RadioGroup>
				</>
			)}
			<Grid container spacing={2} sx={{ paddingTop: "3vh" }}>
				{backButton.to !== POSITION && (
					<Grid item xs={12}>
						<Button
							fullWidth
							variant="outlined"
							onClick={() => {
								setExpertSettings();
							}}
						>
							{t("control_panel_robot_settings_position_settings_expert_button_title")}
						</Button>
					</Grid>
				)}
				<Grid item xs={12}>
					<Button
						fullWidth
						variant="contained"
						onClick={() => {
							backButton.to !== POSITION && selectedStrategyFollower?.strategy?.marketStrategy
								? changePage()
								: updatePositionSettings();
						}}
					>
						{backButton.to === POSITION
							? t("control_panel_robot_settings_position_settings_customize_disclaimer_confirm_button")
							: t("control_panel_robot_settings_status_button_save")}
					</Button>
				</Grid>
			</Grid>
		</DialogContent>
	);
};

export default Position;
