import React from "react";

import { Typography } from "@mui/material";

import dayjs from "dayjs";

const CustomDate = ({ date }) => (
	<>
		{date ? (
			<>
				{["DD MMM YYYY", "HH:mm:ss"].map((format, ix) => (
					<Typography key={ix} variant="subtitle1">
						{dayjs(date).format(format)}
					</Typography>
				))}
			</>
		) : (
			<Typography variant="subtitle">-</Typography>
		)}
	</>
);

export default CustomDate;
