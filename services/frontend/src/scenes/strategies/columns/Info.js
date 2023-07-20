import { useNavigate } from "react-router-dom";

import { Grid, Typography } from "@mui/material";

import { DoubleEllipse, Signal, SignalVirtual, SpotRight, Uri } from "images";

const Text = ({ name, quote, isPublic }) => (
	<Grid container>
		<Grid item xs={12}>
			<Typography>{name}</Typography>
		</Grid>
		<Grid item xs={1.5}>
			<SpotRight />
		</Grid>
		<Grid item xs={10.5}>
			<Typography sx={{ color: (theme) => theme.palette.info.dark }}>{quote}</Typography>
		</Grid>
	</Grid>
);

export default function Info({ virtual, strategyType, name, quote, href, isPublic }) {
	const navigate = useNavigate();
	return (
		<Grid
			container
			spacing={4}
			sx={{
				minWidth: 200,
			}}
		>
			<Grid item xs={3}>
				{strategyType === 1 ? (
					virtual === false ? (
						<Uri width="36" height="36" active={true} />
					) : (
						<DoubleEllipse />
					)
				) : virtual === false ? (
					<Signal />
				) : (
					<SignalVirtual />
				)}
			</Grid>
			<Grid item xs={9}>
				{isPublic ? (
					<Typography
						fontWeight={500}
						sx={{
							cursor: "pointer",
						}}
						onClick={() => navigate(href)}
					>
						<Text isPublic={isPublic} name={name} quote={quote} />
					</Typography>
				) : (
					<Text isPublic={isPublic} name={name} quote={quote} />
				)}
			</Grid>
		</Grid>
	);
}
