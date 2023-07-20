const Router = require("koa-router");
const router = Router();
const Joi = require("joi");
const dayjs = require("dayjs");

const crypto = require("crypto");
const axios = require("axios").default;
const { _ } = require("lodash");
const generateRandomUuid = require("uuid");

const { sendOtpCode } = require("@backend/common/middlewares/sendOtpCode");
const { setTransaction } = require("@backend/common/functions/otp");
const { protectedRoutes } = require("@backend/common/enums/otp");
const { otpProtection } = require("@backend/common/middlewares/otpProtection");

const { setError } = require("@backend/common/utils");
const { dbClient } = require("@paratica/common/prisma");
const authParser = require("@backend/common/middlewares/authParser");
const authRequired = require("@backend/common/middlewares/authRequired");
const passwordProtection = require("@backend/common/middlewares/passwordProtection");
const { _sendNotifications, NOTIFICATION_TITLES } = require("@backend/common/functions/notificationControls");
const { REGEXP_PASSWORD, MAXIMUM_PASSWORD_LENGTH } = require("@backend/common/enums/regularExpressions.js");
const rateLimit = require("@backend/common/middlewares/rateLimit");

const { STATUS_TYPES, SOURCE_TYPES, TYPES, STATUS_TYPES_MAP } = require("../constants");

const MINIMUM_WITHDRAW_AMOUNT = 10;
const MAXIMUM_WITHDRAW_AMOUNT = 10000;
const WITHDRAW_BALANCE_LIMIT = 50; // if user have less then this amount, he/she must withdraw all his/her balance

const COINSPAID_TRANSACTION_FEE = 1;

async function createSignature(body, secret) {
	const signature = crypto.createHmac("sha512", secret).update(body).digest("hex").toString();

	return signature;
}

async function getTotalAmount(userId) {
	const receiver = await dbClient.walletTransaction.aggregate({
		where: {
			receiver: {
				id: userId,
			},
			type: TYPES.REAL,
			status: STATUS_TYPES.DONE,
		},
		_sum: {
			amount: true,
		},
	});

	const sender = await dbClient.walletTransaction.aggregate({
		where: {
			sender: {
				id: userId,
			},
			type: TYPES.REAL,
			status: STATUS_TYPES.DONE,
		},
		_sum: {
			amount: true,
		},
	});

	let totalReceived = receiver?._sum?.amount ?? 0;
	let totalSent = sender?._sum?.amount ?? 0;

	if (totalReceived === null) totalReceived = 0;
	if (totalSent === null) totalSent = 0;

	return (totalReceived - totalSent).toFixed(2);
}

const getOrCreateUserWalletAddressSchema = Joi.object({
	currency: Joi.string().required(),
	network: Joi.object({
		name: Joi.string().optional(),
		code: Joi.string().optional(),
	}).optional(),
}).error(new Joi.ValidationError(`getOrCreateUserWalletAddressSchema type error`));

async function getOrCreateUserWalletAddress(ctx, next) {
	const body = Joi.attempt(ctx.request.body, getOrCreateUserWalletAddressSchema);
	const userId = ctx.request.auth.userId;

	let userWalletAddress = await dbClient.userWalletAddress.findFirst({
		where: {
			userId,
			currency: body.currency,
		},
	});

	if (userWalletAddress) {
		ctx.status = 200;
		ctx.body.data = { userWalletAddress };
		return next();
	}

	const requestBody = {
		currency: body.currency,
		foreign_id: userId,
	};

	const url = process.env.COINSPAID_ENDPOINT + "/api/v2/addresses/take";
	const params = {
		requestBody,
		path: "/api/v2/addresses/take",
	};

	const responseData = await callWebService(params);

	if (!responseData) {
		ctx.status = 200;
		return next();
	}

	userWalletAddress = await dbClient.userWalletAddress.create({
		data: {
			ts: new Date(),
			walletId: responseData.data.id,
			userId: responseData.data.foreign_id,
			currency: responseData.data.currency,
			address: responseData.data.address,
			tag: responseData.data.tag,
		},
	});
	ctx.body.data = { userWalletAddress };

	ctx.status = 200;
	return next();
}

