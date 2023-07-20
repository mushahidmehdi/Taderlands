const CHANNELS = {
	EMAIL: "EMAIL",
	NOTIFICATION: "NOTIFICATION",
};

const CHANNEL_MAP = {
	EMAIL: {
		exchange: "email",
		queue: "email_queue_email",
		routingKey: "email.send",
	},
	NOTIFICATION: {
		exchange: "notification",
		queue: "notification_queue_notification",
		routingKey: "notification.send",
	},
};

module.exports = {
	CHANNEL_MAP,
	CHANNELS,
};
