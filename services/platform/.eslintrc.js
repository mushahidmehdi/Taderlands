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
		"prefer-const": "error",
	},
	parser: "babel-eslint",
	parserOptions: {
		ecmaVersion: 2019,
	},
};
