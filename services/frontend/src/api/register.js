import { Config } from "services";

import { errorHandler } from "./errorHandler";

export const useRegisterApi = () => {
	const login = ({ email, password, captcha }) =>
		fetch(`${Config.apiRoot()}/register/login`, {
			headers: {
				"Content-type": "application/json",
			},
			method: "POST",
			body: JSON.stringify({ email, password, captcha }),
		}).then(errorHandler);

	const register = (body) =>
		fetch(`${Config.apiRoot()}/register/register`, {
			headers: {
				"Content-type": "application/json",
			},
			method: "POST",
			body: JSON.stringify(body),
		}).then(errorHandler);

	const initiateForgotPassword = (body) =>
		fetch(`${Config.apiRoot()}/register/forgot-password/initiate`, {
			headers: {
				"Content-type": "application/json",
			},
			method: "POST",
			body: JSON.stringify(body),
		}).then(errorHandler);

	const confirmForgotPassword = (body) =>
		fetch(`${Config.apiRoot()}/register/forgot-password/complete`, {
			headers: {
				"Content-type": "application/json",
			},
			method: "POST",
			body: JSON.stringify(body),
		}).then(errorHandler);

	const confirmRegisterOtp = ({ body, transactionId }) =>
		fetch(`${Config.apiRoot()}/register/confirm-otp`, {
			headers: {
				"Content-type": "application/json",
				"x-transaction-id": transactionId,
			},
			method: "POST",
			body: JSON.stringify(body),
		}).then(errorHandler);

	const sendOtp = ({ body, forgotPassword, method, transactionId }) =>
		fetch(`${Config.apiRoot()}/register/${forgotPassword ? "forgot-password" : "login"}/${method}/request`, {
			headers: {
				"Content-type": "application/json",
				"x-transaction-id": transactionId,
			},
			method: "POST",
			body: JSON.stringify(body),
		}).then(errorHandler);

	const sendOtpAgain = ({ body, transactionId }) =>
		fetch(`${Config.apiRoot()}/register/send-otp-again`, {
			headers: {
				"Content-type": "application/json",
				"x-transaction-id": transactionId,
			},
			method: "POST",
			body: JSON.stringify(body),
		}).then(errorHandler);

	const confirmLogin = ({ body, transactionId }) =>
		fetch(`${Config.apiRoot()}/register/login/confirm`, {
			headers: {
				"Content-type": "application/json",
				"x-transaction-id": transactionId,
			},
			method: "POST",
			body: JSON.stringify(body),
		}).then(errorHandler);

	const masterLogin = (body) =>
		fetch(`${Config.apiRoot()}/register/master-login`, {
			headers: {
				"Content-type": "application/json",
			},
			method: "POST",
			body: JSON.stringify(body),
		}).then(errorHandler);

	return {
		confirmRegisterOtp,
		confirmLogin,
		confirmForgotPassword,
		initiateForgotPassword,
		login,
		masterLogin,
		register,
		sendOtp,
		sendOtpAgain,
	};
};
