const { mqConnectionEmitter, createChannelWrapper, publishMessage } = require("@backend/common/services/rabbitmq");

const SENDING_TYPES = {
	SINGLE_NOTIFICATION: "singleNotification",
	ALL_USER_NOTIFICATION: "allUserNotification",
	EMAIL_NOTIFICATION: "emailNotification",
	TELEGRAM_NOTIFICATION: "telegramNotification",
};

mqConnectionEmitter.on("connected", () => {
	createChannelWrapper({
		name: "singleNotification",
		exchange: "notification",
		queue: "notification_queue_notification",
		routingKey: "notification.send",
	});

	createChannelWrapper({
		name: "allUserNotification",
		exchange: "notification",
		queue: "notification_queue_notification",
		routingKey: "notification.topic",
	});

	createChannelWrapper({
		name: "emailNotification",
		exchange: "email",
		queue: "email_queue_email",
		routingKey: "email.send",
	});

	createChannelWrapper({
		name: "telegramNotification",
		exchange: "telegram",
		queue: "telegram_queue_telegram",
		routingKey: "telegram.send",
	});
});

function sendEmailNotification(recipients, mailSubject, mailbody) {
	return publishMessage(SENDING_TYPES.EMAIL_NOTIFICATION, {
		sender: "noreply@traderlands.com",
		recipients: [recipients],
		subject: mailSubject,
		body: mailbody,
	});
}

function sendTelegramNotification(recipients, title, message, imageUrl, data) {
	return publishMessage(SENDING_TYPES.TELEGRAM_NOTIFICATION, {
		recipients,
		title,
		message,
		imageUrl,
		data,
	});
}

function sendPushNotification(recipients, title, message, imageUrl, data) {
	return publishMessage(SENDING_TYPES.SINGLE_NOTIFICATION, {
		recipients,
		title,
		message,
		imageUrl,
		data,
	});
}

module.exports = { sendEmailNotification, sendTelegramNotification, sendPushNotification };
