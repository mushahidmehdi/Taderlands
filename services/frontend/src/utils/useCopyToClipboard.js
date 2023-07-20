import { useTranslation } from "react-i18next";

import { useSnackbar } from "notistack";

export default function useCopyToClipboard() {
	const { t } = useTranslation("common");
	const { enqueueSnackbar } = useSnackbar();

	return (item, text) => {
		enqueueSnackbar(text ?? t("copied"), { variant: "success" });
		navigator?.clipboard?.writeText(item);
	};
}
