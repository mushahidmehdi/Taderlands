const Router = require("koa-router");
const Joi = require("joi");

const { dbClient } = require("@paratica/common/prisma");
const { redis } = require("@backend/common/services/redis");
const { setError } = require("@backend/common/utils");
const { otpProtection } = require("@backend/common/middlewares/otpProtection");
const rateLimit = require("@backend/common/middlewares/rateLimit");

const { getUser } = require("../services/user");
const { kcAdminClient } = require("../services/keycloak");

const updateContactInfoSchema = Joi.object({
	contactInfoKey: Joi.string().required(),
}).error(new Joi.ValidationError("bad request"));

async function updateContactInfo(ctx, next) {
	const body = Joi.attempt(ctx.request.body, updateContactInfoSchema);
	const userId = ctx.request.auth.userId;
	try {
		let contactInfo = await redis.get("contactInfoKey:" + body.contactInfoKey);
		if (!contactInfo) {
			setError(ctx, 406, "CONTACT_INFO_KEY_NOT_FOUND");
			return;
		}

		contactInfo = JSON.parse(contactInfo);
		redis.del("contactInfoKey:" + body.contactInfoKey);

		const { phoneNumber } = contactInfo;

		if (await getUser(contactInfo)) {
			setError(ctx, 409, "IS_ALREADY_EXIST");
			return;
		}

		await dbClient.user.update({
			where: {
				id: userId,
			},
			data: {
				...(phoneNumber ? { phoneNumberVerificationStatus: true, phoneNumber } : {}),
			},
		});

		ctx.body.message = "ok";
		ctx.status = 200;
	} catch (error) {
		console.log(error);
		setError(ctx, 500, "ERROR_RECEIVED_DURING_UPDATE");
		return;
	}

	return next();
}

const router = Router();

router.patch("/contact-info", rateLimit("/contact-info"), otpProtection, updateContactInfo);

module.exports = router;
