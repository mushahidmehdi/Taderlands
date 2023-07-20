import { Button, Grid, Paper, Typography } from "@mui/material";

export default function MerchantStatusCard({ icon, title, text, buttonText, buttonAction, color }) {
	return (
		<Paper sx={{ padding: "24px", ml: 2 }}>
			<Grid container>
				<Grid item xs={8}>
					<Typography sx={{ mt: 2, fontSize: "24px", fontWeight: "bold", color: color }}>{title}</Typography>
				</Grid>
				<Grid item xs={4}>
					{icon}
				</Grid>
				<Grid item xs={12}>
					<Typography sx={{ mt: 2, fontSize: "14px" }}>{text}</Typography>
				</Grid>
				<Grid item xs={12}>
					<Button
						fullWidth
						variant="contained"
						sx={{ mt: 2, fontSize: "14px", backgroundColor: color }}
						onClick={buttonAction}
					>
						{buttonText}
					</Button>
				</Grid>
			</Grid>
		</Paper>
	);
}
