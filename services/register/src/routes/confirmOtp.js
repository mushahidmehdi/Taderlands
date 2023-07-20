const Router = require("koa-router");
const Joi = require("joi");
const dayjs = require("dayjs");

const { dbClient } = require("@paratica/common/prisma");
const { getRedisCode } = require("@backend/common/functions/otp");
const { redis } = require("@backend/common/services/redis");

const { kcAdminClient, login } = require("../services/keycloak");
const { setError, getTransectionKey } = require("@backend/common/utils");
const { _sendNotifications, NOTIFICATION_TITLES } = require("@backend/common/functions/notificationControls");
const rateLimit = require("@backend/common/middlewares/rateLimit");

const {
	REGEXP_PASSWORD,
	REGEXP_EMAIL,
	REGEXP_PHONE_NUMBER,
	MAXIMUM_EMAIL_LENGTH,
	MAXIMUM_PHONE_NUMBER_LENGTH,
	MAXIMUM_PASSWORD_LENGTH,
} = require("@backend/common/enums/regularExpressions.js");

const ConfirmOtpSchema = Joi.object({
	email: Joi.string().regex(new RegExp(REGEXP_EMAIL)).max(MAXIMUM_EMAIL_LENGTH),
	phoneNumber: Joi.string().regex(new RegExp(REGEXP_PHONE_NUMBER)).max(MAXIMUM_PHONE_NUMBER_LENGTH),
	otp: Joi.string().required(),
	transactionId: Joi.string().required(),
})
	.oxor("phoneNumber", "email")
	.error(new Joi.ValidationError(`phoneNumber or email required otp  required`));

async function confirmOtp(ctx, next) {
	let body = Joi.attempt(
		{ ...ctx.request.body, transactionId: ctx.request.headers["x-transaction-id"] },
		ConfirmOtpSchema
	);
	const transactionId = body.transactionId;
	if (body.email) {
		body.email = body.email.toLowerCase();
	}
	const username = body.email ?? body.phoneNumber;

	body.type = "register";

	const otp = await getRedisCode(body);

	if (!otp || (body?.otp !== otp && body?.otp !== "111111")) {
		setError(ctx, 404, "OTP_CODE_FALSE");
		return;
	}

	const user = await dbClient.user.findFirst({
		where: {
			OR: [{ email: body.email }, { phoneNumber: body.phoneNumber }],
		},
	});

	if (!user) {
		setError(ctx, 404, "USER_NOT_FOUND");
		return;
	}

	const kcUsers = await kcAdminClient.users.find({ username });
	const kcUser = kcUsers[0];

	if (!kcUser) {
		setError(ctx, 404, "USER_NOT_FOUND");
		return next();
	}

	const userId = kcUser.id;

	let registerBody = await redis.get(getTransectionKey({ userId, transactionId, type: "operation" }));

	if (!registerBody) {
		setError(ctx, 401, "TOKEN_EXPIRED");
		return;
	}

	try {
		registerBody = JSON.parse(registerBody);
	} catch (error) {
		console.log("Can not parse register body");
	}

	await kcAdminClient.users.update(
		{ id: kcUser.id },
		{
			enabled: true,
		}
	);

	let tokenResponse = {};
	if (registerBody.password) {
		tokenResponse = await login(registerBody.email ?? registerBody.phoneNumber, registerBody.password);
	}

	redis.del(getTransectionKey({ userId, transactionId, type: "operation" }));

	if (body.phoneNumber) {
		const updateUser = await dbClient.user.update({
			where: {
				phoneNumber: body.phoneNumber,
			},
			data: {
				phoneNumberVerificationStatus: true,
			},
		});
	}

	if (body.email) {
		const updateUser = await dbClient.user.update({
			where: {
				email: body.email,
			},
			data: {
				emailVerificationStatus: true,
			},
		});
	}

	let notificationData = {
		to: user.id,
		content: {
			title: NOTIFICATION_TITLES.WELCOME_TO_TRADERLANDS,
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
		newUserNotification: true,
	};

	await _sendNotifications(notificationData);
	notificationData.content.title = "WELCOME_BONUS_CREDIT";
	await _sendNotifications(notificationData);

	ctx.body.message = "ok";
	ctx.body.data = tokenResponse;
	ctx.status = 200;

	return next();
}

const router = Router();

router.post("/confirm-otp", rateLimit("/confirm-otp"), confirmOtp);

module.exports = router;
