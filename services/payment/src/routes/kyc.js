const Router = require("koa-router");
const dayjs = require("dayjs");
const qrcode = require("qrcode");
const axios = require("axios").default;

const { dbClient } = require("@paratica/common/prisma");

const authParser = require("@backend/common/middlewares/authParser");
const authRequired = require("@backend/common/middlewares/authRequired");

const { setError } = require("@backend/common/utils");
const { _sendNotifications, NOTIFICATION_TITLES } = require("@backend/common/functions/notificationControls");
const rateLimit = require("@backend/common/middlewares/rateLimit");

const KYC_VERIFY_FACE_TR_URL = process.env.KYC_VERIFY_FACE_TR_URL;
const KYC_VERIFY_FACE_FOREIGN_URL = process.env.KYC_VERIFY_FACE_FOREIGN_URL;

const STATUS_TYPES = {
	PENDING: "PENDING",
	COMPLETED: "COMPLETED",
	NOT_COMPLETED: "NOT_COMPLETED",
};

async function startKycProcess(ctx, next) {
	const userId = ctx.request.auth.userId;

	if (!ctx.request.header["cf-ipcountry"]) {
		setError(ctx, 401, "COUNTRY_INFORMATION_NOT_FOUND");
		return;
	}

	const countryInformation = {
		connectingIp: ctx.request.header["cf-connecting-ip"],
		countryCode: ctx.request.header["cf-ipcountry"],
	};

	const validationToken = process.env.KYC_VALIDATION_TOKEN;
	const kycValidationUrl = process.env.KYC_VALIDATION_URL;
	const kycApiUrl = countryInformation.countryCode === "TR" ? KYC_VERIFY_FACE_TR_URL : KYC_VERIFY_FACE_FOREIGN_URL;

	const options = {
		method: "POST",
		url: kycApiUrl + "/id/start",
		headers: {
			Authorization: "Bearer " + validationToken,
			"Content-Type": "application/json",
		},
		data: {
			optionalData: {
				gestureType: "EYE",
			},
		},
		maxRedirects: 20,
	};

	const transactionIdResponse = await axios.request(options).catch(function (error) {
		ctx.body.data = error;
	});

	const transactionId = transactionIdResponse.data.transactionId;

	const kycProcessUrl = kycValidationUrl + "?transactionId=" + transactionId;
	const qr = await qrcode.toDataURL(kycProcessUrl);

	let kycProcess = {
		kycProcessUrl,
	};

	if (qr) {
		kycProcess.qr = qr;
	}

	const controlParameters = await dbClient.config.findFirst({
		where: {
			title: "KYC_VERIFY_SETTINGS",
		},
	});

	await dbClient.kycProcess.create({
		data: {
			transactionId,
			userId,
			status: STATUS_TYPES.PENDING,
			createdBy: userId,
			data: controlParameters.data,
			countryInformation,
		},
	});

	await dbClient.userSecuritySetting.updateMany({
		where: {
			userId,
		},
		data: { kycStatus: STATUS_TYPES.PENDING },
	});

	ctx.body.data = { kycProcess };
	ctx.status = 200;

	return next();
}

