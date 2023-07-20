const { dbClient } = require("@paratica/common/prisma");
const mustache = require("mustache");
const i18n = require("../services/i18n");

const NOTIFICATION_TITLES = {
	API_END_TIME: "API_END_TIME",
	API_ERROR: "API_ERROR",
	BALANCE_WARNING: "BALANCE_WARNING",
	CONTACTINFOKEY: "CONTACTINFOKEY",
	DEPOSIT: "DEPOSIT",
	FAVORITE_PARITY_DELIST: "FAVORITE_PARITY_DELIST",
	LOGIN: "LOGIN",
	NEW_CAMPAIGN_BY_FAV_EXPERT: "NEW_CAMPAIGN_BY_FAV_EXPERT",
	NEW_DEVICE: "NEW_DEVICE",
	NEW_LEADERBOARD: "NEW_LEADERBOARD",
	NEW_MARKETING_CAMPAIGN: "NEW_MARKETING_CAMPAIGN",
	NEW_PORTFOLIO_EXCHANGE_RELEASE: "NEW_PORTFOLIO_EXCHANGE_RELEASE",
	NEW_POSITION_OPENED: "NEW_POSITION_OPENED",
	NEW_STRATEGY_BY_FAV_EXPERT: "NEW_STRATEGY_BY_FAV_EXPERT",
	NEW_STRATEGY_MARKETPLACE: "NEW_STRATEGY_MARKETPLACE",
	NEW_TRADING_EXCHANGE_RELEASE: "NEW_TRADING_EXCHANGE_RELEASE",
	OPEN_POSITION_PARITY_DELIST: "OPEN_POSITION_PARITY_DELIST",
	OPERATION: "OPERATION",
	OUT_OF_BALANCE: "OUT_OF_BALANCE",
	REGISTER: "REGISTER",
	FORGOT_PASSWORD: "FORGOT_PASSWORD",
	SECURITY_SETTINGS_UPDATE: "SECURITY_SETTINGS_UPDATE",
	UPDATE_ON_MARKET_STRATEGY_RULES: "UPDATE_ON_MARKET_STRATEGY_RULES",
	WITHDRAW: "WITHDRAW",
	LEGACY_USER_CREDIT_MIGRATION: "LEGACY_USER_CREDIT_MIGRATION",
	REGISTERED_WITH_REFERENCE_CODE: "REGISTERED_WITH_REFERENCE_CODE",
	REGISTERED_WITHOUT_REFERENCE_CODE: "REGISTERED_WITHOUT_REFERENCE_CODE",
	UPDATE_REFERENCE_CODE: "UPDATE_REFERENCE_CODE",
	WELCOME_TO_TRADERLANDS: "WELCOME_TO_TRADERLANDS",
	MERCHANT_ACCEPTED: "MERCHANT_ACCEPTED",
	MERCHANT_REJECTED: "MERCHANT_REJECTED",
	MERCHANT_PENDING: "MERCHANT_PENDING",
	WELCOME_BONUS_CREDIT: "WELCOME_BONUS_CREDIT",
	LOGIN_FROM_NEW_IP: "LOGIN_FROM_NEW_IP",
};

const {
	sendEmailNotification,
	sendTelegramNotification,
	sendPushNotification,
} = require("@backend/common/functions/notification");

const EMAIL_NOTIFICATION_TYPES = {
	DEPOSIT: "deposit",
	WITHDRAW: "withdraw",
	SECURITY_SETTINGS_UPDATE: "securitySettingsUpdate",
	LEGACY_USER_CREDIT_MIGRATION: "legacyUserCreditMigration",
	REGISTERED_WITH_REFERENCE_CODE: "registeredWithReferenceCode",
	REGISTERED_WITHOUT_REFERENCE_CODE: "registeredWithoutReferenceCode",
	UPDATE_REFERENCE_CODE: "updateReferenceCode",
	WELCOME_TO_TRADERLANDS: "welcomeToTraderlands",
	MERCHANT_ACCEPTED: "merchantAccepted",
	MERCHANT_REJECTED: "merchantRejected",
	MERCHANT_PENDING: "merchantPending",
	WELCOME_BONUS_CREDIT: "welcomeBonusCredit",
	FORGOT_PASSWORD: "forgotPassword",
	LOGIN_FROM_NEW_IP: "loginFromNewIp",
};

const SENDING_REASONS = [
	"wallet",
	"marketing",
	"accountCenter",
	"buySell",
	"stickers",
	"stopLoss",
	"takeProfit",
	"newPosition",
	"trailingStop",
];

