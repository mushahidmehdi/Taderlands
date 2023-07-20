const { login, kcAdminClient } = require("./keycloak");

const { setError } = require("@backend/common/utils");

async function passwordProtection(ctx, next) {
	const { password } = ctx.request.body;

	if (!password) {
		setError(ctx, 404, "PASSWORD_REQUIRED");
		return;
	}

	try {
		const userId = ctx.request.auth.userId;

		const kcUsers = await kcAdminClient.users.findOne({ id: userId });

		const resp = await login(kcUsers.username, password);

		if (!resp?.accessToken) {
			setError(ctx, 401, "INVALID_CREDENTIALS");
			return;
		}

		ctx.request.username = kcUsers.username;
		return next();
	} catch (error) {
		console.log("password protection: unexpected error");
		!error?.response && console.log(error);

		if (error?.response?.statusText === "Unauthorized") {
			setError(ctx, 400, "INVALID_CREDENTIALS");
			return;
		}

		ctx.status = 500;
		return;
	}
}

module.exports = passwordProtection;
