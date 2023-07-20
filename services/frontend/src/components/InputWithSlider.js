import React, { useState } from "react";

import { Grid } from "@mui/material";

import Slider from "./Slider";
import TextField from "./TextField";

const InputWithSlider = ({ label, marksDecimal, min, max, step, value, disabled, onSliderChange, onTextChange }) => {
	const [updateKey, setUpdateKey] = useState(Date.now());

	return (
		<Grid container spacing={3}>
			<Grid item xs>
				<Slider
					key={updateKey}
					disabled={disabled}
					label={label}
					step={step}
					min={min}
					max={max}
					valueLabelDisplay="auto"
					marks={marksDecimal}
					value={value}
					onChange={onSliderChange}
				/>
			</Grid>
			<Grid item>
				<TextField
					sx={{ color: (theme) => theme.palette.primary.main, mt: 2, width: "120px" }}
					value={value ?? ""}
					disabled={disabled}
					type="number"
					inputProps={{ min, max, step, style: { paddingLeft: "22px" } }} // the change is here
					onChange={(e) => {
						setUpdateKey(Date.now());
						onTextChange(e);
					}}
				/>
			</Grid>
		</Grid>
	);
};

export default InputWithSlider;
