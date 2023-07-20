module.exports = {
	env: {
		es6: true,
		node: true,
	},
	extends: ["prettier"],
	plugins: ["prettier"],
	rules: {
		"prettier/prettier": "error",
		"no-console": "warn",
		camelcase: "warn",
	},
	parser: "babel-eslint",
	parserOptions: {
		ecmaVersion: 2019,
	},
};
