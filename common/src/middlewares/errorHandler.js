const { ValidationError } = require("joi");

module.exports = async (ctx, next) => {
	try {
		await next();
	} catch (err) {
		if (err instanceof ValidationError || err?.stack?.startsWith("ValidationError")) {
			ctx.body = {
				...ctx.body,
				error: {
					...ctx.body?.error,
					detail: err.message,
					code: "001",
				},
			};
			err.status = 400;
			ctx.status = 400;
		} else {
			throw err;
		}

		ctx.status = err.status ?? 500;
		if (ctx.status === 500) {
			ctx.body = null;
			if (ctx.app.env !== "development") {
				// This way Cloudwatch shows multiline as a single entry
				console.error(err.stack.replace(/\n/g, "\r"));
			} else {
				ctx.app.emit("error", err, ctx);
			}
		}
	}
};
