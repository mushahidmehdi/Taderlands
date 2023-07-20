import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";

import { Button, Grid, Typography } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import dayjs from "dayjs";
import { omit } from "lodash";
import { useSnackbar } from "notistack";

import { KEYS } from "scenes/strategyBuilder/settings/constants";
import { RuleDesignContext } from "scenes/strategyBuilder/settings/design/RuleDesign";
import { RuleGroupContext } from "scenes/strategyBuilder/settings/design/group/RuleGroup";
import { RuleContext } from "scenes/strategyBuilder/settings/design/rule/Rule";

import { Dialog, Select, TextField } from "components";

import { changeRule } from "actions/StrategyBuilderActions";

import { RuleIndicatorContext } from "../Indicator";

export default function ParametersDialog({ open, onClose, indicator, value }) {
	const { groupIndex } = useContext(RuleGroupContext);
	const { index } = useContext(RuleContext);
	const { type } = useContext(RuleDesignContext);
	const { indicatorType } = useContext(RuleIndicatorContext);

	const [parameters, setParameters] = useState(value);
	const [error, setError] = useState();

	const { enqueueSnackbar } = useSnackbar();
	const dispatch = useDispatch();
	const { t, i18n } = useTranslation("workshop");

	// indicator.parameters is an array, e.g.

	// [
	// 	{
	// 		"name": "length",
	// 		"def_value": 14,
	// 		"max_value": 50,
	// 		"min_value": 1,
	// 		"input_type": "integer"
	// 	}
	// ]

	// parameterLookup is a lookup table built from this array, e.g.

	// {
	// 	"length": {
	// 		"def_value": 14,
	// 		"max_value": 50,
	// 		"min_value": 1,
	// 		"input_type": "integer"
	// 	}
	// }

	const parameterLookup = indicator.parameters.reduce((acc, curr) => {
		const { name, ...rest } = curr;

		acc[name] = rest;

		return acc;
	}, {});

	const validate = () => {
		let errCount = 0;

		let err = Object.keys(parameters)
			.filter((x) => x !== "applyTo")
			.reduce((acc, curr) => {
				if (parameters[curr] === null || parameters[curr] === undefined) {
					acc[curr] = t("error.This field should not be empty");
					errCount++;
					return acc;
				}

				if (
					parameters[curr] < parameterLookup[curr].min_value ||
					parameters[curr] > parameterLookup[curr].max_value
				) {
					acc[curr] = t("error.This field's value is not between minimum and maximum value");
					errCount++;
					return acc;
				}

				if (parameterLookup[curr].input_type === "datetime" && dayjs(parameters[curr]).minute() % 5 !== 0) {
					acc[curr] = t("This field's minute value should within 5 minute periods");
					errCount++;
					return acc;
				}

				return acc;
			}, {});

		setError(err);

		return errCount ? t("common:One or more field is not valid") : null;
	};

	const handleSaveParameters = (value) => {
		const validationResult = validate();

		if (validationResult) {
			enqueueSnackbar(validationResult ?? t("Bir hata ile karşılaşıldı"), { variant: "error" });
			return;
		}

		dispatch(
			changeRule({
				type,
				groupIndex,
				index,
				key: indicatorType === "LEFT" ? KEYS.LEFT_PARAMS : KEYS.RIGHT_PARAMS,
				value,
			})
		);

		onClose();
	};

	return (
		<Dialog
			dialogProps={{ open: open, onClose: onClose }}
			title={indicator?.translation?.[i18n.resolvedLanguage]}
			action={
				<Grid container>
					<Grid item xs={1}></Grid>
					<Grid item xs={10} sx={{ p: 1 }}>
						<Button
							variant="contained"
							fullWidth
							onClick={(_) => {
								handleSaveParameters(parameters);
							}}
						>
							{t("common:Save")}
						</Button>
					</Grid>
					<Grid item xs={1}></Grid>
					<Grid item xs={1}></Grid>
					<Grid item xs={10} sx={{ p: 1 }}>
						<Button
							variant="outlined"
							fullWidth
							onClick={(e) => {
								setParameters(
									indicator.parameters?.reduce((acc, curr) => {
										acc[curr.name] = curr.def_value ?? curr.min_value;
										return acc;
									}, {})
								);

								setError();
							}}
						>
							{t("common:Reset")}
						</Button>
					</Grid>
				</Grid>
			}
			content={
				<Grid container sx={{ width: 500 }}>
					{indicator?.parameters?.map((parameter) => (
						<>
							{["integer", "decimal"].some((x) => x === parameter.input_type) && (
								<Grid item xs={12} sx={{ mt: 1 }}>
									<TextField
										error={error?.[parameter.name]}
										helperText={t("workshop_tl_strategy_page_indicator_parameter_helper_text", {
											default: parameter.def_value,
											max: parameter.max_value,
											min: parameter.min_value,
										})}
										fullWidth
										size="small"
										label={parameter.name}
										type="number"
										inputProps={{
											min: parameter.min_value,
											max: parameter.max_value,
											...(parameter.input_type === "decimal" && { step: "0.1" }),
										}}
										value={parameters[parameter.name]}
										onChange={(e) => {
											setParameters({
												...parameters,
												[parameter.name]: e.target.value
													? parameter.input_type === "decimal"
														? parseFloat(e.target.value)
														: parseInt(e.target.value)
													: null,
											});

											setError(omit(error, [parameter.name]));
										}}
									></TextField>
								</Grid>
							)}
							{(parameter.input_type === "list" || parameter.input_type === "week_time") && (
								<Grid item xs={12} sx={{ mt: 1 }}>
									<Select
										label={parameter.name}
										value={parameters[parameter.name]}
										onChange={(e) => {
											setParameters({
												...parameters,
												[parameter.name]: e.target.value,
											});

											setError(omit(error, [parameter.name]));
										}}
										options={parameter.available_inputs?.map((option) => ({
											value: option,
											content: <Typography>{option}</Typography>,
										}))}
									/>
								</Grid>
							)}
							{parameter.input_type === "datetime" && (
								<Grid item xs={12} sx={{ mt: 1 }}>
									<Typography color="primary">{parameter.name}</Typography>
									<LocalizationProvider dateAdapter={AdapterDayjs}>
										<DateTimePicker
											value={dayjs(parameters[parameter.name])}
											onChange={(value) => {
												setParameters({
													...parameters,
													[parameter.name]: value?.unix() * 1000,
												});
											}}
											shouldDisableTime={(value, view) =>
												view === "minutes" && value.minute() % 5 !== 0
											}
											slotProps={{
												textField: {
													fullWidth: true,
												},
											}}
											sx={{
												"& .MuiOutlinedInput-notchedOutline": {
													borderRadius: "8px",
													borderColor: (theme) => theme.palette.primary.main,
												},
											}}
										/>
									</LocalizationProvider>
								</Grid>
							)}
						</>
					))}
				</Grid>
			}
		></Dialog>
	);
}
