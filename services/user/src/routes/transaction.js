const Router = require("koa-router");
const Joi = require("joi");
const generateRandomUuid = require("uuid");

const { setTransaction } = require("@backend/common/functions/otp");
const { protectedRoutes } = require("@backend/common/enums/otp");
const { setError } = require("@backend/common/utils");
const rateLimit = require("@backend/common/middlewares/rateLimit");

const passwordProtection = require("../services/passwordProtection");
const { REGEXP_PASSWORD, MAXIMUM_PASSWORD_LENGTH } = require("@backend/common/enums/regularExpressions.js");

const transactionStartSchema = Joi.object({
	operation: Joi.object({
		path: Joi.string()
			.required()
			.valid(...protectedRoutes),
		body: Joi.object().required(),
		method: Joi.string().required(),
	}).required(),
	password: Joi.string().optional().regex(new RegExp(REGEXP_PASSWORD)).max(MAXIMUM_PASSWORD_LENGTH),
}).error(new Joi.ValidationError(`type error`));

async function handler(ctx, next) {
	const userId = ctx.request.auth.userId;
	const body = Joi.attempt(ctx.request.body, transactionStartSchema);

	if (body.operation.path === "/coinspaid/withdrawal/confirm") {
		setError(ctx, 400, "INVALID_OPERATION");
		return;
	}

	const transactionId = generateRandomUuid.v4();

	await setTransaction({
		userId,
		transactionId,
		val: JSON.stringify(body.operation),
		type: "operation",
	});

	ctx.body.message = "ok";
	ctx.body.data = { transactionId };
	ctx.status = 200;

	return next();
}

const router = Router();

router.post("/transaction/start", rateLimit("/transaction/start"), passwordProtection, handler);

module.exports = router;
