import { Config, useFetchAuthorized } from "services";
import { errorHandler } from "./errorHandler";


export const usePaymentApi = () => {
	const fetchAuthorized = useFetchAuthorized();

	const kycStart = (ip) =>
		fetchAuthorized(`${Config.apiRoot()}/payment/kyc/start?ip=${ip}`, {
			headers: {
				"Content-type": "application/json",
			},
			method: "GET",
		}).then(errorHandler);

	const getWalletAddress = (currency) =>
		fetchAuthorized(`${Config.apiRoot()}/payment/coinspaid/user-wallet-address`, {
			headers: {
				"Content-type": "application/json",
			},
			method: "POST",
			body: JSON.stringify(currency),
		}).then(errorHandler);

	const startWithdrawalTransaction = (operation, password) =>
		fetchAuthorized(`${Config.apiRoot()}/payment/coinspaid/withdrawal/start`, {
			headers: {
				"Content-type": "application/json",
			},
			method: "POST",
			body: JSON.stringify({
				operation,
				password,
			}),
		}).then(errorHandler);

	const sendOtpCode = (method, transactionId) =>
		fetchAuthorized(`${Config.apiRoot()}/payment/coinspaid/${method}/request`, {
			headers: {
				"Content-type": "application/json",
				"x-transaction-id": transactionId,
			},
			method: "POST",
		}).then(errorHandler);

	const completeWithdrawal = ({ operation, body, transactionId }) =>
		fetchAuthorized(`${Config.apiRoot()}/payment${operation.path}`, {
			headers: {
				"Content-type": "application/json",
				"x-transaction-id": transactionId,
			},
			method: operation.method,
			body: JSON.stringify(body),
		}).then(errorHandler);

	return { kycStart, getWalletAddress, startWithdrawalTransaction, completeWithdrawal, sendOtpCode };
};
