const Router = require("koa-router");
const Joi = require("joi");
const { dbClient } = require("@paratica/common/prisma");
const rateLimit = require("@backend/common/middlewares/rateLimit");

const updateUserAgreementSchema = Joi.object({
	agreements: Joi.object({
		amlDisclaimer: Joi.boolean().optional(),
		userAgreement: Joi.boolean().optional(),
		kycAggrement: Joi.boolean().optional(),
	}).required(),
}).error(new Joi.ValidationError(`updateUserAgreementSchema type error`));

async function updateUserAgreement(ctx, next) {
	const body = Joi.attempt({ ...ctx.request.body }, updateUserAgreementSchema);

	const userId = ctx.request.auth.userId;

	const userAgreement = await dbClient.user.update({
		where: {
			id: userId,
		},
		data: {
			...body,
		},
	});

	ctx.body.data = { userAgreement };
	ctx.status = 200;

	return next();
}

const router = Router();

router.post("/agreement", rateLimit("/agreement/post"), updateUserAgreement);

module.exports = router;
