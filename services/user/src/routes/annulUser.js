const Router = require("koa-router");
const Joi = require("joi");
const generateRandomUuid = require("uuid");

const { dbClient } = require("@paratica/common/prisma");

const { sendOtpCode } = require("@backend/common/middlewares/sendOtpCode");
const { setTransaction } = require("@backend/common/functions/otp");
const { protectedRoutes } = require("@backend/common/enums/otp");
const { otpProtection } = require("@backend/common/middlewares/otpProtection");
const passwordProtection = require("@backend/common/middlewares/passwordProtection");
const { REGEXP_PASSWORD, MAXIMUM_PASSWORD_LENGTH } = require("@backend/common/enums/regularExpressions.js");
const rateLimit = require("@backend/common/middlewares/rateLimit");

const confirmDeleteUserSchema = Joi.object({
	reason: Joi.string().required(),
}).error(new Joi.ValidationError(`confirmWithdrawalSchema type error`));

async function confirmDeleteUser(ctx, next) {
	const body = Joi.attempt(ctx.request.body, confirmDeleteUserSchema);
	const userId = ctx.request.auth.userId;

	let user = await dbClient.user.findUnique({
		where: { id: userId },
		select: {
			deleteReason: true,
		},
	});

	const deleteReason = user.deleteReason;

	deleteReason.push({
		reason: body.reason,
		deletedAt: new Date(),
	});

	user = await dbClient.user.update({
		where: { id: userId },
		data: {
			deletedAt: new Date(),
			deleteReason,
		},
	});

	ctx.body.data = { user };
	ctx.body.status = 200;

	return next();
}

const startDeleteUserSchema = Joi.object({
	operation: Joi.object({
		path: Joi.string()
			.required()
			.valid(...protectedRoutes),
		body: Joi.object({
			reason: Joi.string().required(),
		}).required(),
		method: Joi.string().required(),
	}).required(),
	password: Joi.string().optional().regex(new RegExp(REGEXP_PASSWORD)).max(MAXIMUM_PASSWORD_LENGTH),
}).error(new Joi.ValidationError(`startDeleteUserProcessSchema type`));

async function startDeleteUser(ctx, next) {
	const body = Joi.attempt(ctx.request.body, startDeleteUserSchema);
	const userId = ctx.request.auth.userId;

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

const router = Router();

router.post("/annul/start", rateLimit("/annul/start"), passwordProtection, startDeleteUser);
router.post("/annul/:method/request", rateLimit("/annul/method/request"), sendOtpCode);
router.patch("/annul/confirm", rateLimit("/annul/confirm"), otpProtection, confirmDeleteUser);

module.exports = router;
