const { readdirSync, statSync } = require("fs");
const { join } = require("path");

function getInternalFolders() {
	const srcPath = join(__dirname, "src");
	return readdirSync(srcPath).filter((f) => statSync(join(srcPath, f)).isDirectory());
}

module.exports = {
	".js, .jsx, .es6, .es, .mjs, .ts, .tsx": {
		parser: "babylon",
		style: "@paratica/import-sort-style",
		options: {
			internal: getInternalFolders(),
		},
	},
};
