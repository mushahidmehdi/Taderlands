import { Config, useFetchAuthorized } from "services";

import { errorHandler } from "./errorHandler";

export const useCommonApi = () => {
	const fetchAuthorized = useFetchAuthorized();

	const getProfilePostLink = (key) =>
		fetchAuthorized(`${Config.apiRoot()}/user/file/upload`, {
			headers: {
				"Content-type": "application/json",
			},
			method: "POST",
			body: JSON.stringify({ key }),
		})
			.then(errorHandler)
			.then((res) => res.data);

	const putFileOnS3 = (url, file) =>
		fetch(url, {
			method: "PUT",
			headers: {
				"Content-Type": file.type,
			},
			body: file,
		});

	const getClientIp = () =>
		fetch("https://api.ipify.org/?format=json", {
			method: "GET",
			headers: {
				"Content-type": "application/json",
			},
		}).then(errorHandler);

	return {
		getProfilePostLink,
		putFileOnS3,
		getClientIp,
	};
};
