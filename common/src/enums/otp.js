const map = {
	register: { key: "register", expiryTime: 120 * 60 }, //expiryTime sn
	resetPassword: { key: "resetPassword", expiryTime: 120 * 60 },
	smsCode: { key: "smsCode", expiryTime: 120 * 60 },
	operation: { key: "operation", expiryTime: 120 * 60 }, //TODO fix 5 minute
	emailCode: { key: "emailCode", expiryTime: 120 * 60 },
	smsCode: { key: "smsCode", expiryTime: 120 * 60 },
	contactInfoKey: { key: "contactInfoKey", expiryTime: 120 * 60 },
	otpDeposit: { key: "otpDeposit", expiryTime: 120 * 60 },
};

const protectedRoutes = [
	"/connection-update",
	"/connection/:exchange/delete",
	"/connection/:exchange/active",
	"/security-settings",
	"/transaction/start",
	"/contact-info",
	"/password/update",
	"/forgot-password/confirm",
	"/coinspaid/withdrawal/confirm",
	"/annul/confirm",
];

module.exports = {
	map,
	protectedRoutes,
};
