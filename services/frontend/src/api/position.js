import { Config, useFetchAuthorized } from "services";

import { errorHandler } from "./errorHandler";

export const usePositionApi = () => {
	const fetchAuthorized = useFetchAuthorized();

	const getPositions = (data) => {
		return fetchAuthorized(`${Config.apiRoot()}/position/positions`, {
			headers: {
				"Content-type": "application/json",
			},
			method: "POST",
			body: JSON.stringify(data),
		})
			.then(errorHandler)
			.then((data) => data?.data?.positions);
	};

	const getPositionsCount = (data) => {
		return fetchAuthorized(`${Config.apiRoot()}/position/positions/count`, {
			headers: {
				"Content-type": "application/json",
			},
			method: "POST",
			body: JSON.stringify(data),
		})
			.then(errorHandler)
			.then((data) => data?.data?.positionsCount._count);
	};

	const getPositionsFilterData = () =>
		fetchAuthorized(`${Config.apiRoot()}/position/positions/filter`, {
			headers: {
				"Content-type": "application/json",
			},
			method: "GET",
		}).then(errorHandler);

	return { getPositions, getPositionsCount, getPositionsFilterData };
};
