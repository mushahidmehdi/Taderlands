const Router = require("koa-router");
const Joi = require("joi");
const { dbClient } = require("@paratica/common/prisma");
const rateLimit = require("@backend/common/middlewares/rateLimit");

async function getBillingAddresses(ctx, next) {
	const userId = ctx.request.auth.userId;

	let userShoppingAddresses = await dbClient.userShoppingAddress.findMany({
		where: { userId, type: "BILL-TO" },
	});

	ctx.body.data = { userShoppingAddresses };
	ctx.status = 200;

	return next();
}

async function getBillingAddress(ctx, next) {
	const { id } = ctx.request.params;

	let userShoppingAddress = await dbClient.userShoppingAddress.findUnique({
		where: {
			id: parseInt(id),
		},
	});

	ctx.body.data = { userShoppingAddress };
	ctx.status = 200;

	return next();
}

const userShoppingAddressSchema = Joi.object({
	label: Joi.string().required(),
	person: Joi.string().required(),
	nationalIdentificationId: Joi.string().required(),
	phone: Joi.string().required(),
	mail: Joi.string().required(),
	type: Joi.string().optional(),
	country: Joi.string().required(),
	city: Joi.string().required(),
	province: Joi.string().optional(),
	postalCode: Joi.string().optional(),
	details: Joi.object().required(),
	default: Joi.boolean().required(),
}).error(new Joi.ValidationError(`userShoppingAddressSchema type error`));

async function createBillingAddress(ctx, next) {
	const body = Joi.attempt(ctx.request.body, userShoppingAddressSchema);

	const userId = ctx.request.auth.userId;

	if (body.default) {
		const userShoppingAddress = await dbClient.userShoppingAddress.updateMany({
			where: {
				userId: userId,
				default: true,
			},
			data: {
				default: false,
			},
		});
	}

	const userShoppingAddress = await dbClient.userShoppingAddress.create({
		data: {
			...body,
			userId: userId,
			createdBy: userId,
		},
	});

	ctx.body.data = { userShoppingAddress };
	ctx.status = 200;

	return next();
}

async function updateBillingAddress(ctx, next) {
	const { id } = ctx.request.params;
	const body = Joi.attempt(ctx.request.body, userShoppingAddressSchema);
	const userId = ctx.request.auth.userId;

	if (body.default) {
		const userShoppingAddress = await dbClient.userShoppingAddress.updateMany({
			where: {
				userId: userId,
				default: true,
			},
			data: {
				default: false,
			},
		});
	}

	const userShoppingAddress = await dbClient.userShoppingAddress.update({
		where: {
			id: parseInt(id),
		},
		data: {
			...body,
		},
	});

	ctx.body.data = { userShoppingAddress };
	ctx.status = 200;

	return next();
}

const router = Router();

router.get("/billing-address", rateLimit("/billing-address/get"), getBillingAddresses);
router.get("/billing-address/:id", rateLimit("/billing-address/get"), getBillingAddress);
router.post("/billing-address", rateLimit("/billing-address/post"), createBillingAddress);
router.patch("/billing-address/:id", rateLimit("/billing-address/post"), updateBillingAddress);

module.exports = router;
