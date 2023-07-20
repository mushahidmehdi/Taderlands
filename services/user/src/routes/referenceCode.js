const Router = require("koa-router");
const Joi = require("joi");
const dayjs = require("dayjs");
const qrcode = require("qrcode");

const { dbClient } = require("@paratica/common/prisma");
const { setError } = require("@backend/common/utils");

const { getUsedReferenceCodeCount } = require("@backend/common/functions/referenceCode");
const { _sendNotifications, NOTIFICATION_TITLES } = require("@backend/common/functions/notificationControls");
const rateLimit = require("@backend/common/middlewares/rateLimit");

async function getReferenceCodes(ctx, next) {
	const userId = ctx.request.auth.userId;

	let referenceCodes = await dbClient.referenceCode.findMany({
		where: { ownerId: userId },
		include: { _count: { select: { usedBy: true } } },
	});
	const FRONTEND_URL = process.env.FRONTEND_URL;

	for (let i = 0; i < referenceCodes.length; i++) {
		const url = process.env.FRONTEND_URL + "/register?referenceCode=" + referenceCodes[i].code;
		const qr = await qrcode.toDataURL(url);

		if (qr) {
			referenceCodes[i].qr = qr;
		}
	}

	ctx.body.data = { referenceCodes };
	ctx.status = 200;

	return next();
}

async function getReferenceCode(ctx, next) {
	const { id } = ctx.request.params;

	let referenceCode = await dbClient.referenceCode.findUnique({
		where: {
			id: parseInt(id),
		},
		include: { _count: { select: { usedBy: true } } },
	});

	const qr = await qrcode.toDataURL(referenceCode.code);

	if (qr) {
		referenceCode.qr = qr;
	}

	ctx.body.data = { referenceCode };
	ctx.status = 200;

	return next();
}

const referenceCodeSchema = Joi.object({
	name: Joi.string().required(),
	code: Joi.string().optional(),
	inviterIncome: Joi.number().required(),
	inviteeIncome: Joi.number().required(),
	default: Joi.boolean().required(),
}).error(new Joi.ValidationError(`Create ReferenceCodeSchema type error`));

async function createReferenceCode(ctx, next) {
	const body = Joi.attempt(ctx.request.body, referenceCodeSchema);

	const userId = ctx.request.auth.userId;

	if (body.default) {
		const referenceCode = await dbClient.referenceCode.updateMany({
			where: {
				ownerId: userId,
				default: true,
			},
			data: {
				default: false,
			},
		});
	}

	const user = await dbClient.user.findUnique({
		where: {
			id: userId,
		},
	});

	const totalUsedByCount = await getUsedReferenceCodeCount(userId);

	if (totalUsedByCount >= user.maximumReferenceInviteeCount) {
		setError(ctx, 400, "REFERENCE_CODE_REGISTRATION_LIMIT_EXCEEDED");
		return;
	}

	let existingCodeOwner = 1;
	let newReferenceCode;

	while (existingCodeOwner) {
		newReferenceCode =
			body.name.toUpperCase().substring(0, 8) + generateReferenceCode(12 - body.name.substring(0, 8).length);

		existingCodeOwner = await dbClient.referenceCode.findUnique({
			where: {
				code: newReferenceCode,
			},
		});

		body.code = newReferenceCode;
	}

	const referenceCode = await dbClient.referenceCode.create({
		data: {
			...body,
			...(body?.inviteeIncome && { inviteeIncome: parseFloat(body?.inviteeIncome) }),
			...(body?.inviterIncome && { inviterIncome: parseFloat(body?.inviterIncome) }),
			ownerId: userId,
			createdBy: userId,
		},
	});

	ctx.body.data = { referenceCode };
	ctx.status = 200;

	return next();
}

const updateReferenceCodeSchema = Joi.object({
	name: Joi.string().optional(),
	code: Joi.string().optional(),
	inviterIncome: Joi.number().optional(),
	inviteeIncome: Joi.number().optional(),
	default: Joi.boolean().optional(),
}).error(new Joi.ValidationError(`Update referenceCodeSchema type error`));

