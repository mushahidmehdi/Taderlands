import { FormHelperText, Grid, InputBase, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

export default function TextField({
	label,
	value,
	error,
	helperText,
	onChange,
	labelProps,
	containerProps,
	type,
	...rest
}) {
	const theme = useTheme();
	return (
		<Grid container spacing={0.85} {...containerProps}>
			{label && (
				<Grid item xs={12}>
					<Typography
						{...labelProps}
						component="span"
						sx={{
							color: (theme) => (error ? theme.palette.danger.main : theme.palette.primary.main),
							...labelProps?.sx,
						}}
					>
						{label}
					</Typography>
				</Grid>
			)}
			<Grid item xs={12}>
				<InputBase
					{...rest}
					value={value}
					error={error}
					type={type}
					onChange={onChange}
					variant="outlined"
					sx={{
						backgroundColor: "white",
						border: `1px solid ${error ? theme.palette.danger.main : theme.palette.primary.main}`,
						borderRadius: 2,
						color: error ? theme.palette.danger.main : "black",
						p: "12px 16px",
						...rest?.sx,
					}}
				/>
			</Grid>
			{helperText && (
				<Grid item xs={12}>
					<FormHelperText error={error} margin="dense">
						{helperText}
					</FormHelperText>
				</Grid>
			)}
		</Grid>
	);
}
