import { useTranslation } from "react-i18next";

import { socialMediaLinks } from ".";

export default function useOpenInNewTab() {
	const { i18n } = useTranslation();

	return (type) => {
		const newWindow = window.open(socialMediaLinks[type][i18n.resolvedLanguage], "_blank").focus();
		if (newWindow) newWindow.opener = null;
	};
}
