import React from "react";

export default function ArrowDown({ width, height, color, ...rest }) {
	return (
		<svg
			{...rest}
			width={width ?? "17"}
			height={height ?? "9"}
			viewBox="0 0 17 9"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				fill-rule="evenodd"
				clip-rule="evenodd"
				d="M16.1524 0.292897C16.5429 0.683424 16.5429 1.31659 16.1524 1.70711L9.19233 8.66712C9.00471 8.85474 8.75021 8.9601 8.48486 8.96001C8.21952 8.95991 7.9651 8.85436 7.77761 8.6666L0.82766 1.70659C0.43742 1.31579 0.437878 0.682623 0.828683 0.292382C1.21949 -0.0978603 1.85265 -0.0974026 2.2429 0.293404L8.48574 6.54529L14.7382 0.292889C15.1287 -0.0976328 15.7619 -0.0976293 16.1524 0.292897Z"
				fill={color ?? "#0F20E8"}
			/>
		</svg>
	);
}
