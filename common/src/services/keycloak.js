const KcAdminClient = require("@keycloak/keycloak-admin-client");

const { getToken } = require("@keycloak/keycloak-admin-client/lib/utils/auth");

const BASE_URL = process.env.KEYCLOAK_BASE_URL ?? "http://127.0.0.1:8080/auth";
const REALM_NAME = process.env.KEYCLOAK_REALM ?? "paratica";
const CLIENT_ID = process.env.KEYCLOAK_CLIENT_ID ?? "paratica-rest";

const kcAdminClient = new KcAdminClient.default({
	baseUrl: BASE_URL,
	realmName: REALM_NAME,
});

const credentials = {
	grantType: "client_credentials",
	clientId: process.env.KEYCLOAK_ADMIN_CLIENT_ID,
	clientSecret: process.env.KEYCLOAK_ADMIN_CLIENT_SECRET,
};

kcAdminClient.auth(credentials);

setInterval(() => kcAdminClient.auth(credentials), 58 * 1000); // 58 seconds

const login = (username, password) => {
	return getToken({
		credentials: {
			username: username,
			password: password,
			grantType: "password",
			clientId: CLIENT_ID,
		},
		baseUrl: BASE_URL,
		realmName: REALM_NAME,
	});
};

module.exports = { kcAdminClient, login };
