import React, { useMemo } from "react";
import { I18nextProvider } from "react-i18next";

import configureLanguage from "./i18n";

export default function LanguageProvider({ languages = ["en"], children }) {
	const i18n = useMemo(() => {
		return configureLanguage({ languages });
	}, [languages]);

	return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
