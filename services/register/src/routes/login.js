const Router = require("koa-router");
const Joi = require("joi");
const generateRandomUuid = require("uuid");
const dayjs = require("dayjs");

const { login, kcAdminClient } = require("../services/keycloak");

const { dbClient } = require("@paratica/common/prisma");

const { redis } = require("@backend/common/services/redis");

const { setTransaction, sendOtp } = require("@backend/common/functions/otp");
const checkCaptcha = require("@backend/common/functions/checkCaptcha");
const { _sendNotifications, NOTIFICATION_TITLES } = require("@backend/common/functions/notificationControls");

const { checkDeleted } = require("@backend/common/services/user");
const { otpProtection } = require("@backend/common/middlewares/otpProtection");
const { byIdentity: injectUserByIdentity } = require("@backend/common/middlewares/injectUser");
const { sendOtpCode } = require("@backend/common/middlewares/sendOtpCode");
const rateLimit = require("@backend/common/middlewares/rateLimit");

const { setError, getTransectionKey } = require("@backend/common/utils");

const {
	REGEXP_EMAIL,
	REGEXP_PHONE_NUMBER,
	MAXIMUM_EMAIL_LENGTH,
	MAXIMUM_PHONE_NUMBER_LENGTH,
	MAXIMUM_PASSWORD_LENGTH,
} = require("@backend/common/enums/regularExpressions.js");

const getUserSecuritySettingsSchema = Joi.object({
	email: Joi.string()
		.regex(new RegExp(REGEXP_EMAIL))
		.max(MAXIMUM_EMAIL_LENGTH)
		.error(
			new Joi.ValidationError(
				`Email address is not valid or too long (longer than ${MAXIMUM_EMAIL_LENGTH} characters).`
			)
		),
	phoneNumber: Joi.string()
		.regex(new RegExp(REGEXP_PHONE_NUMBER))
		.max(MAXIMUM_PHONE_NUMBER_LENGTH)
		.error(
			new Joi.ValidationError(
				`Phone number is not valid or too long (longer than ${MAXIMUM_PASSWORD_LENGTH} characters).`
			)
		),
	password: Joi.string()
		.optional()
		.allow("")
		.max(MAXIMUM_PASSWORD_LENGTH)
		.error(new Joi.ValidationError(`Password is too long (longer than ${MAXIMUM_PASSWORD_LENGTH} characters).`)),
	captcha: Joi.string().max(2000).error(new Joi.ValidationError("Captcha is too long.")),
	mobileToken: Joi.string()
		.valid(process.env.MOBILE_TOKEN)
		.error(new Joi.ValidationError("Mobile token is not valid")),
})
	.xor("phoneNumber", "email")
	.xor("captcha", "mobileToken")
	.messages({
		"object.xor": "Some of the mandatory parameters are missing.",
		"object.missing": "Some of the mandatory parameters are missing.",
	});

