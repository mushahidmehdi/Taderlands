export default function shortenNumber(num) {
	let str,
		suffix = "";

	if (num < 1000) {
		str = num.toFixed(2);
	} else if (num < 1000000) {
		str = Math.floor(num / 1000);
		suffix = "K";
	} else if (num < 1000000000) {
		str = Math.floor(num / 1000000);
		suffix = "M";
	} else if (num < 1000000000000) {
		str = Math.floor(num / 1000000000);
		suffix = "B";
	} else if (num < 1000000000000000) {
		str = Math.floor(num / 1000000000000);
		suffix = "T";
	}
	return str + suffix;
}