async function callbackDepositPayment(ctx) {
	const { body, params, headers } = ctx.request;
	const plainTextBody = ctx.request.rawBody;

	if (!body?.crypto_address?.foreign_id) {
		setError(ctx, 500, "CALLBACK_FOREIGN_ID_REQUIRED");
		return;
	}

	const processingSignature = ctx.request.headers["x-processing-signature"];
	const processingKey = ctx.request.headers["x-processing-key"];

	const userId = body.crypto_address.foreign_id;
	const key = process.env.COINSPAID_API_KEY;
	const secret = process.env.COINSPAID_SECRET_KEY;

	const signature = await createSignature(plainTextBody, secret);
	const signatureWithKey = await createSignature(plainTextBody, key);
	let status = STATUS_TYPES.DONE;

	let errorDescription;

	if (processingSignature !== signature || processingKey !== key) {
		setError(ctx, 401, "INVALID_SIGNATURE_OR_KEY");
		status = STATUS_TYPES.ERROR;
		errorDescription = "invalid signature or key";
	}

	status = status === STATUS_TYPES.DONE ? STATUS_TYPES_MAP[body.status] : status;

	const signatureControlData = {
		processingKey,
		processingSignature,
		key,
		signature,
		signatureWithKey,
		status,
	};

	const previouslyWalletTransaction = await dbClient.walletTransaction.findFirst({
		where: {
			status: "DONE",
			receiverId: userId,
			...(body.transactions && {
				data: {
					path: ["transactionTxid"],
					equals: body.transactions[0].txid,
				},
			}),
		},
	});

	if (previouslyWalletTransaction) {
		errorDescription = errorDescription + "previously processed request";

		const coinspaidTransactionLogData = {
			ts: new Date(),
			userId,
			walletTransactionId: previouslyWalletTransaction.transactionId,
			status: STATUS_TYPES.ERROR,
			data: {
				type: "callbackDepositPayment",
				body,
				params,
				headers,
				signatureControlData,
				plainTextBody,
				errorDescription,
			},
		};

		await dbClient.coinspaidTransactionLog.create({
			data: {
				...coinspaidTransactionLogData,
			},
		});

		ctx.status = 201;
		ctx.body.data = {};
		return;
	}

	let walletTransactionData = {
		receiverId: userId,
		source: SOURCE_TYPES.SYSTEM,
		type: TYPES.REAL,
		amount: parseFloat(body.currency_received.amount_minus_fee),
		status,
		transactionId: generateRandomUuid.v4(),
		data: {
			transactionTxid: body.transactions[0].txid,
			transactionSource: "coinspaid",
			data: body,
		},
	};

	const walletTransaction = await dbClient.walletTransaction.create({
		data: {
			...walletTransactionData,
			createdBy: userId,
		},
	});

	walletTransactionData = {
		receiverId: userId,
		source: SOURCE_TYPES.SYSTEM,
		type: TYPES.BONUS,
		amount: parseFloat(body.fees[0].amount),
		status,
		transactionId: generateRandomUuid.v4(),
		data: {
			transactionSource: "coinspaid",
			data: body.data,
		},
	};

	await dbClient.walletTransaction.create({
		data: {
			...walletTransactionData,
			createdBy: userId,
		},
	});

	const coinspaidTransactionLogData = {
		ts: new Date(),
		userId,
		walletTransactionId: walletTransaction.transactionId,
		status,
		data: { type: "callbackDepositPayment", body, params, headers, signatureControlData, plainTextBody },
	};

	await dbClient.coinspaidTransactionLog.create({
		data: {
			...coinspaidTransactionLogData,
		},
	});

	const notificationData = {
		to: userId,
		content: {
			title: NOTIFICATION_TITLES.DEPOSIT,
			params: {
				amount: parseFloat(body.currency_received.amount_minus_fee),
			},
		},
		info: {
			reason: "wallet",
			notificationType: "Wallet",
			triggeredBy: "System",
		},
		sendingType: "singleNotification",
		data: { status: "New" },
		expireAt: dayjs().add(7, "day").toDate(),
		saveToDatabase: true,
	};

	await _sendNotifications(notificationData);

	ctx.status = 201;
	ctx.body.data = {};
	return;
}

