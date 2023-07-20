import React from "react";

import { Grid, Slider as MuiSlider, SliderThumb, Typography } from "@mui/material";

import { slideIcon } from "images";

function ThumbComponent(props) {
	const { children, ...other } = props;
	return (
		<SliderThumb {...other} sx={{ mt: "2px" }}>
			{children}
			<span>
				<img src={slideIcon} alt="" />
			</span>
		</SliderThumb>
	);
}

export default function Slider({ label, step, min, max, marks, value, onChange, labelProps, containerProps, ...rest }) {
	return (
		<Grid container spacing={1} {...containerProps}>
			{label && (
				<>
					<Grid item xs={10}>
						<Typography
							component="span"
							sx={{ color: (theme) => theme.palette.primary.main }}
							{...labelProps}
						>
							{label}
						</Typography>
					</Grid>
					<Grid item xs={2} sx={{ textAlign: "right" }}>
						<Typography
							component="span"
							sx={{ color: (theme) => theme.palette.primary.main }}
							{...labelProps}
						>
							{value}
						</Typography>
					</Grid>
				</>
			)}
			<Grid item xs={12}>
				<MuiSlider
					{...rest}
					components={{ Thumb: ThumbComponent }}
					step={step}
					min={min}
					max={max}
					valueLabelDisplay="auto"
					marks={marks}
					value={value}
					onChange={onChange}
					size="small"
					sx={{
						...rest?.sx,
						"& .MuiSlider-markLabel[data-index='0']": {
							left: "12px !important",
						},
						"& .MuiSlider-markLabel[data-index='1']": {
							left: "calc(100% - 12px) !important",
						},
					}}
				/>
			</Grid>
		</Grid>
	);
}
