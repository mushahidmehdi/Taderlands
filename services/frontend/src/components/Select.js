import { useTranslation } from "react-i18next";

import { FormControl, Grid, ListSubheader, MenuItem, Select as MuiSelect, Typography } from "@mui/material";

import { ArrowDown } from "images";

export default function Select({
	label,
	value,
	IconComponent,
	onChange,
	options,
	containerProps,
	formControlProps,
	selectProps,
	labelProps,
	grouped,
}) {
	const { t } = useTranslation("common");

	const renderGroupedOptions = (item) => {
		const itemOptions = item.options.map((option) => (
			<MenuItem
				key={item.type + option.value}
				value={`${item?.type},${option.value}`}
				sx={{ paddingLeft: "28px" }}
			>
				{option.content}
			</MenuItem>
		));

		return [<ListSubheader>{t(item.type)}</ListSubheader>, ...itemOptions];
	};

	return (
		<Grid container rowSpacing={0.85} {...containerProps}>
			{label && (
				<Grid item xs={12}>
					<div style={{ ...(labelProps?.sx?.textAlign === "center" && { textAlign: "center" }) }}>
						<Typography
							{...labelProps}
							component="span"
							sx={{ color: (theme) => theme.palette.primary.main, ...labelProps?.sx }}
						>
							{label}
						</Typography>
					</div>
				</Grid>
			)}

			<Grid item xs={12}>
				<FormControl
					variant="standard"
					{...formControlProps}
					sx={{
						"& .MuiOutlinedInput-root": {
							borderRadius: "8px",
						},
						...formControlProps?.sx,
					}}
				>
					<MuiSelect
						labelId="demo-multiple-checkbox-label"
						id="demo-multiple-checkbox"
						value={value}
						onChange={onChange}
						margin="dense"
						variant="outlined"
						renderValue={(p) => p}
						IconComponent={IconComponent ?? ArrowDown}
						{...selectProps}
						sx={{
							backgroundColor: "white",
							"& .MuiOutlinedInput-notchedOutline": {
								borderColor: (theme) => theme.palette.primary.main,
							},
							"& .MuiSelect-iconOutlined": {
								marginTop: "4px",
								marginRight: "4px",
							},
							...selectProps?.sx,
						}}
					>
						{options?.map((opt) => {
							if (grouped) {
								return renderGroupedOptions(opt);
							}

							return (
								<MenuItem key={opt.value} value={opt.value}>
									{opt.content}
								</MenuItem>
							);
						})}
					</MuiSelect>
				</FormControl>
			</Grid>
		</Grid>
	);
}