const confirmWithdrawalSchema = Joi.object({
	currency: Joi.string().required(),
	amount: Joi.number().required(),
	address: Joi.string().required(),
	network: Joi.object({
		name: Joi.string().required(),
		code: Joi.string().required(),
	}).required(),
}).error(new Joi.ValidationError(`confirmWithdrawalSchema type error`));

async function confirmWithdrawal(ctx, next) {
	const body = Joi.attempt(ctx.request.body, confirmWithdrawalSchema);
	const userId = ctx.request.auth.userId;
	const transactionId = generateRandomUuid.v4();

	const walletTransactionData = {
		senderId: userId,
		source: SOURCE_TYPES.SYSTEM,
		type: TYPES.REAL,
		amount: parseFloat(body.amount),
		status: STATUS_TYPES.INITIALIZE,
		transactionId,
		data: {
			initial: {
				transactionSource: "coinspaid",
				transactionType: "withdrawal",
				currency: body.currency,
				address: body.address,
				network: body.network,
			},
		},
	};

	let walletTransaction = await dbClient.walletTransaction.create({
		data: {
			...walletTransactionData,
			createdBy: userId,
		},
	});

	let coinspaidTransactionLogData = {
		ts: new Date(),
		userId,
		walletTransactionId: walletTransaction.transactionId,
		status: STATUS_TYPES.INITIALIZE,
		data: { type: "initializeWithdrawal", body },
	};

	await dbClient.coinspaidTransactionLog.create({
		data: {
			...coinspaidTransactionLogData,
		},
	});

	const requestBody = {
		foreign_id: transactionId,
		amount: parseFloat(body.amount) - COINSPAID_TRANSACTION_FEE,
		currency: "USDTT",
		address: body.address,
	};
	const params = {
		requestBody,
		path: "/api/v2/withdrawal/crypto",
	};
	const withdrawResponseData = await callWebService(params);

	coinspaidTransactionLogData = {
		ts: new Date(),
		userId,
		walletTransactionId: walletTransaction.transactionId,
		status: STATUS_TYPES.PENDING,
		data: { type: "pendingWithdrawal", withdrawResponseData },
	};

	await dbClient.coinspaidTransactionLog.create({
		data: {
			...coinspaidTransactionLogData,
		},
	});

	if (withdrawResponseData.errors) {
		console.log("withdrawResponseData errors", withdrawResponseData.errors);
		walletTransaction = await dbClient.walletTransaction.update({
			where: {
				transactionId: walletTransaction.transactionId,
			},
			data: {
				status: STATUS_TYPES.ERROR,
			},
		});
	}

	const user = await dbClient.user.findUnique({
		where: {
			id: userId,
		},
		select: {
			email: true,
			phoneNumber: true,
		},
	});
	if (!withdrawResponseData.errors) {
		const slackNotificationData = {
			serviceName: "AlphaPo",
			transactionType: "Withdraw",
			amount: `${body.amount} USDTT`,
			witdrawAddress: body.address,
			from: "Traderlands",
			to: user.email ?? user.phoneNumber,
		};

		await _sendSlackNotification(slackNotificationData);
	}

	ctx.status = 200;
	ctx.body.data = { walletTransaction };
	return next();
}

