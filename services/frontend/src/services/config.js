const getEnvVar = (variableName) => {
	if (window.env && window.env[variableName]) {
		return window.env[variableName];
	}
	return null;
};

const getEnv = (name) => {
	return `${getEnvVar(name) ?? process.env[name]}`;
};

const apiRoot = () => {
	return getEnv("REACT_APP_API_ROOT");
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

const intercomAppId = () => getEnv("REACT_APP_INTERCOM_APP_ID");

const version = () => {
	return getEnv("REACT_APP_VERSION");
};

const environment = () => getEnv("REACT_APP_NODE_ENV");

const gtagId = () => getEnv("REACT_APP_GTAG_ID");

const captchaKey = () => getEnv("REACT_APP_CAPTCHA_KEY");

const Config = {
	getEnvVar,
	getEnv,
	apiRoot,
	cdnRoot,
	environment,
	intercomAppId,
	gtagId,
	landingRoot,
	clientFeederRoot,
	version,
	captchaKey,
};

export default Config;
