import { Box } from "@mui/material";

export default function TabPanel(props) {
	const { children, value, index, ...other } = props;
	return (
		<Box role="tabpanel" hidden={value !== index} id={`tabpanel-${index}`} {...other}>
			{value === index && <>{children}</>}
		</Box>
	);
}
