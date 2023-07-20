module.exports = {
	env: {
		browser: true,
		es6: true,
	},
	extends: ["react-app", "prettier"],
	plugins: ["prettier"],
	rules: {
		"prettier/prettier": "error",
	},
};
