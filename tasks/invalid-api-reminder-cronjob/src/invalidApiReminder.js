const { dbClient } = require("@paratica/common/prisma");
const mustache = require("mustache");
const dayjs = require("dayjs");

const { sendEmailNotification } = require("@backend/common/functions/notification");

const TEMPLATE_TITLE_API_MAP = {
	0: "INVALID_API_REMINDER_STEP_0", // Same time API error occurs
	2: "INVALID_API_REMINDER_STEP_1", // 2 hours after API error occurs
	12: "INVALID_API_REMINDER_STEP_2", // 12 hours after API error occurs
	24: "INVALID_API_REMINDER_STEP_3", // 24 hours after API error occurs
	36: "INVALID_API_REMINDER_STEP_4", // 36 hours after API error occurs
	48: "INVALID_API_REMINDER_STEP_4", // 48 hours after API error occurs
	72: "INVALID_API_REMINDER_STEP_4", // 72 hours after API error occurs
	96: "INVALID_API_REMINDER_STEP_4", // 96 hours after API error occurs
};

async function sendInvalidApiReminderNotification() {
	try {
		const dateControlRange = process.env.DATE_CONTROL_RANGE;
		const controlDate = dayjs().add(-dateControlRange, "day").toDate();
	
		const userApiConnections = await dbClient.userApiConnection.findMany({
			where: {
				restrictions: {
					path: ["isValid"],
					equals: false,
				},
				updatedAt: {
					gte: controlDate,
				},
			},
			include: {
				user: {
					select: {
						email: true,
						userNotificationSetting: true,
					},
				},
				platform: {
					select: {
						name: true,
					},
				},
			},
		});
	
		console.log("User api connections list length: ", userApiConnections.length);
	
		const promiseList = [];
	
		for (let i = 0; i < userApiConnections.length; i++) {
			const currentDate = dayjs();
			const apiConnectionUpdatedAt = dayjs(userApiConnections[i].updatedAt);
			const hourDifferenceCount = currentDate.diff(apiConnectionUpdatedAt, "hour");
	
			if (TEMPLATE_TITLE_API_MAP[hourDifferenceCount]) {
				promiseList.push(notificationSender(userApiConnections[i], TEMPLATE_TITLE_API_MAP[hourDifferenceCount]));
			}
		}
	
		await Promise.all(promiseList);
	
		console.log("Executed successfully");
	
		return;
	} catch(e) {
		console.log(e);
	} finally {
		process.exit(0);
	}
}

async function notificationSender(userApiConnection, notificationTemplateTitle) {
	if (
		!userApiConnection.user.userNotificationSetting?.emailNotification ||
		!userApiConnection.user.userNotificationSetting?.emailNotificationSettings?.accountCenter
	) {
		return;
	}

	const notificationTemplate = await dbClient.notificationTemplate.findUnique({
		where: {
			title: notificationTemplateTitle,
		},
	});

	if (!notificationTemplate) {
		console.log("NO_NOTIFICATION_TEMPLATE_FOUND");
		return;
	}

	const params = {
		platformName: userApiConnection.platform.name + "(" + userApiConnection.name + ")",
	};

	const language = "en";
	const content = {
		subject: mustache.render(notificationTemplate?.subject[language], params),
		body: mustache.render(notificationTemplate?.body[language], params),
	};

	const mailContent = content.body;
	const mailBody = mustache.render(notificationTemplate.htmlCode, { mailContent });

	await sendEmailNotification(userApiConnection.user.email, content.subject, mailBody);
	return true;
}

module.exports = { sendInvalidApiReminderNotification };
