import { Grid, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { MuiTelInput as MuiPhoneNumber } from "mui-tel-input";

export default function PhoneField({ label, labelProps, error, onChange, ...rest }) {
	const theme = useTheme();
	return (
		<Grid container spacing={0.85}>
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
				<MuiPhoneNumber
					{...rest}
					onChange={onChange}
					variant="outlined"
					sx={{
						// https://github.com/viclafouch/mui-tel-input/issues/46
						"& .MuiTelInput-Flag img": {
							...(rest?.value && rest?.value?.length > 2
								? {}
								: {
										display: "none",
								  }),
						},
						"&.MuiTelInput-TextField": {
							marginTop: "0",
							"& .MuiOutlinedInput-notchedOutline": {
								border: `1px solid ${error ? theme.palette.danger.main : theme.palette.primary.main}`,
								borderRadius: "8px",
								color: error ? theme.palette.danger.main : "black",
							},
						},
					}}
				/>
			</Grid>
		</Grid>
	);
}
