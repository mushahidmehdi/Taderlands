import { useTheme } from "@mui/material/styles";

export default function ({ active, disabled }) {
	const theme = useTheme();

	const color = disabled
		? theme.palette.info.dark
		: active
		? theme.palette.primary.main
		: theme.palette.primary.light;

	return (
		<svg width="26" height="27" viewBox="0 0 26 27" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path
				d="M24.9881 25.5935C24.9881 12.3451 14.2484 1.60547 1 1.60547V25.5935H24.9881Z"
				stroke={color}
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M1 14.6625L5.86214 9.3105L9.0996 17.6012L24.9881 1.59326"
				stroke={color}
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M24.9879 1.59326H19.4688"
				stroke={color}
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M24.9883 7.11243V1.59326"
				stroke={color}
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
	);
}
