import { Config, useFetchAuthorized } from "services";

import { errorHandler } from "./errorHandler";

export const useUserApi = () => {
	const fetchAuthorized = useFetchAuthorized();

	const readNotification = JSON.stringify({
		data: {
			status: "Read",
		},
	});

	const getProfile = () =>
		fetchAuthorized(`${Config.apiRoot()}/user/profile`, {
			headers: {
				"Content-type": "application/json",
			},
			method: "GET",
		}).then(errorHandler);

	const getNotification = () =>
		fetchAuthorized(`${Config.apiRoot()}/user/notifications`, {
			headers: {
				"Content-type": "application/json",
			},
			method: "GET",
		}).then(errorHandler);

	const unreadANotification = (id) => {
		return fetchAuthorized(`${Config.apiRoot()}/user/notification/${id}`, {
			headers: {
				"Content-type": "application/json",
				Accept: "application/json",
			},
			method: "PUT",
			body: readNotification,
		}).then(errorHandler);
	};

	const readAllNotifications = () =>
		fetchAuthorized(`${Config.apiRoot()}/user/notification/`, {
			headers: {
				"Content-type": "application/json",
				Accept: "application/json",
			},
			method: "PUT",
			body: readNotification,
		}).then(errorHandler);

	const patchNotificationSettings = (notificationSetting) =>
		fetchAuthorized(`${Config.apiRoot()}/user/notification-setting`, {
			headers: {
				"Content-type": "application/json",
				Accept: "application/json",
			},
			method: "PATCH",
			body: JSON.stringify(notificationSetting),
		}).then(errorHandler);

	const updateContactInfo = ({ operation, transactionId, body }) =>
		fetchAuthorized(`${Config.apiRoot()}/user${operation.path}`, {
			headers: {
				"Content-type": "application/json",
				"x-transaction-id": transactionId,
			},
			method: operation.method,
			body: JSON.stringify(body),
		}).then(errorHandler);

	const getNotificationSettings = () =>
		fetchAuthorized(`${Config.apiRoot()}/user/notification-setting`, {
			headers: {
				"Content-type": "application/json",
				Accept: "application/json",
			},
			method: "GET",
		}).then(errorHandler);

	const getSecuritySettings = () =>
		fetchAuthorized(`${Config.apiRoot()}/user/security-settings`, {
			headers: {
				"Content-type": "application/json",
				Accept: "application/json",
			},
			method: "GET",
		}).then(errorHandler);

	const patchSecuritySettings = (method, body, transactionId) =>
		fetchAuthorized(`${Config.apiRoot()}/user/security-settings`, {
			headers: {
				"Content-type": "application/json",
				"x-transaction-id": transactionId,
			},
			method: method,
			body: JSON.stringify(body),
		}).then(errorHandler);

	const activateC2fa = (password) =>
		fetchAuthorized(`${Config.apiRoot()}/user/twofa`, {
			headers: {
				"Content-type": "application/json",
				Accept: "application/json",
			},
			method: "POST",
			body: JSON.stringify({ password }),
		}).then(errorHandler);

	const startTransaction = (operation, password) =>
		fetchAuthorized(`${Config.apiRoot()}/user/transaction/start`, {
			headers: {
				"Content-type": "application/json",
			},
			method: "POST",
			body: JSON.stringify({
				operation,
				password,
			}),
		}).then(errorHandler);

	const sendOtp = (method, transactionId) =>
		fetchAuthorized(`${Config.apiRoot()}/user/otp/${method}/request`, {
			headers: {
				"Content-type": "application/json",
				"x-transaction-id": transactionId,
			},
			method: "POST",
		}).then(errorHandler);

	const sendOtpWithoutTransaction = (body) =>
		fetchAuthorized(`${Config.apiRoot()}/user/otp/send`, {
			headers: {
				"Content-type": "application/json",
			},
			method: "POST",
			body: JSON.stringify(body),
		});

	const createTwoFaSettings = (key, twofaCode) =>
		fetchAuthorized(`${Config.apiRoot()}/user/twofa-settings`, {
			headers: {
				"Content-type": "application/json",
			},
			method: "POST",
			body: JSON.stringify({
				secret: key,
				otp: twofaCode,
			}),
		}).then(errorHandler);

	const createReferenceCode = (body) =>
		fetchAuthorized(`${Config.apiRoot()}/user/reference-code`, {
			headers: {
				"Content-type": "application/json",
			},
			method: "POST",
			body: JSON.stringify(body),
		}).then(errorHandler);

	const updateUsedReferenceCode = (body) =>
		fetchAuthorized(`${Config.apiRoot()}/user/reference-code`, {
			headers: {
				"Content-type": "application/json",
			},
			method: "PUT",
			body: JSON.stringify(body),
		}).then(errorHandler);

	const createTelegramCode = () =>
		fetchAuthorized(`${Config.apiRoot()}/user/telegram-code`, {
			headers: {
				"Content-type": "application/json",
			},
			method: "GET",
		}).then(errorHandler);

	const sendDeposit = (body) =>
		fetchAuthorized(`${Config.apiRoot()}/user/otp/send-deposit`, {
			headers: {
				"Content-type": "application/json",
			},
			method: "POST",
			body: JSON.stringify(body),
		}).then(errorHandler);

	const confirmDeposit = (body) =>
		fetchAuthorized(`${Config.apiRoot()}/user/otp/confirm-deposit`, {
			headers: {
				"Content-type": "application/json",
			},
			method: "POST",
			body: JSON.stringify(body),
		}).then(errorHandler);

	const updateAgreement = (body) =>
		fetchAuthorized(`${Config.apiRoot()}/user/agreement`, {
			headers: {
				"Content-type": "application/json",
			},
			method: "POST",
			body: JSON.stringify(body),
		}).then(errorHandler);

	return {
		activateC2fa,
		createTwoFaSettings,
		getProfile,
		getNotification,
		getNotificationSettings,
		getSecuritySettings,
		patchSecuritySettings,
		patchNotificationSettings,
		updateContactInfo,
		readAllNotifications,
		sendOtp,
		sendOtpWithoutTransaction,
		unreadANotification,
		createReferenceCode,
		updateUsedReferenceCode,
		createTelegramCode,
		sendDeposit,
		confirmDeposit,
		updateAgreement,
		startTransaction,
	};
};
