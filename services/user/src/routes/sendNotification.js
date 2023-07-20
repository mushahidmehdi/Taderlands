const Router = require("koa-router");
const Joi = require("joi");

const { dbClient } = require("@paratica/common/prisma");
const { redis } = require("@backend/common/services/redis");
const { setError } = require("@backend/common/utils");
const { _sendNotifications, SENDING_REASONS } = require("@backend/common/functions/notificationControls");
const rateLimit = require("@backend/common/middlewares/rateLimit");

const SENDING_TYPES = {
	SINGLE_NOTIFICATION: "singleNotification",
	ALL_USER_NOTIFICATION: "allUserNotification",
	EMAIL_NOTIFICATION: "emailNotification",
	TELEGRAM_NOTIFICATION: "telegramNotification",
};

const REDIS_RATE_LIMITS_CONFIG_TITLE = "NOTIFICATION_RATE_LIMITS";

const notificationSchema = Joi.object({
	to: Joi.string().required(),
	content: Joi.object({
		title: Joi.string().required(),
		params: Joi.object().allow("").optional(),
	}),
	info: Joi.object({
		relation: Joi.string().allow("").optional(),
		reason: Joi.string()
			.allow({ values: Object.values(SENDING_REASONS) })
			.required(),
		notificationType: Joi.string().allow("").optional(),
		triggeredBy: Joi.string().allow("").optional(),
	})
		.allow("")
		.optional(),
	expireAt: Joi.date().optional(),
	imageUrl: Joi.string().uri().allow("").optional(),
	data: Joi.object().required(),
	sendingType: Joi.string()
		.required()
		.allow({ values: Object.values(SENDING_TYPES) }),
	saveToDatabase: Joi.boolean().allow("").optional(),
});

async function sendNotification(ctx, next) {
	const body = Joi.attempt(ctx.request.body, notificationSchema);

	let notificationCount = 0;

	const config = await dbClient.config.findFirst({
		where: {
			title: REDIS_RATE_LIMITS_CONFIG_TITLE,
		},
	});

	if (config.data?.redisConfig[body.content.title]) {
		notificationCount = (await redis.get("userId:" + body.to + ":notificationTitle:" + body.content.title)) || 0;

		const expireTime = config.data?.redisConfig[body.content.title]?.time;

		await redis.set(
			"userId:" + body.to + ":notificationTitle:" + body.content.title,
			notificationCount + 1,
			"EX",
			expireTime
		);
	}

	if (notificationCount >= config.data?.redisConfig[body.content.title]?.limit) {
		setError(ctx, 400, "MAXIMUM_NOTIFICATION_LIMIT_REACHED");
		return;
	}

	const responseData = await _sendNotifications(body);

	ctx.body.message = responseData.text;
	ctx.status = responseData.code;

	return next();
}

const router = Router();

router.post("/notification", rateLimit("/notification"), sendNotification);

module.exports = router;
