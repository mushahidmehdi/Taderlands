import { useTheme } from "@mui/material/styles";

export default function ({ active, width, height }) {
	const theme = useTheme();

	const color = active ? theme.palette.primary.main : theme.palette.info.dark;

	return (
		<svg
			width={width ?? "28"}
			height={height ?? "28"}
			viewBox="0 0 36 36"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M1 1C1 18.6735 15.3268 33 33.0003 33C33.0003 15.3265 18.6735 1 1 1Z"
				stroke={color}
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M33.0003 1C15.3268 1 1 15.3265 1 33C18.6735 33 33.0003 18.6735 33.0003 1Z"
				stroke={color}
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
	);
}
