import React from "react";

import { Badge, Button, Grid } from "@mui/material";

const CustomButton = ({ label, icon, text, badge, onClick, buttonProps, containerProps }) =>
	badge ? (
		<Badge
			badgeContent={badge}
			sx={{
				"& .MuiBadge-badge": {
					backgroundColor: "#0F20E8",
					color: "#fff",
					border: "1px solid",
					paddingBottom: "2px",
				},
			}}
		>
			<Button
				variant="contained"
				endIcon={icon}
				sx={{
					backgroundColor: "#CFD2FA",
					color: "#0F20E8",
					"&:hover": {
						backgroundColor: "#C5C8EB",
					},
				}}
				onClick={onClick}
			>
				{text}
			</Button>
		</Badge>
	) : (
		<>
			{label ? (
				<Grid container {...containerProps}>
					<Grid item xs={12}>
						{label}
					</Grid>
					<Grid item xs={12}>
						<Button
							variant="contained"
							endIcon={icon}
							{...buttonProps}
							sx={{
								backgroundColor: "#F0F0F5",
								color: "#000",
								"&:hover": {
									backgroundColor: "#D2D2D6",
								},
								...buttonProps?.sx,
							}}
							onClick={onClick}
						>
							{text}
						</Button>
					</Grid>
				</Grid>
			) : (
				<Button
					variant="contained"
					endIcon={icon}
					{...buttonProps}
					sx={{
						backgroundColor: "#F0F0F5",
						color: "#000",
						"&:hover": {
							backgroundColor: "#D2D2D6",
						},
						...buttonProps?.sx,
					}}
					onClick={onClick}
				>
					{text}
				</Button>
			)}
		</>
	);

export default CustomButton;
