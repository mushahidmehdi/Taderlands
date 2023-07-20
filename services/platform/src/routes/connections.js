const Joi = require("joi");
const Router = require("koa-router");
const { omit, pick } = require("lodash");
const dayjs = require("dayjs");

const { dbClient } = require("@paratica/common/prisma");
const seed = require("@paratica/common/prisma/seed/essential/index");

const { setError } = require("@backend/common/utils");
const { getRestrictions } = require("@backend/common/functions/restrictions");
const { removeByPrefix } = require("@backend/common/services/redis");
const { otpProtection } = require("@backend/common/middlewares/otpProtection");
const rateLimit = require("@backend/common/middlewares/rateLimit");

const { getConnections: getConnectionsService } = require("../services/connections");
const { getPlatformsByExchange } = require("../services/platforms");

const REMOVE_API_SECRET = true;

async function getConnections(ctx, next) {
	let exchange;
	let userApiConnections = await getConnectionsService(ctx.request?.auth?.userId, exchange, REMOVE_API_SECRET);

	ctx.body.data = { connections: userApiConnections };
	ctx.status = 200;
	return next();
}

async function getConnection(ctx, next) {
	const userId = ctx.request.auth.userId;
	const body = Joi.attempt(ctx.request.params, deleteConnectionsSchema);

	const connections = await getConnectionsService(userId, body.exchange, REMOVE_API_SECRET);

	ctx.body.data = connections;
	ctx.status = 200;
	return next();
}

const connectionsSchema = Joi.object({
	exchange: Joi.string().required(),
	apiKey: Joi.string().required(),
	apiSecret: Joi.string().required(),
	name: Joi.string().required(),
	passphrase: Joi.string().optional(),
	starkPrivateKey: Joi.string().optional(),
	walletAddress: Joi.string().optional(),
}).error(new Joi.ValidationError(`connectionsSchema type error`));

async function postConnectionNew(ctx, next) {
	const body = Joi.attempt(ctx.request.body, connectionsSchema);
	const userId = ctx.request.auth.userId;
	const platforms = await getPlatformsByExchange(body.exchange);

	if (!platforms?.length) {
		setError(ctx, 400, "WRONG_EXCHANGE");
		return next();
	}

	const restrictions = await getRestrictions(body.exchange, body);

	let connections = [];

	if (restrictions?.isValid === false) {
		setError(ctx, 400, "INVALID_API_CREDENTIALS");
		return;
	}

	if (!restrictions?.isValid) {
		console.log("restrictions", restrictions);
		setError(ctx, 400, "ERROR_FROM_CEX");
		return;
	}

	for (const platform of platforms) {
		let data = {
			exchangeConnectionInfo: {
				...pick(body, ["apiKey", "apiSecret", "passphrase", "walletAddress", "starkPrivateKey"]),
			},
			restrictions,
			name: body.name,
		};

		if (platform.id === seed.platforms.dydx.id) {
			data.exchangeConnectionInfo.positionId = restrictions.positionId;
			data.restrictions = omit(data.restrictions, ["positionId"]);
		}

		data.exchangeConnectionInfo = JSON.stringify(data.exchangeConnectionInfo);

		const details = {
			...(restrictions.expireDate && { expireDate: dayjs(restrictions.expireDate).format("DD/MM/YYYY") }),
			...(restrictions.exchangeId && { exchangeId: restrictions.exchangeId }),
		};

		if (details.exchangeId || details.expireDate) {
			data.details = details;
		}

		connections.push(
			await dbClient.userApiConnection.upsert({
				where: {
					userId_platformId: {
						userId,
						platformId: platform.id,
					},
				},
				update: data,
				create: {
					userId,
					platformId: platform.id,
					...data,
					createdBy: userId,
				},
				select: {
					name: true,
					platform: {
						select: {
							name: true,
							info: true,
							exchange: true,
						},
					},
					restrictions: true,
					isActive: true,
				},
			})
		);
	}

	await removeByPrefix("/connection");
	await getConnectionsService.delete(userId, body.exchange, !REMOVE_API_SECRET);
	await getConnectionsService.delete(userId, body.exchange, REMOVE_API_SECRET);

	ctx.body.message = "ok";
	ctx.body.data = { connections };
	ctx.status = 200;

	return next();
}
const connectionRecheckSchema = Joi.object({
	exchange: Joi.string().required(),
}).error(new Joi.ValidationError(`connectionRecheckSchema type error`));