async function _sendNotifications(body) {
	try {
		const newUserNotification = body.newUserNotification;
		if (!SENDING_REASONS.includes(body?.info?.reason)) {
			const responseData = {
				text: "INVALID_NOTIFICATION_REASON",
				code: 400,
			};
			return responseData;
		}

		const userId = body.to;

		const user = await dbClient.user.findFirst({
			where: {
				id: userId,
			},
			select: {
				userNotificationSetting: true,
				deviceInfo: true,
				id: true,
				email: true,
				phoneNumber: true,
			},
		});

		const notificationTemplate = await dbClient.notificationTemplate.findUnique({
			where: {
				title: body.content.title,
			},
		});

		if (!notificationTemplate) {
			const responseData = {
				text: "INVALID_NOTIFICATIOINVALID_NOTIFICATION_TITLEN_REASON",
				code: 400,
			};
			return responseData;
		}

		if (!user.userNotificationSetting || !user.userNotificationSetting.language) {
			const responseData = {
				text: "NO_USER_NOTIFICATION_OR_USER_NOTIFICATION_SETTING_EXISTS",
				code: 400,
			};
			return responseData;
		}

		const language = "en";

		if (body.content?.params?.errorCode) {
			i18n.setLocale(language);

			const tradingServicesErrorLog = i18n.__("tradingServicesErrorLog");
			const comment = tradingServicesErrorLog.comment[body.content.params.errorCode];
			const reason = tradingServicesErrorLog.reason[body.content.params.errorCode];

			body.content.params.errorText = reason ? reason + " " + comment : tradingServicesErrorLog.reason["500x"];
		}

		let content = {
			subject: mustache.render(notificationTemplate?.subject[language], body.content.params),
			body: mustache.render(notificationTemplate?.body[language], body.content.params),
		};
		const sendNotificationBody = content.body.replace(/<br>/g, "\n");

		if (
			newUserNotification ||
			(EMAIL_NOTIFICATION_TYPES[notificationTemplate.title] &&
				user.userNotificationSetting?.emailNotification &&
				(user.userNotificationSetting?.emailNotificationSettings[body.info.reason] ||
					(user.userNotificationSetting?.emailNotificationSettings.positionNotification &&
						user.userNotificationSetting?.positionNotificationSettings[body.info.reason])))
		) {
			const mailContent = content.body;
			const mailBody = mustache.render(notificationTemplate.htmlCode, { mailContent });

			await sendEmailNotification(user.email, content.subject, mailBody, body.imageUrl, body.data);
		}

		if (
			user.userNotificationSetting?.telegramNotification &&
			(user.userNotificationSetting?.telegramNotificationsSettings[body.info.reason] ||
				(user.userNotificationSetting?.telegramNotificationsSettings.positionNotification &&
					user.userNotificationSetting?.positionNotificationSettings[body.info.reason]))
		) {
			if (user.deviceInfo?.telegramId) {
				await sendTelegramNotification(
					user.deviceInfo.telegramId,
					content.subject,
					sendNotificationBody,
					body.imageUrl,
					body.data
				);
			}
		}

		if (
			user.userNotificationSetting?.appNotification &&
			(user.userNotificationSetting?.appNotificationSettings[body.info.reason] ||
				(user.userNotificationSetting?.appNotificationSettings.positionNotification &&
					user.userNotificationSetting?.positionNotificationSettings[body.info.reason]))
		) {
			const data = {
				...body.data,
				redirection: notificationTemplate.redirect.id,
			};

			if (user.deviceInfo.android?.fcmToken) {
				await sendPushNotification(
					user.deviceInfo.android.fcmToken,
					content.subject,
					sendNotificationBody,
					body.imageUrl,
					data
				);
			}

			if (user.deviceInfo.ios?.fcmToken) {
				await sendPushNotification(
					user.deviceInfo.ios.fcmToken,
					content.subject,
					sendNotificationBody,
					body.imageUrl,
					data
				);
			}
		}

		content.body = sendNotificationBody;

		if (body.saveToDatabase) {
			const notificationData = {
				userId: user.id,
				info: body.info,
				content,
				sendingType: body.sendingType,
				expireAt: body.expireAt,
				imageUrl: body.imageUrl,
				data: body.data,
			};

			const notification = await dbClient.notification.create({
				data: {
					...notificationData,
					createdBy: userId,
				},
			});
		}

		const responseData = {
			text: "ok",
			code: 200,
		};
		return responseData;
	} catch (error) {
		const responseData = {
			text: "ERROR",
			code: 400,
		};
		return responseData;
	}
}

module.exports = { _sendNotifications, NOTIFICATION_TITLES, SENDING_REASONS };
