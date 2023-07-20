import { Config, useFetchAuthorized } from "services";
import queryBuilder from "utils/queryBuilder";
const { errorHandler } = require("./errorHandler");

export const useStrategyApi = () => {
	const fetchAuthorized = useFetchAuthorized();

	const getFollowedStrategies = (strategyId) =>
		fetchAuthorized(
			`${Config.apiRoot()}/strategy/strategies/followed?${queryBuilder({
				strategyId,
			})}`,
			{
				headers: {
					"Content-type": "application/json",
				},
				method: "GET",
			}
		)
			.then(errorHandler)
			.then((data) => data?.data?.followedStrategies);

	const getStrategies = () =>
		fetchAuthorized(`${Config.apiRoot()}/strategy/strategies`, {
			headers: {
				"Content-type": "application/json",
			},
			method: "GET",
		})
			.then(errorHandler)
			.then((data) => data?.data?.strategies);

	const startStrategyEvaluation = (strategyId) => {
		return fetchAuthorized(`${Config.apiRoot()}/strategymetric/strategy-evaluation`, {
			headers: {
				"Content-type": "application/json",
			},
			method: "POST",
			body: JSON.stringify({ strategyId }),
		}).then(errorHandler);
	};

	const updateStrategy = (strategyId, data) =>
		fetchAuthorized(`${Config.apiRoot()}/strategy/strategy/${strategyId}`, {
			headers: {
				"Content-type": "application/json",
			},
			method: "PUT",
			body: JSON.stringify(data),
		}).then(errorHandler);

	const createStrategy = (data) =>
		fetchAuthorized(`${Config.apiRoot()}/strategy/strategy`, {
			headers: {
				"Content-type": "application/json",
			},
			method: "POST",
			body: JSON.stringify(data),
		}).then(errorHandler);

	const getArchive = () =>
		fetchAuthorized(`${Config.apiRoot()}/strategy/strategies/unfollowed`, {
			headers: {
				"Content-type": "application/json",
			},
			method: "GET",
		})
			.then(errorHandler)
			.then((data) => data?.data?.followedStrategies);

	const createRuleDesign = (data) => fetchAuthorized(`${Config.apiRoot()}/strategy/rule-design`, {
		headers: {
			"Content-type": "application/json",
		},
		method: "POST",
		body: JSON.stringify(data),
	}).then(errorHandler);

	return {
		getFollowedStrategies,
		getStrategies,
		startStrategyEvaluation,
		updateStrategy,
		createStrategy,
		getArchive,
		createRuleDesign
	};
};
