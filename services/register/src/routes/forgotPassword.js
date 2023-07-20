const Router = require("koa-router");
const Joi = require("joi");
const dayjs = require("dayjs");
const generateRandomUuid = require("uuid");
const mustache = require("mustache");

const { dbClient } = require("@paratica/common/prisma");

const { redis } = require("@backend/common/services/redis");

const { kcAdminClient, login } = require("../services/keycloak");

const { checkDeleted } = require("@backend/common/services/user");
const { mqConnectionEmitter, createChannelWrapper, publishMessage } = require("@backend/common/services/rabbitmq");
const { _sendNotifications, NOTIFICATION_TITLES } = require("@backend/common/functions/notificationControls");
const { sendEmailNotification } = require("@backend/common/functions/notification");
const checkCaptcha = require("@backend/common/functions/checkCaptcha");

const rateLimit = require("@backend/common/middlewares/rateLimit");

const { setError } = require("@backend/common/utils");

const {
	REGEXP_PASSWORD,
	REGEXP_EMAIL,
	MAXIMUM_EMAIL_LENGTH,
	MINIMUM_PASSWORD_LENGTH,
	MAXIMUM_PASSWORD_LENGTH,
} = require("@backend/common/enums/regularExpressions.js");

const initiateForgotPasswordSchema = Joi.object({
	email: Joi.string()
		.required()
		.regex(new RegExp(REGEXP_EMAIL))
		.max(MAXIMUM_EMAIL_LENGTH)
		.error(
			new Joi.ValidationError(
				`Email address is not valid or too long (longer than ${MAXIMUM_EMAIL_LENGTH} characters).`
			)
		),
	captcha: Joi.string().max(2000).error(new Joi.ValidationError("Captcha is invalid.")), // TODO: max length should be checked
	mobileToken: Joi.string()
		.valid(process.env.MOBILE_TOKEN)
		.error(new Joi.ValidationError("Mobile token is invalid.")),
}).xor("captcha", "mobileToken");

async function initiateForgotPassword(ctx, next) {
	const body = Joi.attempt(ctx.request.body, initiateForgotPasswordSchema);

	const { captcha, email } = body;

	if (body?.captcha) {
		if (!(await checkCaptcha(captcha))) {
			setError(ctx, 400, "CAPTCHA_INVALID");

			return;
		}
	}

	const user = await dbClient.user.findFirst({
		where: {
			email: email.toLowerCase(),
		},
	});

	if (!user) {
		setError(ctx, 400, "USER_NOT_FOUND");
		return;
	}

	if (checkDeleted(user)) {
		setError(ctx, 404, "DELETED_USER");
		return;
	}

	const transactionId = generateRandomUuid.v4();

	const emailKey = `forgot-password:email:${email}`;
	const transactionKey = `forgot-password:transaction-id:${transactionId}`;

	if (await redis.get(emailKey)) {
		ctx.body.message = "We sent you a e-mail.";
		ctx.status = 200;
		return next();
	}

	redis.set(emailKey, transactionId, "EX", 60 * 5);
	redis.set(transactionKey, email, "EX", 60 * 5);

	const notificationTemplate = await dbClient.notificationTemplate.findFirst({
		where: {
			title: NOTIFICATION_TITLES.FORGOT_PASSWORD,
		},
	});

	const params = {
		forgotPasswordUrl: `${process.env.FRONTEND_URL}/forgot-password?fg=${transactionId}`,
	};

	const language = "en";

	const content = {
		subject: mustache.render(notificationTemplate?.subject[language], params),
		body: mustache.render(notificationTemplate?.body[language], params),
	};

	const mailContent = content.body;
	const mailBody = mustache.render(notificationTemplate.htmlCode, { mailContent });

	await sendEmailNotification(email, content.subject, mailBody);

	ctx.status = 200;
	return next();
}

const completeForgotPasswordSchema = Joi.object({
	newPassword: Joi.string()
		.required()
		.min(MINIMUM_PASSWORD_LENGTH)
		.max(MAXIMUM_PASSWORD_LENGTH)
		.regex(new RegExp(REGEXP_PASSWORD))
		.messages({
			"string.empty": "Password should not be empty.",
			"string.min": `Password should be longer than ${MAXIMUM_PASSWORD_LENGTH} characters.`,
			"string.max": `Password should not be longer than ${MAXIMUM_PASSWORD_LENGTH} characters.`,
			"any.required": "Password is required.",
			"object.regex":
				"Password should contain uppercase and lowercase letters. Password should contain numbers. Password should contain some special characters (.#?!@$%^&*-).",
			"string.pattern.base":
				"Password should contain uppercase and lowercase letters. Password should contain numbers. Password should contain some special characters (.#?!@$%^&*-).",
		}),
	confirmPassword: Joi.any()
		.equal(Joi.ref("newPassword"))
		.required()
		.error(new Joi.ValidationError(`Confirm password is not correct.`)),
	captcha: Joi.string().required().max(2000).error(new Joi.ValidationError("Captcha is too long or does not exist.")),
	transactionId: Joi.string().required().error(new Joi.ValidationError("Transaction is not valid.")),
	mobileToken: Joi.string()
		.valid(process.env.MOBILE_TOKEN)
		.error(new Joi.ValidationError("Mobile token is invalid.")),
}).xor("captcha", "mobileToken");
async function completeForgotPassword(ctx, next) {
	const body = Joi.attempt(ctx.request.body, completeForgotPasswordSchema);

	if (body?.captcha) {
		if (!(await checkCaptcha(body.captcha))) {
			setError(ctx, 400, "CAPTCHA_INVALID");
			return;
		}
	}

	const { transactionId } = body;
	const transactionKey = `forgot-password:transaction-id:${transactionId}`;

	const email = await redis.get(transactionKey);

	if (!email) {
		setError(ctx, 400, "VALIDATION_EXPIRED");
		return;
	}

	const user = await dbClient.user.findFirst({
		where: {
			email,
		},
	});

	if (!user) {
		setError(ctx, 400, "USER_NOT_FOUND");
		return;
	}

	const { migrationInfo, id } = user;

	await dbClient.user.update({
		where: { id },
		data: { emailVerificationStatus: true },
	});

	await kcAdminClient.users.update(
		{ id },
		{
			enabled: true,
		}
	);

	await kcAdminClient.users.resetPassword({
		id,
		credential: {
			temporary: false,
			type: "password",
			value: body.newPassword,
		},
	});

	if (!migrationInfo?.migrated && migrationInfo?.migrationProcess === "Done") {
		const notificationData = {
			to: id,
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

		await dbClient.user.update({
			where: { id },
			data: { migrationInfo: { ...migrationInfo, migrated: true } },
		});
	}

	const redisKey = `forgot-password:email:${email}`;

	redis.del(redisKey);
	redis.del(transactionKey);

	const tokenResponse = await login(email, body.newPassword);

	ctx.status = 200;
	ctx.body.data = tokenResponse;
	return next();
}

const router = Router();

router.post("/forgot-password/initiate", rateLimit("/forgot-password"), initiateForgotPassword);
router.post("/forgot-password/complete", rateLimit("/forgot-password"), completeForgotPassword);

module.exports = router;
