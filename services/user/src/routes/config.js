const Router = require("koa-router");
const Joi = require("joi");
const { dbClient } = require("@paratica/common/prisma");
const rateLimit = require("@backend/common/middlewares/rateLimit");

async function getVersionInfo(ctx, next) {
	const versionInfo = await dbClient.config.findFirst({
		where: {
			title: "VERSION_INFO",
		},
	});

	ctx.body.data = { versionInfo };
	ctx.status = 200;

	return next();
}

const updateVersionInfoSchema = Joi.object({
	title: Joi.string().required(),
	data: Joi.object({ versionInfo: Joi.string().required() }).required(),
}).error(new Joi.ValidationError(` type error`));

async function updateVersionInfo(ctx, next) {
	const body = Joi.attempt(ctx.request.body, updateVersionInfoSchema);

	const versionInfo = await dbClient.config.update({
		where: {
			title: body.title,
		},
		data: {
			...body,
		},
		select: {
			data: true,
		},
	});

	ctx.body.message = "ok";
	ctx.body.data = { versionInfo };
	ctx.status = 200;

	return next();
}

const postVersionInfoSchema = Joi.object({
	title: Joi.string().required(),
	data: Joi.object({ versionInfo: Joi.string().required() }).required(),
}).error(new Joi.ValidationError(` type error`));

async function createVersionInfo(ctx, next) {
	const body = Joi.attempt(ctx.request.body, postVersionInfoSchema);

	const versionInfo = await dbClient.config.create({
		data: {
			...body,
		},
	});

	ctx.body.message = "ok";
	ctx.body.data = { versionInfo };
	ctx.status = 200;

	return next();
}

const router = Router();

router.get("/version-info", rateLimit("/version-info/get"), getVersionInfo);
router.post("/version-info", rateLimit("/version-info/post"), createVersionInfo);
router.put("/version-info", rateLimit("/version-info/post"), updateVersionInfo);

module.exports = router;