async function updateReferenceCode(ctx, next) {
	const { id } = ctx.request.params;
	const body = Joi.attempt(ctx.request.body, updateReferenceCodeSchema);
	const userId = ctx.request.auth.userId;
	if (body.default) {
		const referenceCode = await dbClient.referenceCode.updateMany({
			where: {
				ownerId: userId,
				default: true,
			},
			data: {
				default: false,
			},
		});
	}

	const referenceCode = await dbClient.referenceCode.update({
		where: {
			id: parseInt(id),
		},

		data: {
			...body,
			...(body?.inviteeIncome && { inviteeIncome: parseFloat(body?.inviteeIncome) }),
			...(body?.inviterIncome && { inviterIncome: parseFloat(body?.inviterIncome) }),
		},
	});

	const qr = await qrcode.toDataURL(referenceCode.code);

	if (qr) {
		referenceCode.qr = qr;
	}

	ctx.body.data = { referenceCode };
	ctx.status = 200;

	return next();
}

const updateUsedReferenceCodeSchema = Joi.object({
	referenceCode: Joi.string().required(),
}).error(new Joi.ValidationError(`updateUsedReferenceCodeSchema type error`));

async function updateUsedReferenceCode(ctx, next) {
	const body = Joi.attempt(ctx.request.body, updateUsedReferenceCodeSchema);
	const userId = ctx.request.auth.userId;

	if (!body.referenceCode) {
		setError(ctx, 400, "REFERENCE_CODE_REQUIRED");
		return;
	}

	let user = await dbClient.user.findUnique({
		where: {
			id: userId,
		},
	});

	if (user.usedReferenceCodeId) {
		setError(ctx, 400, "REFERENCE_CODE_ALREADY_USED");
		return;
	}

	let referenceCode = await dbClient.referenceCode.findUnique({
		where: {
			code: body.referenceCode,
		},
		include: { _count: { select: { usedBy: true } }, owner: true },
	});

	if (referenceCode.owner.id === userId) {
		setError(ctx, 400, "OWN_REFERENCE_CODE_CANNOT_BE_USED");
		return;
	}

	if (!referenceCode) {
		setError(ctx, 400, "REFERENCE_CODE_NOT_FOUND");
		return;
	}

	if (referenceCode._count.usedBy >= referenceCode.owner.maximumReferenceInviteeCount) {
		setError(ctx, 400, "REFERENCE_CODE_REGISTRATION_LIMIT_EXCEEDED");
		return;
	}

	const totalUsedByCount = await getUsedReferenceCodeCount(referenceCode.ownerId);

	if (totalUsedByCount >= referenceCode.owner.maximumReferenceInviteeCount) {
		setError(ctx, 400, "REFERENCE_CODE_REGISTRATION_LIMIT_EXCEEDED");
		return;
	}

	user = await dbClient.user.update({
		where: {
			id: userId,
		},
		data: {
			usedReferenceCodeId: referenceCode.id,
		},
	});

	const notificationData = {
		to: user.id,
		content: {
			title: NOTIFICATION_TITLES.UPDATE_REFERENCE_CODE,
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

	const responseData = await _sendNotifications(notificationData);

	ctx.body.data = { user };
	ctx.status = 200;
	return next();
}

function generateReferenceCode(length) {
	let result = "";
	const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	const charactersLength = characters.length;
	for (var i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}

const router = Router();

router.get("/reference-codes", rateLimit("/reference-codes"), getReferenceCodes);
router.get("/reference-code/:id", rateLimit("/reference-code/id"), getReferenceCode);
router.post("/reference-code", rateLimit("/reference-code/post"), createReferenceCode);
router.patch("/reference-code/:id", rateLimit("/reference-code/patch"), updateReferenceCode);
router.put("/reference-code", rateLimit("/reference-code/put"), updateUsedReferenceCode);

module.exports = router;
