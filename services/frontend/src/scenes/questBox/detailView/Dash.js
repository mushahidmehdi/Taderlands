import React from "react";

import { Box } from "@mui/system";

import Dots from "./Dots";

const Dash = () => {
	return (
		<Box
			display="flex"
			justifyContent="center"
			alignItems="center"
			gap={0.8}
			marginLeft="-10px"
			marginRight={1}
			marginTop="-8px"
		>
			<Dots sxStyle={{ height: "2.5px", width: "16px" }} />
			<Dots sxStyle={{ height: "2.5px", width: "16px" }} />
			<Dots sxStyle={{ height: "2.5px", width: "16px" }} />
		</Box>
	);
};

export default Dash;
