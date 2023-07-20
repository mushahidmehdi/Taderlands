const Router = require("koa-router");
const Joi = require("joi");

const { dbClient } = require("@paratica/common/prisma");
const rateLimit = require("@backend/common/middlewares/rateLimit");

const { mqConnectionEmitter, createChannelWrapper, publishMessage } = require("@backend/common/services/rabbitmq");

const i18n = require("@backend/common/services/i18n");

const SUBCRIPTION_TYPES = {
	SUBCRIBE: "subscribe",
	UNSUBCRIBE: "unsubscribe",
};

mqConnectionEmitter.on("connected", () => {
	createChannelWrapper({
		name: "subcribe",
		exchange: "notification",
		queue: "notification_queue_notification",
		routingKey: "notification.subscribe",
	});

	createChannelWrapper({
		name: "unsubscribe",
		exchange: "notification",
		queue: "notification_queue_notification",
		routingKey: "notification.unsubscribe",
	});
});

function changeSubcribe(params) {
	const { type, userId, token, language } = params;

	i18n.setLocale(language);

	return publishMessage(type, {
		userId,
		token,
	});
}

const deviceInfoSchema = Joi.object({
	type: Joi.string()
		.required()
		.allow({ values: Object.values(SUBCRIPTION_TYPES) }),
	android: Joi.object().optional({
		fcmToken: Joi.string().optional(),
		data: Joi.object().optional().allow(""),
	}),
	ios: Joi.object().optional({
		fcmToken: Joi.string().optional(),
		data: Joi.object().optional().allow(""),
	}),
}).error(new Joi.ValidationError("DeviceInfoSchema validation error"));

async function updateDeviceInfo(ctx, next) {
	const body = Joi.attempt(ctx.request.body, deviceInfoSchema);
	const userId = ctx.request.auth.userId;

	const currentDeviceInfo = await dbClient.user.findUnique({
		where: {
			id: userId,
		},
		select: {
			deviceInfo: true,
		},
	});

	const deviceInfo = currentDeviceInfo.deviceInfo;

	const user = await dbClient.user.update({
		where: {
			id: userId,
		},
		data: {
			deviceInfo: { ...deviceInfo, ...body },
		},
		include: {
			userNotificationSetting: true,
		},
	});

	if (body.android?.fcmToken) {
		const params = {
			type: body.type,
			userId,
			token: body.android.fcmToken,
			language: user.userNotificationSetting.language,
		};

		await changeSubcribe(params);
	}
	if (body.ios?.fcmToken) {
		const params = {
			type: body.type,
			userId,
			token: body.ios.fcmToken,
			language: user.userNotificationSetting.language,
		};

		await changeSubcribe(params);
	}

	ctx.body.message = "ok";
	ctx.status = 200;

	return next();
}

async function getDeviceInfo(ctx, next) {
	const userId = ctx.request.auth.userId;

	const deviceInfo = await dbClient.user.findUnique({
		where: {
			id: userId,
		},
		select: {
			deviceInfo: true,
		},
	});

	ctx.body.data = deviceInfo;
	ctx.status = 200;

	return next();
}

const router = Router();

router.patch("/device-info", rateLimit("/device-info/patch"), updateDeviceInfo);
router.get("/device-info", rateLimit("/device-info/get"), getDeviceInfo);

module.exports = router;
