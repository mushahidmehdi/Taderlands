import React from "react";

import { Box, SvgIcon, Typography } from "@mui/material";

import { ShortChip, LongChip, FutureChip, SpotChip } from "images";

const TradingType = ({ value }) => {
	return (
		<Box
			display="flex"
			justifyContent="center"
			border={value === "SPOT" && "1px solid #0F20E8"}
			height={"1.8rem"}
			p={"0.2rem 0.65rem"}
			paddingTop="0.35rem"
			borderRadius={1}
			mt={-0.01}
			sx={{
				backgroundColor:
					value === "FUTURE" ? "#3A3A3A" : value === "LONG" ? "#0F20E8" : value === "SHORT" ? "#CFD2FA" : "",
			}}
		>
			<SvgIcon>
				{value === "FUTURE" ? (
					<FutureChip />
				) : value === "SHORT" ? (
					<ShortChip />
				) : value === "SPOT" ? (
					<SpotChip />
				) : (
					<LongChip />
				)}
			</SvgIcon>

			<Typography
				sx={{
					color: value === "SPOT" ? "#0F20E8" : value === "SHORT" ? "#0F20E8" : "#fff",
				}}
				fontWeight={400}
				fontSize={12.5}
				ml={-0.4}
			>
				{value}
			</Typography>
		</Box>
	);
};

export default TradingType;
