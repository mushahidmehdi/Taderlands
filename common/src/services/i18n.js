const { I18n } = require("i18n");
const path = require("path");
const fs = require("fs");

const translations = fs.readdirSync(path.join(__dirname, "../translations"));
let staticCatalog = {};
for (const translation of translations) {
	staticCatalog[translation.substring(0, translation.length - 3)] = require(path.join(
		__dirname,
		"../translations/" + translation
	));
}

const i18n = new I18n({
	staticCatalog,
	defaultLocale: "en",
	objectNotation: true,
});

module.exports = i18n;
