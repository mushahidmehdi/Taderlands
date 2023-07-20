const Router = require("koa-router");
const router = Router();
const Joi = require("joi");
const speakeasy = require("speakeasy");
const { omit } = require("lodash");
const dayjs = require("dayjs");

const { dbClient } = require("@paratica/common/prisma");
const { otpProtection } = require("@backend/common/middlewares/otpProtection");
const rateLimit = require("@backend/common/middlewares/rateLimit");
const { setError } = require("@backend/common/utils");
const { _sendNotifications, NOTIFICATION_TITLES } = require("@backend/common/functions/notificationControls");

const postSecurityOptionSchema = Joi.object({
	emailSecurityActive: Joi.boolean().optional(),
	smsSecurityActive: Joi.boolean().optional(),
	twofaSecurityActive: Joi.boolean().optional(),
	ipSecurityActive: Joi.boolean().optional(),
	ipWhitelist: Joi.array().items(Joi.string().ip()).optional(),
}).error(
	new Joi.ValidationError(
		`could be one of them "emailSecurityActive", "smsSecurityActive", "twofaSecurityActive", "ipSecurityActive"`
	)
);

async function postSecuritySettings(ctx, next) {
	const body = Joi.attempt(ctx.request.body, postSecurityOptionSchema);
	const userId = ctx.request.auth.userId;

	const user = await dbClient.user.findFirst({
		where: { id: userId },
		select: {
			id: true,
			emailVerificationStatus: true,
			phoneNumberVerificationStatus: true,
			userSecuritySetting: {
				select: {
					twofaInfo: true,
				},
			},
		},
	});

	if (body.twofaSecurityActive && !user?.userSecuritySetting?.twofaInfo?.secret) {
		setError(ctx, 404, "TOWFA_NOT_SET");
		return;
	}

	if (body.smsSecurityActive && !user?.phoneNumberVerificationStatus) {
		setError(ctx, 404, "PHONE_NUMBER_NOT_VERIFIED");
		return;
	}

	if (body.emailSecurityActive && !user?.emailVerificationStatus) {
		setError(ctx, 404, "EMAIL_NOT_VERIFIED");
		return;
	}

	const securitySettingsData = omit(body, ["twofaCode", "emailCode", "smsCode"]);

	const securitySettings = await dbClient.userSecuritySetting.upsert({
		where: {
			userId: user.id,
		},
		update: securitySettingsData,
		create: {
			userId: user.id,
			...securitySettingsData,
			createdBy: user.id,
		},
	});

	const notificationData = {
		to: user.id,
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

	const responseData = await _sendNotifications(notificationData);

	ctx.body.data = { securitySettings: omit(securitySettings, "twofaInfo") };
	ctx.body.message = "ok";
	ctx.status = 200;

	return next();
}

async function getSecuritySettings(ctx, next) {
	const userId = ctx.request.auth.userId;
	const securitySettings = await dbClient.userSecuritySetting.findFirst({
		where: {
			user: {
				id: userId,
			},
		},
	});

	ctx.body.data = { securitySettings };
	ctx.status = 200;

	return next();
}

const ipWhitelistSchema = Joi.object({
	list: Joi.array().items(Joi.string().ip()),
}).error(new Joi.ValidationError(`ipWhitelistSchema type error`)); //TODO need to better error message

async function postIpwhiteList(ctx, next) {
	const body = Joi.attempt(ctx.request.body, ipWhitelistSchema);
	const userId = ctx.request.auth.userId;
	const securitySettings = await dbClient.userSecuritySetting.upsert({
		where: {
			user: { id: userId },
		},
		update: {
			ipWhitelist: { list: body.list },
		},
		create: {
			userId: userId,
			ipWhitelist: { list: body.list },
			twofaInfo: {},
			createdBy: userId,
		},
		select: {
			ipWhitelist: true,
		},
	});

	const notificationData = {
		to: userId,
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

	const responseData = await _sendNotifications(notificationData);

	ctx.body.message = "ok";
	ctx.body.data = { securitySettings };
	ctx.status = 200;

	return next();
}

const twofaSettingsSchema = Joi.object({
	otp: Joi.string().required(),
	secret: Joi.string().required(),
}).error(new Joi.ValidationError(`twofaSettingsSchema type error`)); //TODO need to better error message

async function postTwofaSettings(ctx, next) {
	const body = Joi.attempt(ctx.request.body, twofaSettingsSchema);
	const userId = ctx.request.auth.userId;

	const verified = speakeasy.totp.verify({
		secret: body.secret,
		encoding: "base32",
		token: body.otp,
	});

	if (!verified) {
		setError(ctx, 406, "OTP_CODE_FALSE");
		return;
	}

	const securitySettings = await dbClient.userSecuritySetting.upsert({
		where: {
			userId: userId,
		},
		update: {
			twofaInfo: { secret: body.secret, otp: body.otp },
			twofaSecurityActive: true,
		},
		create: {
			userId: userId,
			createdBy: userId,
			twofaSecurityActive: true,
			twofaInfo: { secret: body.secret, otp: body.otp },
		},
	});

	const notificationData = {
		to: userId,
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

	const responseData = await _sendNotifications(notificationData);

	ctx.body.message = "ok";
	ctx.body.data = { securitySettings };
	ctx.status = 200;

	return next();
}

router.patch("/security-settings", rateLimit("/security-settings/patch"), otpProtection, postSecuritySettings);
router.get("/security-settings", rateLimit("/security-settings/get"), getSecuritySettings);
router.post("/ip-whitelist", rateLimit("/ip-whitelist"), postIpwhiteList);
router.post("/twofa-settings", rateLimit("/twofa-settings"), postTwofaSettings);

router.routes = router.middleware;
module.exports = router;
