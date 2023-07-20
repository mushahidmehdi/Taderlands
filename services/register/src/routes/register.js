const Router = require("koa-router");
const Joi = require("joi");
const generateRandomUuid = require("uuid");

const { dbClient } = require("@paratica/common/prisma");

const { checkDeleted } = require("@backend/common/services/user");
const { sendOtp, setTransaction } = require("@backend/common/functions/otp");
const checkCaptcha = require("@backend/common/functions/checkCaptcha");

const rateLimit = require("@backend/common/middlewares/rateLimit");

const { setError } = require("@backend/common/utils");

const {
	REGEXP_PASSWORD,
	REGEXP_EMAIL,
	REGEXP_PHONE_NUMBER,
	MAXIMUM_EMAIL_LENGTH,
	MAXIMUM_PHONE_NUMBER_LENGTH,
	MAXIMUM_PASSWORD_LENGTH,
} = require("@backend/common/enums/regularExpressions.js");

const { kcAdminClient } = require("../services/keycloak");

const USER_MAXIMUM_REFERENCE_INVITEE_COUNT = 100000;
const NEW_USER_BONUS_BALANCE = 10;

const registerSchema = Joi.object({
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
	referenceCode: Joi.string().optional(),
	password: Joi.string()
		.required()
		.regex(new RegExp(REGEXP_PASSWORD))
		.max(MAXIMUM_PASSWORD_LENGTH)
		.error(new Joi.ValidationError(`Password is too long (longer than ${MAXIMUM_PASSWORD_LENGTH} characters).`)),
	notificationAgreement: Joi.boolean().optional().default(false),
	captcha: Joi.string().max(2000).error(new Joi.ValidationError("Captcha is invalid.")), // TODO: max length should be checked
	mobileToken: Joi.string()
		.valid(process.env.MOBILE_TOKEN)
		.error(new Joi.ValidationError("Mobile token is invalid.")),
})
	.xor("email", "phoneNumber")
	.xor("captcha", "mobileToken");

