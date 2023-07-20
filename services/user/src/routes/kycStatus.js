const Router = require("koa-router");
const { dbClient } = require("@paratica/common/prisma");
const Joi = require("joi");

const kycStatusSchema = Joi.object({
	kycStatus: Joi.string().valid("pending", "false", "true").required(),
}).error(new Joi.ValidationError(` type error`)); //TODO need to better error message

async function postKYCStatus(ctx, next) {
	const body = Joi.attempt(ctx.request.body, kycStatusSchema);

	const userId = ctx.request.auth.userId;
	user = await dbClient.userSecuritySetting.upsert({
		where: {
			user: {
				id: userId,
			},
		},
		update: {
			kycStatus: body.kycStatus,
		},
		create: {
			userId: userId,
			kycStatus: body.kycStatus,
			createdBy: userId,
		},
		select: {
			kycStatus: true,
		},
	});

	ctx.body.message = "ok";
	ctx.body.data = { user };
	ctx.status = 200;

	return next();
}

async function getKYCStatus(ctx, next) {
	const userId = ctx.request.auth.userId;

	const securityOptions = await dbClient.userSecuritySetting.findFirst({
		where: {
			user: {
				id: userId,
			},
		},
		select: {
			kycStatus: true,
		},
	});

	ctx.body.data = securityOptions;
	ctx.status = 200;

	return next();
}

const router = Router();

router.post("/kyc-status", postKYCStatus);
router.get("/kyc-status", getKYCStatus);

module.exports = router;