async function callbackWithdrawal(ctx) {
	const { body, params, headers } = ctx.request;
	const plainTextBody = ctx.request.rawBody;

	if (!body.foreign_id) {
		setError(ctx, 500, "CALLBACK_FOREIGN_ID_REQUIRED");
		return;
	}

	const processingSignature = ctx.request.headers["x-processing-signature"];
	const processingKey = ctx.request.headers["x-processing-key"];

	const transactionId = body.foreign_id;
	const key = process.env.COINSPAID_API_KEY;
	const secret = process.env.COINSPAID_SECRET_KEY;
	const signature = await createSignature(plainTextBody, secret);
	const signatureWithKey = await createSignature(plainTextBody, key);

	let status = STATUS_TYPES.DONE;
	const errorDescription = [];

	if (processingSignature !== signature || processingKey !== key) {
		setError(ctx, 401, "INVALID_SIGNATURE_OR_KEY");
		status = STATUS_TYPES.ERROR;
		errorDescription.push("invalid signature or key ");
	}

	status = status === STATUS_TYPES.DONE ? STATUS_TYPES_MAP[body.status] : status;

	const signatureControlData = {
		processingKey,
		processingSignature,
		key,
		signature,
		signatureWithKey,
		status,
	};

	let walletTransaction = await dbClient.walletTransaction.findFirst({
		where: {
			transactionId,
		},
	});

	if (!walletTransaction) {
		setError(ctx, 500, "CALLBACK_TRANSACTION_NOT_FOUND");
		return;
	}

	const userId = walletTransaction.senderId;

	if (walletTransaction?.status === "DONE") {
		errorDescription.push("previously processed request");

		const coinspaidTransactionLogData = {
			ts: new Date(),
			userId,
			walletTransactionId: walletTransaction.transactionId,
			status: STATUS_TYPES.ERROR,
			data: {
				type: "callbackWithdrawal",
				body,
				params,
				headers,
				signatureControlData,
				plainTextBody,
				errorDescription,
			},
		};

		await dbClient.coinspaidTransactionLog.create({
			data: {
				...coinspaidTransactionLogData,
			},
		});

		ctx.status = 201;
		ctx.body.data = {};
		return;
	}

	walletTransaction = await dbClient.walletTransaction.update({
		where: {
			transactionId,
		},
		data: {
			status,
			data: {
				transactionSource: "coinspaid",
				transactionType: "Withdrawal",
				data: body.data,
			},
		},
	});

	const coinspaidTransactionLogData = {
		ts: new Date(),
		userId,
		walletTransactionId: walletTransaction.transactionId,
		status,
		data: { type: "callbackWithdrawal", body, params, headers, signatureControlData, plainTextBody },
	};

	await dbClient.coinspaidTransactionLog.create({
		data: {
			...coinspaidTransactionLogData,
		},
	});

	if (parseFloat(body.transactions[0]?.riskscore) >= 0.75) {
		await dbClient.userSecuritySetting.update({
			where: {
				userId,
			},
			data: {
				kycStatus: "NOT_COMPLETED",
			},
		});
	}

	if (status === STATUS_TYPES.DONE) {
		const notificationData = {
			to: userId,
			content: {
				title: NOTIFICATION_TITLES.WITHDRAW,
				params: {
					amount: walletTransaction.amount,
				},
			},
			info: {
				reason: "wallet",
				notificationType: "Wallet",
				triggeredBy: "System",
			},
			sendingType: "singleNotification",
			data: { status: "New" },
			expireAt: dayjs().add(7, "day").toDate(),
			saveToDatabase: true,
		};

		const responseData = await _sendNotifications(notificationData);
	}

	ctx.status = 201;
	ctx.body.data = {};
	return;
}

const startWithdrawalSchema = Joi.object({
	operation: Joi.object({
		path: Joi.string()
			.required()
			.valid(...protectedRoutes),
		body: Joi.object({
			currency: Joi.string().required(),
			amount: Joi.number().required(),
			address: Joi.string().required(),
			network: Joi.object({
				name: Joi.string().required(),
				code: Joi.string().required(),
			}).required(),
		}).required(),
		method: Joi.string().required(),
	}).required(),
	password: Joi.string().optional().regex(new RegExp(REGEXP_PASSWORD)).max(MAXIMUM_PASSWORD_LENGTH),
}).error(new Joi.ValidationError(`startWithdrawalSchema type`));

async function startWithdrawal(ctx, next) {
	const body = Joi.attempt(ctx.request.body, startWithdrawalSchema);
	const userId = ctx.request.auth.userId;

	const userSecuritySetting = await dbClient.userSecuritySetting.findUnique({
		where: {
			userId,
		},
	});

	if (userSecuritySetting?.kycStatus !== "COMPLETED") {
		setError(ctx, 400, "KYC_VALIDATION_REQUIRED");
		return;
	}

	const previousWithdrawalRequest = await dbClient.walletTransaction.findMany({
		where: {
			senderId: userId,
			OR: [{ status: STATUS_TYPES.INITIALIZE }, { status: STATUS_TYPES.PENDING }],
		},
	});

	if (previousWithdrawalRequest.length > 0) {
		setError(ctx, 400, "UNCOMPLETED_WITHDRAWAL_REQUEST");
		return;
	}

	const totalAmount = await getTotalAmount(userId);
	if (body.operation.body.amount > totalAmount) {
		setError(ctx, 400, "INSUFFICIENT_BALANCE");
		return;
	}

	if (body.operation.body.amount < MINIMUM_WITHDRAW_AMOUNT || body.operation.body.amount > MAXIMUM_WITHDRAW_AMOUNT) {
		setError(ctx, 400, "INVALID_WITHDRAW_AMOUNT");
		return;
	}

	if (totalAmount <= WITHDRAW_BALANCE_LIMIT && body.operation.body.amount < totalAmount) {
		setError(ctx, 400, "INVALID_WITHDRAW_AMOUNT");
		return;
	}

	const transactionId = generateRandomUuid.v4();

	await setTransaction({
		userId,
		transactionId,
		val: JSON.stringify(body.operation),
		type: "operation",
	});

	ctx.body.data.transactionId = transactionId;

	ctx.status = 200;

	return next();
}

