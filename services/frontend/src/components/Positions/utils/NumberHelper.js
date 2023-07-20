export const roundOff = (number) => {
	if (!number) return number;

	let numberStr = number.toString();
	let decimalPointIndex = numberStr.indexOf(".");

	// If there's no decimal point, return the original number
	if (decimalPointIndex === -1) {
		return number;
	}

	// Start from the digit after the decimal point
	let i = decimalPointIndex + 1;

	// Loop through the digits after the decimal point
	while (i < numberStr.length) {
		// If the digit is not zero, break out of the loop
		if (numberStr[i] !== "0") {
			break;
		}
		i++;
	}

	// Get the 4 number after the decimal
	let roundedOffNumberStr = numberStr.slice(0, i + 4);

	const lastIndex = roundedOffNumberStr.length;
	if (roundedOffNumberStr[lastIndex - 1] > 5) {
		let lastDigit = parseInt(roundedOffNumberStr.toString().slice(-1));
		let newLastDigit = lastDigit + 1;
		let newNum = roundedOffNumberStr.toString().slice(0, -1) + newLastDigit.toString();
		return Number(newNum);
	}
	return Number(roundedOffNumberStr);
};
