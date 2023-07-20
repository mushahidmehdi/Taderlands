const { redis } = require("../services/redis");
const { dbClient } = require("@paratica/common/prisma");
const Joi = require("joi");

const { setError, getTransectionKey } = require("@backend/common/utils");
const { sendOtpforTransaction } = require("@backend/common/functions/otp");
const { REGEXP_EMAIL, REGEXP_PHONE_NUMBER } = require("@backend/common/enums/regularExpressions.js");

const sendOtpCodeSchema = Joi.object({
	email: Joi.string().optional().regex(new RegExp(REGEXP_EMAIL)),
	method: Joi.string().required().valid("phoneNumber", "email"),
	phoneNumber: Joi.string().optional().regex(new RegExp(REGEXP_PHONE_NUMBER)),
	transactionId: Joi.string().required(),
})
	.oxor("phoneNumber", "email")
	.error(new Joi.ValidationError(`type error`));

async function sendOtpCode(ctx, next) {
	let body = Joi.attempt(
		{ ...ctx.request.params, ...ctx.request.body, transactionId: ctx.request.headers["x-transaction-id"] },
		sendOtpCodeSchema
	);

	if (body.email) {
		body.email = body.email.toLowerCase();
	}

	const user = await dbClient.user.findFirst({
		where: {
			OR: [{ OR: [{ email: body.email }, { phoneNumber: body.phoneNumber }] }, { id: ctx.request.auth?.userId }],
		},
		select: {
			userSecuritySetting: {
				select: {
					twofaSecurityActive: true,
					emailSecurityActive: true,
					smsSecurityActive: true,
				},
			},
			phoneNumber: true,
			email: true,
			id: true,
		},
	});
	if (!user) {
		setError(ctx, 404, "USER_NOT_FOUND");
		return;
	}

	const userId = user.id; // TODO : replace with user.id after id dataType changed

	if (!(await redis.get(getTransectionKey({ userId, transactionId: body.transactionId, type: "operation" })))) {
		setError(ctx, 401, "TRANSACTION_REQUIRED");
		return;
	}

	const METHOD_MAP = {
		email: {
			type: "emailCode",
			email: user.email,
		},
		phoneNumber: {
			type: "smsCode",
			phoneNumber: user.phoneNumber,
		},
	};
	const ip = ctx.request.header["cf-connecting-ip"];
	sendOtpforTransaction({
		transactionId: body.transactionId,
		userId,
		language: ctx.request.headers.lang,
		...METHOD_MAP[body.method],
		ip,
	});

	ctx.body.message = "ok";
	ctx.status = 200;

	return next();
}

module.exports = { sendOtpCode };
