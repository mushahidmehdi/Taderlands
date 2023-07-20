const { dbClient } = require("@paratica/common/prisma");
const mustache = require("mustache");
const dayjs = require("dayjs");

const { sendEmailNotification } = require("@backend/common/functions/notification");

async function sendApiEndTimeReminderNotification() {
	try {
		const notificationTemplateTitle = process.env.NOTIFICATION_TEMPLATE_TITLE;

		const dateControlRange = process.env.DATE_CONTROL_RANGE;
		const controlDate = dayjs().add(dateControlRange, "day").toDate();

		const userApiConnections = await dbClient.userApiConnection.findMany({
			where: {
				details: {
					path: ["expireDate"],
					lt: controlDate,
					gte: dayjs().toDate(),
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

		const notificationTemplate = await dbClient.notificationTemplate.findUnique({
			where: {
				title: notificationTemplateTitle,
			},
		});

		if (!notificationTemplate) {
			console.log("NO_NOTIFICATION_TEMPLATE_FOUND");
			return next();
		}

		console.log("User api connections list length: ", userApiConnections.length);

		for (let i = 0; i < userApiConnections.length; i++) {
			const user = userApiConnections[i].user;
			const params = {
				platformName: userApiConnections[i].platform?.name,
			};

			if (
				!user.userNotificationSetting?.emailNotification ||
				!user.userNotificationSetting?.emailNotificationSettings?.accountCenter
			) {
				console.log("for user : ", user.email, " email notification is not enabled");
				continue;
			}
			const language = "en";
			const content = {
				subject: mustache.render(notificationTemplate?.subject[language], params),
				body: mustache.render(notificationTemplate?.body[language], params),
			};

			const mailContent = content.body;
			const mailBody = mustache.render(notificationTemplate.htmlCode, { mailContent });

			await sendEmailNotification(user.email, content.subject, mailBody);
		}

		console.log("Executed successfully.");
	} catch (e) {
		console.log(e);
	} finally {
		process.exit(0);
	}
}

module.exports = { sendApiEndTimeReminderNotification };
