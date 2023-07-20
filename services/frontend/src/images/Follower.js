import { useTheme } from "@mui/material/styles";

export default function ({ width, height, color }) {
	const theme = useTheme();

	const imgColor = color ? color : theme.palette.primary.main;

	return (
		<svg
			width={width ? width : "38"}
			height={height ? height : "40"}
			viewBox={`0 0 38 40`}
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				fill-rule="evenodd"
				clip-rule="evenodd"
				d="M17.1694 12.7214C18.0739 11.8168 19.5404 11.8168 20.4449 12.7213L36.8897 29.166C37.6707 29.947 37.7916 31.1708 37.1785 32.0895L37.1322 32.1589C37.0477 32.2855 36.951 32.4034 36.8434 32.511C26.8595 42.4949 10.6622 42.4949 0.678387 32.511C0.244023 32.0767 0 31.4875 0 30.8733V30.8502C0 30.2359 0.244023 29.6467 0.678387 29.2124L17.1694 12.7214ZM18.8072 17.6347L5.66851 30.7733C13.3138 36.9115 24.2742 36.8977 31.9046 30.732L18.8072 17.6347Z"
				fill="#0F20E8"
			/>
			<path
				d="M18.785 21.0309C23.9528 21.0309 28.1423 16.8416 28.1423 11.6737C28.1423 6.50582 23.9528 2.31641 18.785 2.31641C13.6171 2.31641 9.42773 6.50582 9.42773 11.6737C9.42773 16.8416 13.6171 21.0309 18.785 21.0309Z"
				fill="white"
			/>
			<path
				fill-rule="evenodd"
				clip-rule="evenodd"
				d="M18.7847 4.63231C14.896 4.63231 11.7436 7.78473 11.7436 11.6735C11.7436 15.5622 14.896 18.7145 18.7847 18.7145C22.6735 18.7145 25.8259 15.5621 25.8259 11.6735C25.8259 7.78477 22.6734 4.63231 18.7847 4.63231ZM7.11133 11.6735C7.11133 5.22642 12.3376 0 18.7847 0C25.2317 0 30.4582 5.22637 30.4582 11.6735C30.4582 18.1206 25.2317 23.3468 18.7847 23.3468C12.3377 23.3468 7.11133 18.1205 7.11133 11.6735Z"
				fill="#0F20E8"
			/>
		</svg>
	);
}
