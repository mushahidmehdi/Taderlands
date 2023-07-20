const Router = require("koa-router");
const Joi = require("joi");

const rateLimit = require("@backend/common/middlewares/rateLimit");
const { dbClient } = require("@paratica/common/prisma");
const { getPaginationQuery } = require("@backend/common/utils");

const getNotificationsSchema = Joi.object({
	notificationType: Joi.string().optional(),
	pageNumber: Joi.number().min(0).optional().default(0),
	pageSize: Joi.number().min(0).max(100).optional().default(100),
}).error(new Joi.ValidationError(`getNotificationsSchema type error`));

async function getNotifications(ctx, next) {
	const userId = ctx.request.auth.userId;
	const body = Joi.attempt(ctx.request.query, getNotificationsSchema);
	const { notificationType, pageNumber, pageSize } = body;

	const notifications = await dbClient.notification.findMany({
		where: {
			userId: userId,
			...(notificationType && {
				info: {
					path: ["notificationType"],
					equals: notificationType,
				},
			}),
		},
		orderBy: {
			createdAt: "desc",
		},
		...getPaginationQuery(pageNumber, pageSize),
	});

	ctx.body.data = { notifications };
	ctx.status = 200;

	return next();
}

async function getNotificationsCount(ctx, next) {
	const userId = ctx.request.auth.userId;

	const notificationsCount =
		await dbClient.$queryRaw`select data->'status' as status, info->'notificationType' as "notificationType", count(1) from notification where user_id = ${userId}::UUID group by data->'status' ,info->'notificationType' `;

	ctx.body.data = notificationsCount?.length
		? {
				notificationsCount: notificationsCount.reduce((acc, curr) => {
					acc[curr.status] = {
						...acc[curr.status],
						[curr.notificationType]: curr.count,
					};
					return acc;
				}, {}),
		  }
		: { notificationsCount: null };
	ctx.status = 200;

	return next();
}

async function getNotification(ctx, next) {
	const { id } = ctx.request.params;

	const notification = await dbClient.notification.findUnique({
		where: {
			id: parseInt(id),
		},
	});

	ctx.body.data = { notification };
	ctx.status = 200;

	return next();
}

const updateNotificationSchema = Joi.object({
	data: Joi.object({
		status: Joi.string(),
	}).required(),
}).error(new Joi.ValidationError(`Update updateNotificationSchema type error`));

async function updateNotification(ctx, next) {
	const userId = ctx.request.auth.userId;

	const { id } = ctx.request.params;
	const { type } = ctx.query;
	const body = Joi.attempt(ctx.request.body, updateNotificationSchema);

	const notifications = await dbClient.notification.updateMany({
		where: {
			userId: userId,
			...(id && { id: parseInt(id) }),
			...(type && {
				info: {
					path: ["type"],
					equals: type,
				},
			}),
		},
		data: {
			...body,
		},
	});

	ctx.body.data = { notifications };
	ctx.status = 200;

	return next();
}

async function getNotificationTypes(ctx, next) {
	const notificationTypes = await dbClient.config.findMany({
		where: {
			title: "NOTIFICATION_TYPES",
		},
	});

	ctx.body.data = { notificationTypes };
	ctx.status = 200;

	return next();
}

const router = Router();
router.get("/notifications", rateLimit("/notifications/get"), getNotifications);
router.get("/notifications/count", rateLimit("/notifications/count"), getNotificationsCount);
router.get("/notification/:id", rateLimit("/notification/id/get"), getNotification);
router.put("/notification/", rateLimit("/notification/put"), updateNotification);
router.put("/notification/:id", rateLimit("/notification/id/put"), updateNotification);
router.get("/notifications/types", rateLimit("/notifications/types"), getNotificationTypes);

module.exports = router;
