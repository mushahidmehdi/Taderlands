const Router = require("koa-router");
const router = Router();
const Joi = require("joi");
const { omit } = require("lodash");
const dayjs = require("dayjs");

const { dbClient } = require("@paratica/common/prisma");

const rateLimit = require("@backend/common/middlewares/rateLimit");
const { removeByPrefix } = require("@backend/common/services/redis");
const { getPaginationQuery } = require("@backend/common/utils");
const { setError } = require("@backend/common/utils");
const { _sendNotifications, NOTIFICATION_TITLES } = require("@backend/common/functions/notificationControls");

const { STATUS_TYPES } = require("../constants");
const { MerchantStatus, UpdateMerchant, CreateMerchant } = require("../models/merchant");

const MERCHANT_STATUS_MAIL_TEMPLATE_MAP = {
	[STATUS_TYPES.ACCEPTED]: "MERCHANT_ACCEPTED",
	[STATUS_TYPES.REJECTED]: "MERCHANT_REJECTED",
	[STATUS_TYPES.PENDING]: "MERCHANT_PENDING",
};

const getMerchantsSchema = Joi.object({
	search: Joi.string().allow("").optional(),
	status: Joi.string().optional(),
	pageNumber: Joi.number().min(0).optional().default(0),
	pageSize: Joi.number().min(0).max(100).optional().default(100),
}).error(new Joi.ValidationError(`getMerchantsSchema type error`));

async function getMerchants(ctx, next) {
	const body = Joi.attempt(ctx.request.query, getMerchantsSchema);
	const { search, pageNumber, pageSize } = body;

	let merchants = await dbClient.merchant.findMany({
		where: {
			progressStatus: STATUS_TYPES.ACCEPTED,
			...(search
				? {
						OR: [
							{
								nickname: {
									contains: `%${search}%`,
									mode: "insensitive",
								},
							},
							{
								marketStrategies: {
									some: {
										name: {
											contains: `%${search}%`,
											mode: "insensitive",
										},
									},
								},
							},
						],
				  }
				: {}),
		},
		include: {
			merchantStatistics: true,
			merchantCampaignProfit: true,
		},
		...getPaginationQuery(pageNumber, pageSize),
	});

	merchants = merchants.map((merchant) => {
		merchant = omit(merchant, ["name", "surname", "email", "phoneNumber"]);

		return merchant;
	});

	ctx.body.data = { merchants };
	ctx.status = 200;

	return next();
}

async function getMerchant(ctx, next) {
	const { id } = ctx.request.params;

	const merchant = await dbClient.merchant.findUnique({
		where: {
			id: parseInt(id),
		},
		include: {
			merchantStatistics: true,
			merchantCampaignProfit: true,
		},
	});

	const { userId } = ctx.request.auth;

	ctx.body.data = {
		merchant: merchant.userId !== userId ? omit(merchant, ["name", "surname", "email", "phoneNumber"]) : merchant,
	};
	ctx.status = 200;

	return next();
}

async function getMerchantSelf(ctx, next) {
	const { userId } = ctx.request.auth;

	const merchant = await dbClient.merchant.findFirst({
		where: {
			user: {
				id: userId,
			},
		},
		include: {
			merchantStatistics: true,
			merchantCampaignProfit: true,
		},
	});

	ctx.body.data = {
		merchant,
	};
	ctx.status = 200;

	return next();
}

async function upsertMerchant(ctx, next) {
	const body = Joi.attempt(ctx.request.body, Merchant);

	const userId = ctx.request.auth.userId;

	const merchant = await dbClient.merchant.upsert({
		where: { userId },
		update: body,
		create: {
			...body,
			user: {
				connect: {
					id: userId,
				},
			},
			createdBy: userId,
			updatedBy: userId,
		},
	});

	await removeByPrefix("/merchants");

	ctx.body.data = { merchant };
	ctx.status = 200;

	return next();
}

async function createMerchant(ctx, next) {
	const body = Joi.attempt(ctx.request.body, CreateMerchant);

	const userId = ctx.request.auth.userId;

	const merchant = await dbClient.merchant.create({
		data: {
			...body,
			user: {
				connect: {
					id: userId,
				},
			},
			createdBy: userId,
			updatedBy: userId,
		},
	});

	await removeByPrefix("/merchants");

	ctx.body.data = { merchant };
	ctx.status = 200;

	return next();
}

async function updateMerchant(ctx, next) {
	const body = Joi.attempt(ctx.request.body, UpdateMerchant);

	const userId = ctx.request.auth.userId;

	const merchant = await dbClient.merchant.update({
		where: {
			userId,
		},
		data: body,
	});

	await removeByPrefix("/merchants");

	ctx.body.data = { merchant };
	ctx.status = 200;

	return next();
}

async function updateMerchantStatus(ctx, next) {
	const body = Joi.attempt(ctx.request.body, MerchantStatus);
	const params = ctx.request.params;

	let merchant = await dbClient.merchant.findUnique({
		where: {
			id: parseInt(params.id),
		},
		select: {
			progress: true,
			progressStatus: true,
		},
	});

	if (!merchant) {
		setError(ctx, 404, "MERCHANT_NOT_FOUND");
		return;
	}

	merchant.progress.push(body.progress);
	merchant.progressStatus = body.progress.status;

	merchant = await dbClient.merchant.update({
		where: { id: parseInt(params.id) },
		data: merchant,
	});

	await removeByPrefix("/merchant");

	const notificationData = {
		to: merchant.userId,
		content: {
			title: NOTIFICATION_TITLES[MERCHANT_STATUS_MAIL_TEMPLATE_MAP[body.progress.status]],
			params: {},
		},
		info: {
			reason: "accountCenter",
			notificationType: "Account",
			triggeredBy: "System",
		},
		sendingType: "singleNotification",
		data: { status: "New" },
		expireAt: dayjs().add(7, "day").toDate(),
		saveToDatabase: true,
	};

	await _sendNotifications(notificationData);

	ctx.body.message = { merchant };
	ctx.status = 200;

	return next();
}

router.get("/self-merchant", rateLimit("/merchant/id"), getMerchantSelf);
router.get("/merchant/:id", rateLimit("/merchant/id"), getMerchant);
router.get("/merchants", rateLimit("/merchants"), getMerchants);
router.post("/merchant", rateLimit("/merchant/create"), createMerchant);
router.put("/merchant", rateLimit("/merchant/update"), updateMerchant);
router.post("/merchant/:id/status", rateLimit("/merchant/id/status"), updateMerchantStatus);

module.exports = router;
