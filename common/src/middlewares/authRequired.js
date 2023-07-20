function authRequired(ctx, next) {
	if (!ctx.request.auth?.userId) {
		if (process.env.NODE_ENV === "development") {
			ctx.request.auth = { userId: "451b3abb-a557-4684-a5ad-07b669b88337" };
			return next();
		}

		ctx.body = { message: "Unauthorized" };
		ctx.status = 401;
	} else {
		return next();
	}
}

module.exports = authRequired;
