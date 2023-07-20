import React from "react";

import Config from "services/config";

const CoinIcon = ({ quote, width = "44px", height = "44px", ...rest }) => (
	<img width={width} height={height} src={`${Config.cdnRoot()}/general/crypto-icons/${quote}.png`} {...rest} />
);

export default CoinIcon;