async function proxyHandler(ctx, next) {
	const body = ctx.request.body;
	const url = ctx.request.url;
	const transactionId = body.transactionId || body.transactionID;

	const kycProcess = await dbClient.kycProcess.findFirst({
		where: {
			transactionId,
		},
	});

	if (!kycProcess) {
		setError(ctx, 401, "TRANSACTION_REQUIRED");
		return;
	}

	if (!kycProcess.countryInformation) {
		setError(ctx, 401, "COUNTRY_INFORMATION_NOT_FOUND");
		return;
	}

	let kycUrl =
		kycProcess.countryInformation?.countryCode === "TR" ? KYC_VERIFY_FACE_TR_URL : KYC_VERIFY_FACE_FOREIGN_URL;

	kycUrl = kycUrl + url.replace("/kyc/proxy", "");

	const config = {
		method: "POST",
		url: kycUrl,
		headers: {
			Authorization: "Bearer " + process.env.KYC_VALIDATION_TOKEN,
			"Content-Type": "application/json",
		},
		data: JSON.stringify(body),
		maxRedirects: 20,
	};

	let responseData;
	let status;

	await axios
		.request(config)
		.then((response) => {
			console.log(JSON.stringify(response.data));
			responseData = response.data;
			status = response.status;
		})
		.catch((error) => {
			console.log(error);
			responseData = error.response.data;
			status = error.response.status;
		});

	const kycProcessLogdata = {
		transactionId,
		data: responseData,
	};

	await dbClient.kycProcessLog.create({
		data: { ...kycProcessLogdata, createdBy: kycProcess.userId },
	});

	let verifyStatus = false;

	if (status !== 200) {
		const returnData = { ...responseData, verifyStatus };
		ctx.body.data = returnData;
		ctx.status = status;
		return next();
	}

	const entryControlResults = arrayToObject(responseData.controlResults);
	const controlResults = { ...kycProcess.data.controlResults, ...entryControlResults };
	const controlParameters = verifyControlResults(controlResults, kycProcess.data.controlParameters);

	verifyStatus = getFinalResult(controlParameters);

	await dbClient.kycProcess.update({
		where: {
			transactionId,
		},
		data: {
			data: {
				...kycProcess.data,
				controlResults,
				controlParameters,
			},
			status: verifyStatus ? STATUS_TYPES.COMPLETED : STATUS_TYPES.PENDING,
		},
	});

	if (verifyStatus) {
		await dbClient.userSecuritySetting.updateMany({
			where: {
				userId: kycProcess.userId,
			},
			data: { kycStatus: STATUS_TYPES.COMPLETED },
		});

		const notificationData = {
			to: kycProcess.userId,
			content: {
				title: NOTIFICATION_TITLES.SECURITY_SETTINGS_UPDATE,
				params: {},
			},
			info: {
				reason: "accountCenter",
				notificationType: "Account",
				triggeredBy: "System",
			},
			sendingType: "singleNotification",
			data: { status: "New" },
			expireAt: dayjs().add(7, "day").toDate(),
			saveToDatabase: true,
		};

		await _sendNotifications(notificationData);
	}

	const returnData = { ...responseData, verifyStatus };

	ctx.body.data = returnData;

	ctx.status = status;

	return next();
}

function getFinalResult(controlParameters) {
	const objectKeys = Object.keys(controlParameters);

	for (let i = 0; i < objectKeys.length; ++i) {
		if (controlParameters[objectKeys[i]].result === false) {
			return false;
		}
	}

	return true;
}

function verifyControlResults(controlResults, controlParameters) {
	const objectKeys = Object.keys(controlParameters);

	for (let i = 0; i < objectKeys.length; ++i) {
		if (controlResults[objectKeys[i]] && controlParameters[objectKeys[i]].expectedScore >= 0) {
			controlParameters[objectKeys[i]].entryScore = controlResults[objectKeys[i]]?.entryScore;
			controlParameters[objectKeys[i]].result =
				controlResults[objectKeys[i]].entryScore >= controlParameters[objectKeys[i]].expectedScore
					? true
					: false;
		}

		if (controlResults[objectKeys[i]] && controlParameters[objectKeys[i]].expectedScore === 0) {
			controlParameters[objectKeys[i]].entryScore = controlResults[objectKeys[i]]?.entryScore;
			controlParameters[objectKeys[i]].result =
				controlResults[objectKeys[i]].entryScore === controlParameters[objectKeys[i]].expectedScore
					? true
					: false;
		}
	}

	return controlParameters;
}

function arrayToObject(array) {
	var obj = {};

	for (var i = 0; i < array.length; i++) {
		obj[array[i].entryType] = array[i];
	}

	return obj;
}

const router = Router();

router.get("/kyc/start", rateLimit("/kyc/start"), authParser, authRequired, startKycProcess);

router.post("/kyc/proxy/face/verify", rateLimit("/kyc/proxy"), proxyHandler);
router.post("/kyc/proxy/id/check/new-id", rateLimit("/kyc/proxy"), proxyHandler);
router.post("/kyc/proxy/id/check/old-id", rateLimit("/kyc/proxy"), proxyHandler);
router.post("/kyc/proxy/id/check/passport", rateLimit("/kyc/proxy"), proxyHandler);
router.post("/kyc/proxy/id/check/new-driver", rateLimit("/kyc/proxy"), proxyHandler);
router.post("/kyc/proxy/id/check/add-secondary", rateLimit("/kyc/proxy"), proxyHandler);
router.post("/kyc/proxy/id/add-secondary", rateLimit("/kyc/proxy"), proxyHandler);
router.post("/kyc/proxy/id/check/template-id-card", rateLimit("/kyc/proxy"), proxyHandler);
router.post("/kyc/proxy/id/check/id/ocr-with-parse", rateLimit("/kyc/proxy"), proxyHandler);
router.post("/kyc/proxy/id/add-secondary-template", rateLimit("/kyc/proxy"), proxyHandler);
router.post("/kyc/proxy/id/hologram", rateLimit("/kyc/proxy"), proxyHandler);
router.post("/kyc/proxy/id/start", rateLimit("/kyc/proxy"), proxyHandler);

module.exports = router;
