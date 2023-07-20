import React from "react";

import { SvgIcon } from "@mui/material";

import { BitmaxChip, BinanceChip, BinanceTrChip, DyDxChip, FtxChip, FfxTRChip, HuobiChip, OkexChip } from "images";

const fontSize = {
	fontSize: 46,
	width: "7rem",
	marginInlineStart: "-1.6rem",
};

const ExchangeType = ({ value }) => {
	if (value === "bitmex") {
		return (
			<SvgIcon style={fontSize}>
				<BitmaxChip />
			</SvgIcon>
		);
	} else if (value === "binanceTr") {
		return (
			<SvgIcon style={fontSize}>
				<BinanceTrChip />
			</SvgIcon>
		);
	} else if (value === "huobi") {
		return (
			<SvgIcon style={fontSize}>
				<HuobiChip />
			</SvgIcon>
		);
	} else if (value === "dYdX") {
		return (
			<SvgIcon style={fontSize}>
				<DyDxChip />
			</SvgIcon>
		);
	} else if (value === "binance") {
		return (
			<SvgIcon style={fontSize}>
				<BinanceChip />
			</SvgIcon>
		);
	} else if (value === "ftx") {
		return (
			<SvgIcon style={fontSize}>
				<FtxChip />
			</SvgIcon>
		);
	} else if (value === "ftxTr") {
		return (
			<SvgIcon style={fontSize}>
				<FfxTRChip />
			</SvgIcon>
		);
	} else if (value === "okx") {
		return (
			<SvgIcon style={fontSize}>
				<OkexChip />
			</SvgIcon>
		);
	}
};

export default ExchangeType;
