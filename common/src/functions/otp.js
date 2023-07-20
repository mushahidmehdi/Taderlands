const { redis } = require("../services/redis");
const i18n = require("../services/i18n");
const generateRandomUuid = require("uuid");

const { mqConnectionEmitter, createChannelWrapper, publishMessage } = require("../services/rabbitmq");
const { getTransectionKey, generateOtpCode } = require("../utils");
const { dbClient } = require("@paratica/common/prisma");
const mustache = require("mustache");

const { map: otpMap } = require("../enums/otp");

mqConnectionEmitter.on("connected", () => {
	createChannelWrapper({
		name: "email",
		exchange: "email",
		queue: "email_queue_email",
		routingKey: "email.send",
	});

	createChannelWrapper({
		name: "smsNotification",
		exchange: "smsNotification",
		queue: "sms_queue_sms",
		routingKey: "smsNotification.send",
	});
});

async function sendOtp(params) {
	const { email, phoneNumber, type = "", language, userId, ip } = params;

	const randomCode = generateOtpCode();

	await setRedisCode({ email, phoneNumber, type, randomCode });

	email && (await sendOtpEmail(email, randomCode, language, type, userId, ip));
	phoneNumber && (await sendOtpSMS(phoneNumber, randomCode, language, type, userId, ip));

	return "otpSent";
}

async function sendOtpforTransaction(params) {
	const { type = "", language, email, phoneNumber, userId, ip } = params;

	const randomCode = generateOtpCode();
	const key = getTransectionKey(params) + randomCode;

	await redis.set(key, randomCode, "EX", otpMap[type].expiryTime);

	if (type === "emailCode") {
		await sendOtpEmail(email, randomCode, language, "operation", userId, ip);
	}

	if (type === "smsCode") {
		await sendOtpSMS(phoneNumber, randomCode, language, "operation", userId, ip);
	}

	return "otpSent";
}

function getRedisKey({ email, phoneNumber, type }) {
	let key;

	email && (key = `otp:${type}:email:${email}`);
	phoneNumber && (key = `otp:${type}:phoneNumber:${phoneNumber}`);

	return key;
}

async function setRedisCode({ email, phoneNumber, type, randomCode }) {
	const key = getRedisKey({ email, phoneNumber, type });

	await redis.set(key, randomCode, "EX", otpMap[type].expiryTime);
}

async function getRedisCode({ email, phoneNumber, type }) {
	if (!type) {
		console.error("getRedisCode: There should be a valid type field.");
		return;
	}

	const key = getRedisKey({ email, phoneNumber, type });

	const val = redis.get(key);
	redis.del(key);
	return await val;
}

async function setTransaction(params) {
	const { val, type } = params;
	const key = getTransectionKey(params);

	await redis.set(key, val, "EX", otpMap[type].expiryTime);

	return "redisSave";
}

async function sendOtpEmail(email, otpCode, language = "en", type, userId, ip) {
	i18n.setLocale(language);

	let notificationTemplate = await dbClient.notificationTemplate.findFirst({
		where: {
			title: type.toUpperCase(),
		},
	});

	const subject = mustache.render(notificationTemplate?.subject[language], { otpCode });
	const mailContent = mustache.render(notificationTemplate?.body[language], { otpCode });

	notificationTemplate.htmlCode = mustache.render(notificationTemplate.htmlCode, { mailContent });

	const transactionId = generateRandomUuid.v4();
	const otpRequestparams = { email, otpCode, type, userId, ip, transactionId };

	await insertOtpRequest(otpRequestparams);

	return publishMessage("email", {
		sender: "noreply@traderlands.com",
		recipients: [email],
		subject,
		body: notificationTemplate.htmlCode,
		transactionId,
	});
}

async function sendOtpSMS(phoneNumber, otpCode, language = "en", type, userId, ip) {
	i18n.setLocale(language);
	const transactionId = generateRandomUuid.v4();
	const params = {
		PhoneNumber: phoneNumber,
		Message: i18n.__(type + ".smsBody", { otpCode }),
		DefaultSMSType: "Transactional",
		transactionId,
	};

	const otpRequestparams = { phoneNumber, otpCode, type, userId, ip, transactionId };

	await insertOtpRequest(otpRequestparams);

	return publishMessage("smsNotification", params);
}

async function insertOtpRequest(params) {
	const { userId, email, phoneNumber, otpCode, type, ip, transactionId } = params;

	const status = "PENDING";
	try {
		await dbClient.otpRequest.create({
			data: {
				userId,
				ip,
				email,
				phoneNumber,
				otpCode,
				type,
				status,
				transactionId,
			},
		});
	} catch (error) {
		console.log("insertOtpRequest userId : ", userId);
		console.log("insertOtpRequest params : ", JSON.stringify(params));
		console.log("insertOtpRequest error : ", error);
	}
}

module.exports = {
	sendOtpEmail,
	sendOtp,
	getRedisCode,
	setTransaction,
	sendOtpforTransaction,
};
