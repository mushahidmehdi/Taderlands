export default function ({ color }) {
	return (
		<svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path
				fill-rule="evenodd"
				clip-rule="evenodd"
				d="M16.2763 0.000425759C16.6892 0.0146397 17.013 0.381126 16.9996 0.818996C16.7169 10.0544 9.43049 17.2908 0.723645 16.991C0.525339 16.9842 0.337717 16.8941 0.202074 16.7405C0.0664319 16.5869 -0.00611388 16.3824 0.000404134 16.1721L0.247216 8.2079C0.260785 7.77003 0.606455 7.42674 1.01929 7.44113C1.43213 7.45553 1.7558 7.82215 1.74223 8.26002L1.52063 15.4107C9.06732 15.258 15.2569 8.86044 15.5046 0.767523C15.518 0.329653 15.8635 -0.0137882 16.2763 0.000425759Z"
				fill={color ? color : "#36B37E"}
			/>
		</svg>
	);
}
