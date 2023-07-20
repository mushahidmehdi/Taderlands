import { Typography } from "@mui/material";

import { Chip } from "components";

import { QuoteSymbolMap } from "../utils";

const PROFIT_AMOUNT_BG = "#6A1FC2";

export default function Profit({ quote, virtual, profitAmount, platformId }) {
	const preProfit = platformId === 1 && quote === "USD" ? "₿" : QuoteSymbolMap[quote] ?? "$";

	return (
		<>
			{virtual ? (
				<Chip label={"Virtual Trade"} backgroundColor={PROFIT_AMOUNT_BG} />
			) : (
				<Typography
					sx={{
						color: (theme) => (profitAmount > 0 ? theme.palette.primary.main : theme.palette.info.dark),
					}}
				>
					{`${
						profitAmount
							? profitAmount < 0
								? "-" +
								  preProfit +
								  parseFloat(profitAmount.toString().substring(1)).toFixed(platformId === 1 ? 10 : 2) // e.g. -40.4556 => -$40.45
								: preProfit + profitAmount.toFixed(platformId === 1 ? 10 : 2)
							: "-"
					}`}
				</Typography>
			)}
		</>
	);
}
