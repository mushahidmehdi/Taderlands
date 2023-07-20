const Router = require("koa-router");
const Joi = require("joi");

const { dbClient } = require("@paratica/common/prisma");
const rateLimit = require("@backend/common/middlewares/rateLimit");

const LANGUAGE_LIST = ["en", "tr"];

async function getNotificationSetting(ctx, next) {
	const userId = ctx.request.auth.userId;

	const notificationSetting = await dbClient.notificationSetting.findUnique({
		where: {
			userId: userId,
		},
	});

	ctx.body.data = { notificationSetting };
	ctx.status = 200;

	return next();
}

const updateNotificationSettingSchema = Joi.object({
	language: Joi.string()
		.optional()
		.valid(...LANGUAGE_LIST),
	emailNotification: Joi.boolean(),
	smsNotification: Joi.boolean(),
	telegramNotification: Joi.boolean(),
	appNotification: Joi.boolean(),
	emailNotificationSettings: Joi.object({
		wallet: Joi.boolean(),
		accountCenter: Joi.boolean(),
		marketing: Joi.boolean(),
		positionNotification: Joi.boolean(),
	}).optional(),
	smsNotificationSettings: Joi.object({
		wallet: Joi.boolean(),
		accountCenter: Joi.boolean(),
		marketing: Joi.boolean(),
		positionNotification: Joi.boolean(),
	}).optional(),
	telegramNotificationsSettings: Joi.object({
		wallet: Joi.boolean(),
		accountCenter: Joi.boolean(),
		marketing: Joi.boolean(),
		positionNotification: Joi.boolean(),
	}).optional(),
	appNotificationSettings: Joi.object({
		wallet: Joi.boolean(),
		accountCenter: Joi.boolean(),
		marketing: Joi.boolean(),
		positionNotification: Joi.boolean(),
	}).optional(),
	positionNotificationSettings: Joi.object({
		newPosition: Joi.boolean(),
		buySell: Joi.boolean(),
		stopLoss: Joi.boolean(),
		takeProfit: Joi.boolean(),
		trailingStop: Joi.boolean(),
		stickers: Joi.boolean(),
	}).optional(),
}).error(new Joi.ValidationError(`updateNotificationSettingSchema type error`));

async function updateNotificationSetting(ctx, next) {
	const userId = ctx.request.auth.userId;

	const body = Joi.attempt(ctx.request.body, updateNotificationSettingSchema);

	const notificationSetting = await dbClient.notificationSetting.upsert({
		where: {
			userId,
		},
		update: { ...body },
		create: {
			...body,
			createdBy: userId,
			user: {
				connect: {
					id: userId,
				},
			},
		},
	});

	ctx.body.data = { notificationSetting };
	ctx.status = 200;

	return next();
}

const router = Router();
router.get("/notification-setting", rateLimit("/notification-setting/get"), getNotificationSetting);
router.patch("/notification-setting", rateLimit("/notification-setting/patch"), updateNotificationSetting);

module.exports = router;
