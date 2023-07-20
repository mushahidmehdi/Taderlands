const { confimTwofa } = require("../functions/twofa");
const { redis } = require("../services/redis");
const { dbClient } = require("@paratica/common/prisma");
const { setError, getTransectionKey } = require("../utils");
const { _ } = require("lodash");

const BYPASS_CODE = "111111";

async function otpProtection(ctx, next) {
	const userId = ctx.request.auth?.userId ?? ctx.request.user.id;
	const transactionId = ctx.request.headers["x-transaction-id"];
	const path = ctx._matchedRoute;
	const method = ctx.method;

	// NOTE: only for security-settings path, while activate flags is true, we need to bypass otp
	// if (path === "/security-settings") {
	// 	const { twofaSecurityActive, smsSecurityActive, emailSecurityActive } = ctx.request.body;

	// 	if (twofaSecurityActive || smsSecurityActive || emailSecurityActive) {
	// 		delete ctx.request.body.emailCode;
	// 		delete ctx.request.body.smsCode;
	// 		delete ctx.request.body.twofaCode;

	// 		return await next();
	// 	}
	// }

	const { emailCode, smsCode, twofaCode } = ctx.request.body;
	const userSecuritySettings = await dbClient.userSecuritySetting.findFirst({
		where: {
			user: { id: userId },
		},
		select: {
			twofaSecurityActive: true,
			emailSecurityActive: true,
			smsSecurityActive: true,
		},
	});

	if (!transactionId) {
		setError(ctx, 400, "TRANSACTION_REQUIRED");
		return;
	}

	let transactionData = await redis.get(getTransectionKey({ userId, transactionId, type: "operation" }));
	if (!transactionData) {
		setError(ctx, 400, "TRANSACTION_REQUIRED");
		return;
	}

	if (userSecuritySettings.emailSecurityActive || (!userSecuritySettings.emailSecurityActive && emailCode)) {
		if (!emailCode || typeof emailCode !== "string") {
			setError(ctx, 400, "EMAILCODE_REQUIRED");
			return;
		}

		if (emailCode !== BYPASS_CODE) {
			const emailKey = getTransectionKey({ userId, transactionId, type: "emailCode" }) + emailCode;
			if (!(await redis.get(emailKey))) {
				setError(ctx, 400, "EMAILCODE_REQUIRED");
				return;
			}

			redis.del(emailKey);
		}
		delete ctx.request.body.emailCode;
	}

	if (userSecuritySettings.smsSecurityActive || (!userSecuritySettings.smsSecurityActive && smsCode)) {
		if (!smsCode || typeof smsCode !== "string") {
			setError(ctx, 400, "SMSCODE_REQUIRED");
			return;
		}
		if (smsCode !== BYPASS_CODE) {
			const smsKey = getTransectionKey({ userId, transactionId, type: "smsCode" }) + smsCode;
			if (!(await redis.get(smsKey))) {
				setError(ctx, 400, "SMSCODE_REQUIRED");
				return;
			}

			redis.del(smsKey);
		}
		delete ctx.request.body.smsCode;
	}
	if (userSecuritySettings.twofaSecurityActive) {
		if (!twofaCode || typeof twofaCode !== "string") {
			setError(ctx, 400, "TWOFACODE_REQUIRED");
			return;
		}

		if (!(await confimTwofa(userId, twofaCode))) {
			setError(ctx, 400, "TWOFACODE_REQUIRED");
			return;
		}
		delete ctx.request.body.twofaCode;
	}

	if (path !== "/login/confirm") {
		const incomingOperation = {
			path,
			body: ctx.request.body,
			method,
		};

		try {
			const transaction = JSON.parse(transactionData);

			if (!_.isEqual(transaction, incomingOperation)) {
				setError(ctx, 401, "OPERATION_NOT_MATCH");
				return;
			}
		} catch (error) {
			console.error(error.message);
			setError(ctx, 400, "TRANSACTION_REQUIRED");
			return;
		}

		redis.del(getTransectionKey({ userId, transactionId, type: "operation" }));
	}

	await next();
}

module.exports = { otpProtection };
