import React from "react";

export default function BacktestIcon({ width, height, color }) {
	return (
		<svg
			width={width ?? "48"}
			height={height ?? "36"}
			viewBox={`0 0 48 36`}
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				fill-rule="evenodd"
				clip-rule="evenodd"
				d="M0 12.4208C0 11.4409 0.794367 10.6465 1.77427 10.6465H23.5801C24.56 10.6465 25.3543 11.4409 25.3543 12.4208V34.2266C25.3543 35.2065 24.56 36.0009 23.5801 36.0009C10.5529 36.0009 0 25.4479 0 12.4208ZM3.62595 14.195C4.47202 23.846 12.1548 31.5288 21.8058 32.3749V14.195H3.62595Z"
				fill={color ?? "white"}
			/>
			<path
				fill-rule="evenodd"
				clip-rule="evenodd"
				d="M21.8066 1.77427C21.8066 0.794367 22.601 0 23.5809 0C36.6081 0 47.161 10.5529 47.161 23.5801C47.161 24.56 46.3666 25.3544 45.3867 25.3544H23.5809C22.601 25.3544 21.8066 24.56 21.8066 23.5801V1.77427ZM25.3552 3.62595V21.8058H43.535C42.689 12.1549 35.0062 4.47202 25.3552 3.62595Z"
				fill={color ?? "white"}
			/>
		</svg>
	);
}
