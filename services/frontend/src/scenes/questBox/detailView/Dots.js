const { Box } = require("@mui/material");

const Dots = ({ sxStyle }) => {
	return (
		<Box
			sx={{
				backgroundColor: "#CFD2FA",
				height: 6,
				width: 6,
				borderRadius: 99,
				...sxStyle,
			}}
		/>
	);
};

export default Dots;
