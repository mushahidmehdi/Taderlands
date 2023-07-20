function authParser(ctx, next) {
	if (ctx.request.headers["x-user-id"]) {
		ctx.request.auth = {
			userId: ctx.request.headers["x-user-id"],
			email: ctx.request.headers["x-user-email"],
			roles: ctx.request.headers["x-user-roles"],
			phoneNumber: ctx.request.headers["x-user-phone-number"],
		};
	}
	return next();
}

module.exports = authParser;
