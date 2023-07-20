import { Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { SpotDown, SpotUp } from "images";

import { QuoteSymbolMap } from "../utils";

export default function Price({ quote, price, priceChange }) {
	const theme = useTheme();

	return (
		<>
			{price ? (
				<>
					<Typography
						variant="subtitle1"
						sx={{
							fontSize: "1.15rem",
							color: theme.palette.primary.main,
						}}
					>
						{`${QuoteSymbolMap[quote] ?? "$"}${price}`}
					</Typography>
					<Typography
						variant="subtitle1"
						sx={{
							...(priceChange < 0
								? { color: theme.palette.danger.main }
								: { color: theme.palette.success.main }),
						}}
					>
						{`${priceChange}%`}
						{priceChange < 0 ? <SpotDown /> : <SpotUp />}
					</Typography>
				</>
			) : (
				<div>-</div>
			)}
		</>
	);
}
