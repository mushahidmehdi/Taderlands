const { getUserByIdentity, getUserByUserId } = require("../services/user");

const { setError } = require("../utils");

async function byUuid(ctx, next) {
	const user = await getUserByUserId(ctx.request.auth.userId);

	if (!user) {
		setError(ctx, 404, "USER_NOT_FOUND");
		return;
	}

	ctx.request.userId = user?.id;
	ctx.request.user = user;

	await next();
}

async function byIdentity(ctx, next) {
	let { email, phoneNumber } = ctx.request.body;

	if (email) {
		email = email.toLowerCase();
	}

	const user = await getUserByIdentity(email, phoneNumber);

	ctx.request.user = user;

	await next();
}

module.exports = { byUuid, byIdentity };
