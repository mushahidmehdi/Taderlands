const getTransectionKey = (params) => {
	const { userId, transactionId, type } = params;
	return `transaction:${transactionId}:userId:${userId}:type:${type}`;
};

function generateOtpCode() {
	const random = Math.random();
	if (random < 0.1) {
		return "0" + String(Math.floor(random * 1000000));
	} else {
		return String(Math.floor(random * 1000000));
	}
}

module.exports = {
	getTransectionKey,
	generateOtpCode,
};
