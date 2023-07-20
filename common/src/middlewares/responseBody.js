function responseBody(ctx, next) {
	ctx.body = { message: "", data: {} };
	return next();
}

module.exports = responseBody;