async function connectionRecheck(ctx, next) {
	const body = Joi.attempt(ctx.request.params, connectionRecheckSchema);
	const userId = ctx.request.auth.userId;

	let connections = await getConnectionsService(userId, body.exchange, !REMOVE_API_SECRET);

	if (!connections?.length) {
		setError(ctx, 400, "CONNECTIONS_NOT_EXIST");
		return;
	}

	let restrictions = await getRestrictions(connections[0].platform.exchange, connections[0].exchangeConnectionInfo);

	for (let i = 0; i < connections.length; i++) {
		connections[i].exchangeConnectionInfo = omit(connections[i].exchangeConnectionInfo, "apiSecret");
	}

	if (restrictions?.isValid === false) {
		setError(ctx, 400, "INVALID_API_CREDENTIALS");
		return;
	}

	if (!restrictions?.isValid) {
		console.log("restrictions", restrictions);
		setError(ctx, 400, "ERROR_FROM_CEX");
		return;
	}

	if (connections[0].platform.id === seed.platforms.dydx.id) {
		restrictions = omit(data.restrictions, ["positionId"]);
	}

	const details = {
		...(restrictions.expireDate && { expireDate: dayjs(restrictions.expireDate).format("DD/MM/YYYY") }),
		...(restrictions.exchangeId && { exchangeId: restrictions.exchangeId }),
	};

	await dbClient.userApiConnection.updateMany({
		where: {
			user: {
				id: userId,
			},
			platformId: {
				in: connections.map((x) => x.platformId),
			},
		},
		data: {
			restrictions,
			details,
		},
	});

	ctx.body.message = "ok";
	ctx.body.data = { connections };
	ctx.status = 200;

	await removeByPrefix("/connection");
	await getConnectionsService.delete(userId, body?.exchange, !REMOVE_API_SECRET);
	await getConnectionsService.delete(userId, body?.exchange, REMOVE_API_SECRET);

	return next();
}

async function postConnectionUpdate(ctx, next) {
	const body = Joi.attempt(ctx.request.body, connectionsSchema);

	const userId = ctx.request.auth.userId;

	const platforms = await getPlatformsByExchange(body.exchange);

	if (!platforms?.length) {
		setError(ctx, 400, "WRONG_EXCHANGE");
		return;
	}

	const oldConnections = await dbClient.userApiConnection.findMany({
		where: {
			userId,
			platformId: platforms[0].id,
		},
	});

	if (!oldConnections?.length) {
		setError(ctx, 400, "NO_OLD_CONNECTIONS");
		return;
	}
	const restrictions = await getRestrictions(body.exchange, body);

	let connections = [];

	if (restrictions?.isValid === false) {
		setError(ctx, 400, "INVALID_API_CREDENTIALS");
		return;
	}

	if (!restrictions?.isValid) {
		console.log("restrictions", restrictions);
		setError(ctx, 400, "ERROR_FROM_CEX");
		return;
	}

	for (const platform of platforms) {
		const data = {
			exchangeConnectionInfo: {
				...pick(body, ["apiKey", "apiSecret", "passphrase", "walletAddress", "starkPrivateKey"]),
			},
			restrictions,
			name: body.name,
		};

		if (platform.id === seed.platforms.dydx.id) {
			data.exchangeConnectionInfo.positionId = restrictions.positionId;
			data.restrictions = omit(data.restrictions, ["positionId"]);
		}

		data.exchangeConnectionInfo = JSON.stringify(data.exchangeConnectionInfo);
		const details = {
			...(restrictions.expireDate && { expireDate: dayjs(restrictions.expireDate).format("DD/MM/YYYY") }),
			...(restrictions.exchangeId && { exchangeId: restrictions.exchangeId }),
		};

		if (details.exchangeId || details.expireDate) {
			data.details = details;
		}

		connections.push(
			await dbClient.userApiConnection.upsert({
				where: {
					userId_platformId: {
						userId,
						platformId: platform.id,
					},
				},
				update: data,
				create: {
					userId,
					platformId: platform.id,
					...data,
					createdBy: userId,
				},
				select: {
					name: true,
					platform: {
						select: {
							name: true,
							info: true,
							exchange: true,
						},
					},
					restrictions: true,
					isActive: true,
				},
			})
		);
	}

	ctx.body.message = "ok";
	ctx.body.data = { connections };
	ctx.status = 200;

	await removeByPrefix("/connection");

	await getConnectionsService.delete(userId, body.exchange, !REMOVE_API_SECRET);
	await getConnectionsService.delete(userId, body.exchange, REMOVE_API_SECRET);

	return next();
}

