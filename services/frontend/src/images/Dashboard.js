import { useTheme } from "@mui/material/styles";

export default function ({ active }) {
	const theme = useTheme();

	const color = active ? theme.palette.primary.main : theme.palette.info.dark;

	return (
		<svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path
				d="M24.9881 25C24.9881 11.7516 14.2484 1.01196 1 1.01196V25H24.9881Z"
				stroke={color}
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M1 14.0692L5.86214 8.71724L9.0996 17.0079L24.9881 1"
				stroke={color}
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M24.9879 1H19.4688"
				stroke={color}
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M24.9883 6.51917V1"
				stroke={color}
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
	);
}
