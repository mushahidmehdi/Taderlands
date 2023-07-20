import { initReactI18next } from "react-i18next";

import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpApi from "i18next-http-backend";

i18n.use(initReactI18next)
	.use(LanguageDetector)
	.use(HttpApi)
	.init({
		supportedLngs: ["en", "tr"],
		lng: "en-US",
		fallbackLng: "en",
		detection: {
			order: ["cookie", "htmlTag", "localStorage", "path", "subdomain"],
			caches: ["localStorage"],
		},
		backend: {
			loadPath: "/locales/{{lng}}/translation.json",
		},
		react: {
			useSuspense: false,
		},
	});
