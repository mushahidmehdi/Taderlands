const getEnvVar = (variableName) => {
	if (window.env && window.env[variableName]) {
		return window.env[variableName];
	}
	return null;
};

const getEnv = (name) => {
	return getEnvVar(name) ? getEnvVar(name) : process.env[name] ?? null;
};

const apiRoot = () => {
	return getEnv("REACT_APP_API_ROOT") ?? "https://aws-staging.traderlands.net/api";
};

const clientFeederRoot = () => {
	return getEnv("REACT_APP_WS_ROOT");
};

const cdnRoot = () => {
	return getEnv("REACT_APP_CDN_ROOT");
};

const landingRoot = () => {
	return getEnv("REACT_APP_LANDING_ROOT");
};

const frontendRoot = () => {
	return getEnv("REACT_APP_FRONTEND_ROOT");
};

const version = () => {
	return getEnv("REACT_APP_VERSION");
};

const environment = () => {
	return getEnv("REACT_APP_NODE_ENV");
};

const Config = {
	environment,
	getEnvVar,
	getEnv,
	apiRoot,
	cdnRoot,
	frontendRoot,
	landingRoot,
	clientFeederRoot,
	version,
};

export default Config;
