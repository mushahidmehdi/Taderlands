import { initReactI18next } from "react-i18next";

import dayjs from "dayjs";
import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";

export default function configureLanguage({ languages = ["en"] }) {
	i18n.use(Backend)
		.use(LanguageDetector)
		.use(initReactI18next)
		.init({
			fallbackLng: "en",
			debug: false, // Convert to true to get untranslated keys
			lowerCaseLng: true,
			whitelist: languages,
			backend: {
				loadPath: "/locales/{{lng}}/{{ns}}.json",
				// addPath: "/locales/add/{{lng}}/{{ns}}",
				allowMultiLoading: true,
			},
			ns: ["register", "common", "dashboard", "translation"],
			defaultNS: "translation",
			interpolation: {
				escapeValue: false, // not needed for react as it escapes by default
			},
			keySeparator: ".",
			returnEmptyString: false,
			detection: { order: ["localStorage", "navigator", "htmlTag"] },
		});

	i18n.on("languageChanged", (lang) => {
		dayjs.locale(lang);
		window.lang = lang;
	});

	return i18n;
}
