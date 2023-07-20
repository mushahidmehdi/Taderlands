import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { Button, Grid, Typography } from "@mui/material";

import { SpotRight } from "images";
import { Config } from "services";

export default function PairItem({ parity, onClick, selected }) {
	const { base, quote } = parity;
	const { strategy } = useSelector((state) => state.strategyBuilder);
	const { parities } = useSelector((state) => state.parity);

	const dispatch = useDispatch();

	return (
		<Grid item>
			<Button
				sx={{
					borderRadius: "8px",
					minWidth: "150px",
					maxWidth: "150px",
					maxHeight: "100px",
					padding: "8px",
					cursor: "pointer",
					color: selected ? "#0F20E8" : "black",
					border: selected ? "1px solid #0F20E8" : "1px solid #CFD2FA",
					...(selected ? { backgroundColor: "#CFD2FA" } : {}),
					"&:hover": {
						...(selected
							? {
									background: "#B5B8DB",
							  }
							: {
									border: "1px solid #0F20E8",
									background: "#F1F1F5",
							  }),
					},
				}}
				startIcon={
					<img
						width="24px"
						height="24px"
						style={{ marginLeft: 8 }}
						src={`${Config.cdnRoot()}/general/crypto-icons/${base}.png`}
					/>
				}
				onClick={() => onClick(parity)}
			>
				<Grid container sx={{ marginLeft: 1 }}>
					<Grid item>
						<Typography variant="subtitle1" fontWeight="bold" sx={{ textAlign: "left" }}>
							{base}
						</Typography>
						<Grid container>
							<Grid item>
								<SpotRight style={{ marginTop: 2, marginRight: 4 }} />
							</Grid>
							<Grid item>
								<Typography variant="p">{quote}</Typography>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</Button>
		</Grid>
	);
}
