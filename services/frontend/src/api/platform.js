import { Config, useFetchAuthorized } from "services";

const { errorHandler } = require("./errorHandler");

export const usePlatformApi = () => {
	const fetchAuthorized = useFetchAuthorized();

	const addConnection = (data) =>
		fetchAuthorized(`${Config.apiRoot()}/platform/connection`, {
			headers: {
				"Content-type": "application/json",
			},
			method: "POST",
			body: JSON.stringify(data),
		}).then(errorHandler);

	const updateConnection = ({ operation, transactionId, body }) =>
		fetchAuthorized(`${Config.apiRoot()}/platform${operation.path}`, {
			headers: {
				"Content-type": "application/json",
				"x-transaction-id": transactionId,
			},
			method: operation.method,
			body: JSON.stringify(body),
		}).then(errorHandler);

	const getPlatforms = () =>
		fetchAuthorized(`${Config.apiRoot()}/platform/platforms`, {
			headers: {
				"Content-type": "application/json",
			},
			method: "GET",
		}).then(errorHandler);

	const getParities = () =>
		fetchAuthorized(`${Config.apiRoot()}/platform/parities?status=ACTIVE`, {
			headers: {
				"Content-type": "application/json",
			},
			method: "GET",
		})
			.then(errorHandler)
			.then((data) => [...data?.data?.parities].sort((a, b) => a.symbol.localeCompare(b.symbol)));

	const getConnections = () =>
		fetchAuthorized(`${Config.apiRoot()}/platform/connections`, {
			headers: {
				"Content-type": "application/json",
			},
			method: "GET",
		}).then(errorHandler);

	const recheckConnection = (exchange) =>
		fetchAuthorized(`${Config.apiRoot()}/platform/connection/${exchange}/recheck`, {
			headers: {
				"Content-type": "application/json",
			},
			method: "POST",
		}).then(errorHandler);

	return { addConnection, updateConnection, getPlatforms, getConnections, recheckConnection, getParities };
};