const deleteConnectionsSchema = Joi.object({
	exchange: Joi.string().required(),
}).error(new Joi.ValidationError(`deleteConnectionsSchema type error`));

async function deleteConnections(ctx, next) {
	const body = Joi.attempt(ctx.request.params, deleteConnectionsSchema);
	const userId = ctx.request.auth.userId;
	const platforms = await dbClient.platform.findMany({ where: { exchange: body.exchange } });

	if (!platforms?.length) {
		setError(ctx, 400, "WRONG_EXCHANGE");
		return;
	}

	const deleted = await dbClient.userApiConnection.deleteMany({
		where: {
			user: {
				id: userId,
			},
			platformId: {
				in: platforms.map((x) => x.id),
			},
		},
	});
	ctx.body.message = "ok";
	ctx.status = 200;

	await removeByPrefix("/connection");

	return next();
}

const connectionActiveSchema = Joi.object({
	exchange: Joi.string().required(),
	isActive: Joi.boolean().required(),
}).error(new Joi.ValidationError(`connectionActiveSchema type error`));

async function connectionActive(ctx, next) {
	const body = Joi.attempt(Object.assign(ctx.request.body, ctx.request.params), connectionActiveSchema);
	const userId = ctx.request.auth.userId;

	const updatedConnections = await dbClient.userApiConnection.updateMany({
		where: {
			platform: {
				exchange: body.exchange,
			},
			user: {
				id: userId,
			},
		},
		data: {
			isActive: body.isActive,
		},
	});

	if (updatedConnections.count == 0) {
		setError(ctx, 400, "CONNECTIONS_NOT_EXIST");
		return;
	}

	const connections = await dbClient.userApiConnection.findMany({
		where: {
			platform: {
				exchange: body.exchange,
			},
			user: {
				id: userId,
			},
		},
		select: {
			platform: {
				select: {
					name: true,
					info: true,
					exchange: true,
				},
			},
			exchangeConnectionInfo: true,
			isActive: true,
			updatedAt: true,
			name: true,
			restrictions: true,
		},
	});

	for (let i = 0; i < connections.length; i++) {
		connections[i].exchangeConnectionInfo = omit(JSON.parse(connections[i].exchangeConnectionInfo), ["apiSecret"]);
	}

	ctx.body.message = "ok";
	ctx.body.data = { connections };
	ctx.status = 200;

	await removeByPrefix("/connection");

	return next();
}

const router = new Router();

router.get("/connections", rateLimit("/connections"), getConnections);
router.get("/connection/:exchange", rateLimit("/connection/exchange"), getConnection);
router.post("/connection", rateLimit("/connection"), postConnectionNew);
router.post("/connection/:exchange/recheck", rateLimit("/connection/exchange/recheck"), connectionRecheck);

router.post("/connection-update", rateLimit("/connection-update"), otpProtection, postConnectionUpdate);
router.delete(
	"/connection/:exchange/delete",
	rateLimit("/connection/exchange/delete"),
	otpProtection,
	deleteConnections
);
router.post("/connection/:exchange/active", rateLimit("/connection/exchange/active"), otpProtection, connectionActive);

module.exports = router;
