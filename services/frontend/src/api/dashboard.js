import { Config, useFetchAuthorized } from "services";

import { errorHandler } from "./errorHandler";

export const useDashboardApi = () => {
	const fetchAuthorized = useFetchAuthorized();

	const getPortfolio = () =>
		fetchAuthorized(`${Config.apiRoot()}/dashboard/portfolio`, {
			method: "GET",
		})
			.then(errorHandler)
			.then((data) => data?.data?.userBalances);

	const getSummary = () =>
		fetchAuthorized(`${Config.apiRoot()}/dashboard/position-summary`, {
			method: "GET",
		})
			.then(errorHandler)
			.then((data) => data?.data?.positionSummary);

	const getTransactionSummary = () =>
		fetchAuthorized(`${Config.apiRoot()}/dashboard/wallet/transactions-summary`, {
			method: "GET",
		})
			.then(errorHandler)
			.then((data) => data?.data?.walletTransactionSummary);

	const getWallet = () =>
		fetchAuthorized(`${Config.apiRoot()}/dashboard/wallet`, {
			method: "GET",
		})
			.then(errorHandler)
			.then((data) => data?.data?.walletTransaction);

	const getConfig = (title) =>
		fetchAuthorized(`${Config.apiRoot()}/dashboard/config?title=${title}`, {
			method: "GET",
		})
			.then(errorHandler)
			.then((data) => data?.data?.config);

	return { getPortfolio, getSummary, getTransactionSummary, getWallet, getConfig };
};
