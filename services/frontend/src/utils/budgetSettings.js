import { EXCHANGE_TEXT_MAP } from "constants";

import { Typography } from "@mui/material";

export const getAvailableBudget = ({ portfolio, platform, quote }) => {
	const { exchange, id: platformId } = platform;

	const platformPortfolio = portfolio?.find((x) => x.platformId === platformId);

	const availableBudget = platformPortfolio?.portfolio?.assets?.find((x) => x.coinName === quote)?.coinAmount;

	return availableBudget ? (
		<Typography fontSize={12}>
			{`${EXCHANGE_TEXT_MAP[exchange]} Budget`}
			&nbsp;
			<Typography component="span" color="primary" fontSize={12}>
				{availableBudget}
			</Typography>
			&nbsp;
			{quote}
		</Typography>
	) : (
		<></>
	);
};
