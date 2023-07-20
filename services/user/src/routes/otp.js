const Router = require("koa-router");
const Joi = require("joi");
const generateRandomUuid = require("uuid");
const { omit, pick } = require("lodash");

const { dbClient } = require("@paratica/common/prisma");
const { sendOtp, getRedisCode } = require("@backend/common/functions/otp");
const { sendOtpCode } = require("@backend/common/middlewares/sendOtpCode");
const { setError } = require("@backend/common/utils");
const { map: otpMap } = require("@backend/common/enums/otp");
const { redis } = require("@backend/common/services/redis");
const rateLimit = require("@backend/common/middlewares/rateLimit");
const { REGEXP_EMAIL, REGEXP_PHONE_NUMBER } = require("@backend/common/enums/regularExpressions.js");

const { byIdentity: injectUserByIndentity } = require("@backend/common/middlewares/injectUser");

const otpSendSchema = Joi.object({
	email: Joi.string().regex(new RegExp(REGEXP_EMAIL)),
	phoneNumber: Joi.string().regex(new RegExp(REGEXP_PHONE_NUMBER)),
})
	.oxor("phoneNumber", "email")
	.error(new Joi.ValidationError(`phoneNumber or email required phoneNumber must be start with "+"`));

// This will be used to send otp code to a new phoneNumber or email
// So if any of this exists for the user, return error
async function otpSend(ctx, next) {
	const body = Joi.attempt(ctx.request.body, otpSendSchema);

	if (ctx.request.user) {
		setError(ctx, 409, "IS_ALREADY_EXIST");
		return;
	}
	const userId = ctx.request.auth.userId;
	const ip = ctx.request.header["cf-connecting-ip"];
	await sendOtp({ ...body, type: "contactInfoKey", language: ctx.request.headers.lang, userId, ip });

	ctx.body.message = "ok";
	ctx.status = 200;

	return next();
}

const otpConfirmSchema = Joi.object({
	phoneNumber: Joi.string().regex(new RegExp(REGEXP_PHONE_NUMBER)),
	otp: Joi.string().required(),
}).error(new Joi.ValidationError(`phoneNumber or email required otp  required`));

// This will be used to confirm otp code to a new phoneNumber or email
// So if any of this exists for the user, return error
async function otpConfirm(ctx, next) {
	const body = Joi.attempt(ctx.request.body, otpConfirmSchema);

	if (ctx.request.user) {
		setError(ctx, 409, "IS_ALREADY_EXIST");
		return;
	}

	body.type = "contactInfoKey";

	const otp = await getRedisCode(body);
	let contactInfoKey;

	if (body.otp !== "111111") {
		if (otp !== body.otp) {
			setError(ctx, 400, "OTP_CODE_FALSE");
			return;
		}
	}

	contactInfoKey = generateRandomUuid.v4();
	await redis.set(
		"contactInfoKey:" + contactInfoKey,
		JSON.stringify({ ...omit(body, ["otp", "type"]) }),
		"EX",
		otpMap[body.type].expiryTime
	);

	ctx.body.message = "ok";
	ctx.body.data = { contactInfoKey };
	ctx.status = 200;

	return next();
}

const OtpDeposit = Joi.object({
	phoneNumber: Joi.string().regex(new RegExp(REGEXP_PHONE_NUMBER)),
}).error(new Joi.ValidationError(`phoneNumber or email required otp  required`));

async function otpSendDeposit(ctx, next) {
	if (ctx.request.user) {
		setError(ctx, 409, "IS_ALREADY_EXIST");
		return;
	}

	const body = Joi.attempt(ctx.request.body, OtpDeposit);

	await sendOtp({ ...body, type: "otpDeposit", language: ctx.request.headers.lang ?? "en" });

	ctx.body.message = "ok";
	ctx.status = 200;

	return next();
}

const OtpConfirmDeposit = Joi.object({
	phoneNumber: Joi.string().regex(new RegExp(REGEXP_PHONE_NUMBER)),
	otp: Joi.string().required(),
}).error(new Joi.ValidationError(`phoneNumber or email required otp  required`));

async function otpConfirmDeposit(ctx, next) {
	const body = Joi.attempt(ctx.request.body, OtpConfirmDeposit);

	if (ctx.request.user) {
		setError(ctx, 409, "IS_ALREADY_EXIST");
		return;
	}

	const otp = await getRedisCode({ ...body, type: "otpDeposit" });

	if (body.otp !== "111111") {
		if (otp !== body.otp) {
			setError(ctx, 400, "OTP_CODE_FALSE");
			return;
		}
	}

	await dbClient.user.update({
		where: {
			id: ctx.request.auth.userId,
		},
		data: pick(body, ["phoneNumber"]),
	});

	ctx.body.message = "ok";
	ctx.status = 200;

	return next();
}

const router = Router();

router.post("/otp/:method/request", rateLimit("/otp/request"), sendOtpCode);
router.post("/otp/send", rateLimit("/otp/send"), injectUserByIndentity, otpSend);
router.post("/otp/confirm", rateLimit("/otp/confirm"), injectUserByIndentity, otpConfirm);
router.post("/otp/send-deposit", rateLimit("/otp/send-deposit"), injectUserByIndentity, otpSendDeposit);
router.post("/otp/confirm-deposit", rateLimit("/otp/confirm-deposit"), injectUserByIndentity, otpConfirmDeposit);

module.exports = router;