async function getUserSecuritySettings(ctx, next) {
	let body = Joi.attempt(ctx.request.body, getUserSecuritySettingsSchema);

	if (body?.captcha) {
		if (!(await checkCaptcha(body.captcha))) {
			setError(ctx, 400, "CAPTCHA_INVALID");

			return;
		}
	}

	try {
		if (body.email) {
			body.email = body.email.toLowerCase();
		}

		const username = (body.phoneNumber ?? body.email).toLowerCase();

		const user = await dbClient.user.findFirst({
			where: {
				OR: [{ email: body.email }, { phoneNumber: body.phoneNumber }],
			},
			select: {
				id: true,
				migrationInfo: true,
				emailVerificationStatus: true,
				deviceInfo: true,
				userSecuritySetting: {
					select: {
						twofaSecurityActive: true,
						emailSecurityActive: true,
						smsSecurityActive: true,
					},
				},
				deletedAt: true,
			},
		});

		if (!user) {
			setError(ctx, 404, "USER_NOT_FOUND");
			return;
		}
		const ipAddress = ctx.request.header["cf-connecting-ip"] ?? "Unknown";

		if (user.deviceInfo?.lastLoginIp && user.deviceInfo?.lastLoginIp !== ipAddress) {
			const notificationData = {
				to: user.id,
				content: {
					title: NOTIFICATION_TITLES.LOGIN_FROM_NEW_IP,
					params: { ipAddress },
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
				newUserNotification: true,
			};

			await _sendNotifications(notificationData);
		}

		if (checkDeleted(user)) {
			setError(ctx, 404, "DELETED_USER");
			return;
		}

		if (
			!user?.migrationInfo?.migrated &&
			user?.migrationInfo?.legacy_user &&
			user?.migrationInfo?.migrationProcess === "Done"
		) {
			ctx.body.data = { legacyUser: true };
			ctx.body.message = "ok";
			ctx.status = 200;
			return next();
		}

		let kcUser = await kcAdminClient.users.findOne({ id: user.id });

		if (!user.emailVerificationStatus) {
			await kcAdminClient.users.update(
				{ id: kcUser.id },
				{
					enabled: true,
				}
			);

			await login(username, body.password);

			await kcAdminClient.users.update(
				{ id: kcUser.id },
				{
					enabled: false,
				}
			);

			kcUser = await kcAdminClient.users.findOne({ id: user.id });

			if (!kcUser.enabled) {
				const transactionId = generateRandomUuid.v4();
				const userId = user.id;
				const ip = ctx.request.header["cf-connecting-ip"];
				await sendOtp({ ...body, type: "register", language: ctx.request.headers.lang, userId, ip });
				await setTransaction({ userId, transactionId, type: "operation", val: JSON.stringify(body) });

				const notVerifiedUser = {
					transactionId,
					verifyStatus: false,
				};

				ctx.body.data = notVerifiedUser;
				ctx.status = 200;

				await kcAdminClient.users.update(
					{ id: kcUser.id },
					{
						enabled: false,
					}
				);

				return next();
			}

			await kcAdminClient.users.update(
				{ id: kcUser.id },
				{
					enabled: false,
				}
			);
		}

		const tokenResponse = await login(username, body.password);

		if (tokenResponse.accessToken) {
			if (
				user.userSecuritySetting?.twofaSecurityActive ||
				user.userSecuritySetting?.emailSecurityActive ||
				user.userSecuritySetting?.smsSecurityActive
			) {
				ctx.body.data = user.userSecuritySetting;
				const transactionId = generateRandomUuid.v4();
				const userId = user.id;
				await setTransaction({ userId, transactionId, type: "operation", val: JSON.stringify(tokenResponse) });
				ctx.body.data.transactionId = transactionId;
			} else {
				ctx.body.data = tokenResponse;
			}

			ctx.status = 200;
		}
	} catch (error) {
		console.error(error);

		if (error.response?.data?.error === "invalid_grant") {
			setError(ctx, 401, "INVALID_CREDENTIALS");
			return;
		}

		setError(ctx, 400, "USER_NOT_VERIFIED");
		return;
	}

	return next();
}

const confirmLoginSchema = Joi.object({
	email: Joi.string().regex(new RegExp(REGEXP_EMAIL)),
	phoneNumber: Joi.string().regex(new RegExp(REGEXP_PHONE_NUMBER)),
	emailCode: Joi.string().optional(),
	smsCode: Joi.string().optional(),
	twofaCode: Joi.string().optional(),
	transactionId: Joi.string().required(),
})
	.oxor("phoneNumber", "email")
	.error(new Joi.ValidationError(`phoneNumber or email required otp  required`));

async function confirmLogin(ctx, next) {
	const body = Joi.attempt(
		{ ...ctx.request.params, ...ctx.request.body, transactionId: ctx.request.headers["x-transaction-id"] },
		confirmLoginSchema
	);
	const transactionId = body.transactionId;
	const userId = ctx.request.auth?.userId ?? ctx.request.user.id;

	try {
		const tokenResponse = await redis.get(getTransectionKey({ userId, transactionId, type: "operation" }));

		if (!tokenResponse) {
			setError(ctx, 401, "TOKEN_EXPIRED");
			return;
		}

		ctx.body.data = JSON.parse(tokenResponse);
		redis.del(getTransectionKey({ userId, transactionId, type: "operation" }));

		await dbClient.user.update({
			where: { id: userId },
			data: {
				deletedAt: null,
				deviceInfo: {
					...ctx.request.user?.deviceInfo,
					lastLoginIp: ctx.request.header["cf-connecting-ip"] ?? "Unknown",
					lastLoginDate: new Date(),
				},
			},
		});

		ctx.body.message = "ok";
		ctx.status = 200;
	} catch (error) {
		console.log(error);
		if (error.response.data.error === "invalid_grant") {
			setError(ctx, 401, "INVALID_CREDENTIALS");
			return;
		}
		setError(ctx, 400, "USER_NOT_VERIFIED");
		return;
	}

	return next();
}

const router = Router();

router.post("/login", rateLimit("/login"), getUserSecuritySettings);
router.post("/login/:method/request", rateLimit("/login/method/request"), sendOtpCode);
router.post("/login/confirm", rateLimit("/login/confirm"), injectUserByIdentity, otpProtection, confirmLogin);
module.exports = router;
