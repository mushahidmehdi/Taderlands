import { useTranslation } from "react-i18next";

import { useSnackbar } from "notistack";

import { ApiError } from "./errorHandler";

export default function useCatchError() {
	const { enqueueSnackbar } = useSnackbar();
	const { t } = useTranslation();

	return (err) => {
		if (err instanceof ApiError) {
			enqueueSnackbar(t(err.message), { variant: "error" });
			return;
		}

		enqueueSnackbar(t("Something went wrong."), { variant: "error" });
	};
}
