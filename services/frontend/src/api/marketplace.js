import { pickBy } from "lodash";

import { Config, useFetchAuthorized } from "services";

import queryBuilder from "utils/queryBuilder";

import { errorHandler } from "./errorHandler";

export const useMarketplaceApi = () => {
	const fetchAuthorized = useFetchAuthorized();

	const getFunnels = () =>
		fetchAuthorized(`${Config.apiRoot()}/marketplace/funnels`, {
			headers: {
				"Content-type": "application/json",
			},
			method: "GET",
		}).then(errorHandler);

	const getMerchant = (id) =>
		fetchAuthorized(`${Config.apiRoot()}/marketplace/merchant/${id}`, {
			headers: {
				"Content-type": "application/json",
			},
			method: "GET",
		})
			.then(errorHandler)
			.then((data) => data.data?.merchant);

	const getMerchantSelf = () =>
		fetchAuthorized(`${Config.apiRoot()}/marketplace/self-merchant`, {
			headers: {
				"Content-type": "application/json",
			},
			method: "GET",
		})
			.then(errorHandler)
			.then((data) => data.data?.merchant);

	const searchMerchants = (searchKeyWord) =>
		fetchAuthorized(
			`${Config.apiRoot()}/marketplace/merchants?${queryBuilder({
				...(searchKeyWord && { search: searchKeyWord }),
			})}`,
			{
				headers: {
					"Content-type": "application/json",
				},
				method: "GET",
			}
		).then(errorHandler);

	const getMarketStrategies = (data) => {
		return fetchAuthorized(`${Config.apiRoot()}/marketplace/market-strategies`, {
			headers: {
				"Content-type": "application/json",
			},
			method: "POST",
			body: JSON.stringify(data),
		})
			.then(errorHandler)
			.then((data) => data?.data?.marketStrategies);
	};

	const getMarketStrategy = (id) =>
		fetchAuthorized(`${Config.apiRoot()}/marketplace/market-strategy/${id}`, {
			headers: {
				"Content-type": "application/json",
			},
			method: "GET",
		})
			.then(errorHandler)
			.then((data) => data?.data?.marketStrategy);

	const createMarketStrategy = (data) =>
		fetchAuthorized(`${Config.apiRoot()}/marketplace/market-strategy`, {
			headers: {
				"Content-type": "application/json",
			},
			method: "POST",
			body: JSON.stringify(data),
		}).then(errorHandler);

	const followMarketStrategy = (id) =>
		fetchAuthorized(`${Config.apiRoot()}/marketplace/market-strategy/${id}/follow`, {
			headers: {
				"Content-type": "application/json",
			},
			method: "POST",
		}).then(errorHandler);

	const postExpertForm = (data) => {
		return fetchAuthorized(`${Config.apiRoot()}/marketplace/merchant`, {
			headers: {
				"Content-type": "application/json",
			},
			method: "POST",
			body: JSON.stringify(pickBy(data)),
		}).then(errorHandler);
	};

	const getMarketStrategiesCount = (data) => {
		return fetchAuthorized(`${Config.apiRoot()}/marketplace/market-strategies/count`, {
			headers: {
				"Content-type": "application/json",
			},
			method: "POST",
			body: JSON.stringify(data),
		})
			.then(errorHandler)
			.then((data) => data?.data?.marketStrategiesCount?._count);
	};

	const postMarketStrategyStatus = (id, data) => {
		return fetchAuthorized(`${Config.apiRoot()}/marketplace/market-strategy/${id}/status`, {
			headers: {
				"Content-type": "application/json",
			},
			method: "POST",
			body: JSON.stringify(data),
		}).then(errorHandler);
	};

	const getMarketStrategyMetrics = (obj = {}) => {
		const { marketStrategyId, quote, timeRange } = obj;

		return fetchAuthorized(
			`${Config.apiRoot()}/marketplace/market-strategy-metric?${queryBuilder({
				...(marketStrategyId && { marketStrategyId }),
				...(quote && { quote }),
				...(timeRange && { timeRange }),
			})}`,
			{
				headers: {
					"Content-type": "application/json",
				},
				method: "GET",
			}
		).then(errorHandler);
	};

	const getGeneralMarketMetrics = (obj = {}) => {
		const { title, startDate, endDate } = obj;

		return fetchAuthorized(
			`${Config.apiRoot()}/marketplace/general-market-metrics?${queryBuilder({
				title,
				startDate,
				endDate,
			})}`,
			{
				headers: {
					"Content-type": "application/json",
				},
				method: "GET",
			}
		).then(errorHandler);
	};

	return {
		getFunnels,
		getMerchant,
		getMerchantSelf,
		createMarketStrategy,
		postExpertForm,
		searchMerchants,
		getMarketStrategy,
		getMarketStrategies,
		followMarketStrategy,
		getMarketStrategyMetrics,
		getGeneralMarketMetrics,
		postMarketStrategyStatus,
		getMarketStrategiesCount,
	};
};