async function register(ctx, next) {
	let body = Joi.attempt(ctx.request.body, registerSchema);

	if (body?.captcha) {
		if (!(await checkCaptcha(body?.captcha))) {
			setError(ctx, 400, "CAPTCHA_INVALID");

			return;
		}
	}

	try {
		if (body.email) {
			body.email = body.email.toLowerCase();
		}

		const username = body.email ?? body.phoneNumber;
		let referenceCode;

		const existingUser = await dbClient.user.findFirst({
			where: {
				OR: [{ email: body.email }, { phoneNumber: body.phoneNumber }],
			},
		});

		if (checkDeleted(user)) {
			setError(ctx, 404, "DELETED_USER");
			return;
		}

		if (
			!existingUser?.migrationInfo?.migrated &&
			existingUser?.migrationInfo?.legacy_user &&
			existingUser?.migrationInfo?.migrationProcess === "Done"
		) {
			ctx.body.data = { legacyUser: true };
			ctx.body.message = "ok";
			ctx.status = 200;
			return next();
		}

		if (existingUser) {
			setError(ctx, 400, "SHOULD_LOGIN");
			return;
		}

		if (body.referenceCode) {
			referenceCode = await dbClient.referenceCode.findUnique({
				where: {
					code: body.referenceCode,
				},
				include: { _count: { select: { usedBy: true } }, owner: true },
			});

			if (!referenceCode) {
				setError(ctx, 400, "REFERENCE_CODE_NOT_FOUND");
				return;
			}
		}

		const userArray = await kcAdminClient.users.find({ username });
		let user = userArray[0];

		if (!user) {
			user = await kcAdminClient.users.create({
				username,
				email: body.email?.trim(),
				emailVerified: true,
				enabled: false,
				attributes: {
					phoneNumber: body.phoneNumber?.trim(),
				},
			});
		}

		const baseFees = {
			profitFee: parseFloat(process.env.USER_BASE_PROFIT_FEE),
			volumeFee: parseFloat(process.env.USER_BASE_VOLUME_FEE),
		};

		const newUser = await dbClient.user.create({
			data: {
				id: user.id,
				phoneNumber: body.phoneNumber?.trim(),
				email: body.email?.trim(),
				baseFees,
				...(referenceCode?.id && { usedReferenceCodeId: referenceCode?.id }),
				userSecuritySetting: {
					create: {
						createdBy: process.env.ZERO_VALUE_USER_ID,
						...(body.email && { emailSecurityActive: true }),
						...(body.phoneNumber && { smsSecurityActive: true }),
					},
				},
				deviceInfo: { registerIp: ctx.request.header["cf-connecting-ip"] ?? "Unknown" },
				maximumReferenceInviteeCount: USER_MAXIMUM_REFERENCE_INVITEE_COUNT,
			},
			select: {
				phoneNumber: true,
				email: true,
				usedReferenceCodeId: true,
			},
		});

		await kcAdminClient.users.resetPassword({
			id: user.id,
			credential: {
				temporary: false,
				type: "password",
				value: body.password.trim(),
			},
		});

		const notificationAgreement = body.notificationAgreement;

		const notificationSettingData = {
			language: "en",
			emailNotification: notificationAgreement,
			smsNotification: notificationAgreement,
			telegramNotification: notificationAgreement,
			appNotification: notificationAgreement,
			emailNotificationSettings: {
				wallet: notificationAgreement,
				accountCenter: notificationAgreement,
				marketing: notificationAgreement,
				positionNotification: notificationAgreement,
			},
			smsNotificationSettings: {
				wallet: notificationAgreement,
				accountCenter: notificationAgreement,
				marketing: notificationAgreement,
				positionNotification: notificationAgreement,
			},
			telegramNotificationsSettings: {
				wallet: notificationAgreement,
				accountCenter: notificationAgreement,
				marketing: notificationAgreement,
				positionNotification: notificationAgreement,
			},
			appNotificationSettings: {
				wallet: notificationAgreement,
				accountCenter: notificationAgreement,
				marketing: notificationAgreement,
				positionNotification: notificationAgreement,
			},
			positionNotificationSettings: {
				newPosition: notificationAgreement,
				buySell: notificationAgreement,
				stopLoss: notificationAgreement,
				takeProfit: notificationAgreement,
				trailingStop: notificationAgreement,
				stickers: notificationAgreement,
			},
		};

		await dbClient.notificationSetting.create({
			data: {
				...notificationSettingData,
				createdBy: user.id,
				user: {
					connect: {
						id: user.id,
					},
				},
			},
		});

		const bonusWalletTransactionData = {
			receiverId: user.id,
			source: "SYSTEM",
			amount: NEW_USER_BONUS_BALANCE,
			status: "DONE",
			type: "BONUS",
			data: {},
		};

		const bonusWalletTransaction = await dbClient.walletTransaction.create({
			data: {
				...bonusWalletTransactionData,
				createdBy: user.id,
			},
		});
		const userId = user.id;
		const ip = ctx.request.header["cf-connecting-ip"];
		await sendOtp({ ...body, type: "register", language: ctx.request.headers.lang, userId, ip });

		ctx.body.message = "ok";
		ctx.body.data = newUser;

		const transactionId = generateRandomUuid.v4();
		await setTransaction({ userId, transactionId, type: "operation", val: JSON.stringify(body) });
		ctx.body.data.transactionId = transactionId;

		ctx.status = 200;
	} catch (error) {
		console.log(error);

		setError(ctx, 404, "USER_NOT_VERIFIED");
		return;
	}

	return next();
}

async function healthcheck(ctx, next) {
	ctx.body = "ok";
	ctx.status = 200;

	return next();
}

const router = Router();

router.post("/register", rateLimit("/register"), register);

router.get("/health-check", rateLimit("/health-check"), healthcheck);

module.exports = router;
