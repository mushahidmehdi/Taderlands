import Config from "services/config";

import { errorHandler } from "./errorHandler";

export const useRegisterApi = () => {
	const masterLogin = (body) =>
		fetch(`${Config.apiRoot()}/register/master-login`, {
			headers: {
				"Content-type": "application/json",
			},
			method: "POST",
			body: JSON.stringify(body),
		}).then(errorHandler);

	return { masterLogin };
};
