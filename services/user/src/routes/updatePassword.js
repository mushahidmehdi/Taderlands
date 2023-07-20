const Router = require("koa-router");
const Joi = require("joi");
const { kcAdminClient } = require("../services/keycloak");
const { otpProtection } = require("@backend/common/middlewares/otpProtection");
const rateLimit = require("@backend/common/middlewares/rateLimit");

const { REGEXP_PASSWORD, MAXIMUM_PASSWORD_LENGTH } = require("@backend/common/enums/regularExpressions.js");

const updatePasswordSchema = Joi.object({
	newPassword: Joi.string().required().regex(new RegExp(REGEXP_PASSWORD)).max(MAXIMUM_PASSWORD_LENGTH),
}).error(new Joi.ValidationError(` type error`));

async function updatePassword(ctx, next) {
	const { newPassword } = Joi.attempt(ctx.request.body, updatePasswordSchema);
	const userId = ctx.request.auth.userId;

	await kcAdminClient.users.resetPassword({
		id: userId,
		credential: {
			temporary: false,
			type: "password",
			value: newPassword,
		},
	});

	ctx.body.message = "ok";
	ctx.status = 200;

	return next();
}

const router = Router();

router.post("/password/update", rateLimit("/password/update"), otpProtection, updatePassword);

module.exports = router;