async function callback(ctx, next) {
	if (!ctx.request.body.status) {
		setError(ctx, 500, "CALLBACK_STATUS_REQUIRED");
		return;
	}

	if (!ctx.request.body.type) {
		setError(ctx, 500, "CALLBACK_TYPE_REQUIRED");
		return;
	}

	if (ctx.request.body.type === "withdrawal") {
		await callbackWithdrawal(ctx);
	}

	if (ctx.request.body.type === "deposit") {
		await callbackDepositPayment(ctx);
	}

	return next();
}

async function callWebService(params) {
	const { requestBody, path } = params;
	const key = process.env.COINSPAID_API_KEY;
	const secret = process.env.COINSPAID_SECRET_KEY;

	const url = process.env.COINSPAID_ENDPOINT + path;

	const signature = await createSignature(JSON.stringify(requestBody), secret);

	const config = {
		method: "POST",
		url,
		headers: {
			"Content-Type": "application/json",
			"X-Processing-Key": key,
			"X-Processing-Signature": signature,
		},
		data: requestBody,
		maxRedirects: 20,
	};

	let responseData;

	await axios
		.request(config)
		.then((response) => {
			console.log(JSON.stringify(response.data));
			responseData = response.data;
		})
		.catch((error) => {
			console.log(error);
			responseData = error.response.data;
		});

	return responseData;
}

const generateMessage = (notificationMessage) => {
	const { serviceName, transactionType, amount, witdrawAddress, from, to, ...rest } = notificationMessage;

	let message = "⚠️⚠️⚠️\n";
	if (serviceName) message += `*Service Name:* ${serviceName}\n`;
	if (transactionType) message += `*Transaction Type:* ${transactionType}\n`;
	if (amount) message += `*Amount:* ${amount}\n`;
	if (witdrawAddress) message += `*Witdraw Address:* ${witdrawAddress}\n`;
	if (from) message += `*From:* ${from}\n`;
	if (to) message += `*To:* ${to}\n`;

	if (Object.keys(rest).length > 0) {
		message += `*Other Details:* ${JSON.stringify(rest, null, 2)}\n`;
	}

	return message;
};

async function _sendSlackNotification(body) {
	try {
		const message = generateMessage(body);

		await axios.post("https://hooks.slack.com/services/" + process.env.SLACK_WEBHOOK_URL, {
			text: message,
			type: "mrkdwn",
		});

		return {
			statusCode: 200,
			message: "Slack notification sent successfully",
		};
	} catch (error) {
		return {
			statusCode: 500,
			message: "Error while sending slack notification",
			error: error?.message || "",
		};
	}
}

router.post(
	"/coinspaid/user-wallet-address",
	rateLimit("/coinspaid/user-wallet-address"),
	authParser,
	authRequired,
	getOrCreateUserWalletAddress
);
router.post("/coinspaid/callback", rateLimit("/coinspaid/callback"), callback);
router.post(
	"/coinspaid/withdrawal/start",
	rateLimit("/coinspaid/withdrawal/start"),
	authParser,
	authRequired,
	passwordProtection,
	startWithdrawal
);
router.post(
	"/coinspaid/:method/request",
	rateLimit("/coinspaid/method/request"),
	authParser,
	authRequired,
	sendOtpCode
);
router.post(
	"/coinspaid/withdrawal/confirm",
	rateLimit("/coinspaid/withdrawal/confirm"),
	authParser,
	authRequired,
	otpProtection,
	confirmWithdrawal
);

module.exports = router;
