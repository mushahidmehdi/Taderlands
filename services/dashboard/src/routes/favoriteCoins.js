const Router = require("koa-router");
const Joi = require("joi");
const router = Router();

const { omit } = require("lodash");

const { dbClient } = require("@paratica/common/prisma");
const { setError } = require("@backend/common/utils");

const rateLimit = require("@backend/common/middlewares/rateLimit");

async function getFavoriteCoins(ctx, next) {
	const userFavorites = await dbClient.userFavorite.findFirst({
		where: { user: { id: ctx.request.auth.userId } },
		select: { coins: true },
	});

	let coins = userFavorites?.coins;

	if (!coins?.length) {
		const config = await dbClient.config.findFirst({
			where: {
				title: "DEFAULT_COINS",
			},
			select: { data: true },
		});

		if (!config?.data) {
			setError(ctx, 404, "DEFAULT_COINS_NOT_SET");
			return;
		}

		coins = config.data.defaultCoins;
	}

	details = await dbClient.parity.findMany({
		where: { id: { in: coins } },
		include: {
			platform: true,
		},
	});

	ctx.body.data = { userFavorite: details.map((x) => omit(x, "info")) };
	ctx.status = 200;

	return next();
}

const postFavoriteCoinsSchema = Joi.object({
	coins: Joi.array().items().required(),
}).error(new Joi.ValidationError(` type error`));

async function postFavoriteCoins(ctx, next) {
	const body = Joi.attempt(ctx.request.body, postFavoriteCoinsSchema);

	const userId = ctx.request.auth.userId;

	let userFavorite;

	try {
		userFavorite = await dbClient.userFavorite.upsert({
			where: {
				userId,
			},
			update: body,
			create: {
				...body,
				userId,
			},
			select: {
				coins: true,
			},
		});
	} catch (error) {
		ctx.status = 409;
		return;
	}

	ctx.body.message = "ok";
	ctx.body.data = { userFavorite };
	ctx.status = 200;

	return next();
}

router.get("/favorite-coins", rateLimit("/favorite-coins/get"), getFavoriteCoins);
router.post("/favorite-coins", rateLimit("/favorite-coins/post"), postFavoriteCoins);

module.exports = router;
