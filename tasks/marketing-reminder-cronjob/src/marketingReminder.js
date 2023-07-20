const { dbClient } = require("@paratica/common/prisma");
const mustache = require("mustache");
const dayjs = require("dayjs");

const TEMPLATE_TITLE_API_MAP = {
	1: "NO_API_CONNECTION_STEP_1", // The user signed up and didn’t connect API in 24 hours
	7: "NO_API_CONNECTION_STEP_2", // The user signed up and didn’t connect API in 7 days
	14: "NO_API_CONNECTION_STEP_3", // The user signed up and didn’t connect API in 14 days
	30: "NO_API_CONNECTION_STEP_4", // The user signed up and didn’t connect API in 30 days
};

const TEMPLATE_TITLE_STRATEGY_MAP = {
	1: "NO_STRATEGY_FOLLOW_STEP_1", // The user signed up and didn’t follow a strategy in 24 hours
	7: "NO_STRATEGY_FOLLOW_STEP_2", // The user signed up and didn’t follow a strategy in 7 days
	14: "NO_STRATEGY_FOLLOW_STEP_3", // The user signed up and didn’t follow a strategy in 14 days
	28: "NO_STRATEGY_FOLLOW_STEP_4", // The user signed up and didn’t follow a strategy in 28 days
};

const { sendEmailNotification } = require("@backend/common/functions/notification");

async function notificationSender(user, notificationTemplateTitle) {
	if (
		!user.userNotificationSetting?.emailNotification ||
		!user.userNotificationSetting?.emailNotificationSettings?.marketing
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

	const params = {};

	const language = "en";
	const content = {
		subject: mustache.render(notificationTemplate?.subject[language], params),
		body: mustache.render(notificationTemplate?.body[language], params),
	};

	const mailContent = content.body;
	const mailBody = mustache.render(notificationTemplate.htmlCode, { mailContent });

	await sendEmailNotification(user.email, content.subject, mailBody);
	return true;
}

async function sendMarketingReminderEmail() {
	try {
		const nodeEnv = process.env.NODE_ENV;
		const dateControlRange = process.env.DATE_CONTROL_RANGE;

		if (nodeEnv !== "production") {
			console.log("Not on production!");
			process.exit(0);
			return;
		}

		const user = await dbClient.user.findMany({
			where: {
				OR: [{ NOT: { userApiConnections: { some: {} } } }, { NOT: { strategyFollowers: { some: {} } } }],
				createdAt: {
					gte: dayjs().subtract(dateControlRange, "day").toDate(),
				},
				OR: [
					{
						migrationInfo: {
							path: ["migrated"],
							equals: true,
						},
					},
					{
						migrationInfo: undefined,
					},
				],
			},
			include: {
				userNotificationSetting: true,
				userApiConnections: true,
				strategyFollowers: true,
			},
		});

		const promiseList = [];

		console.log("User list length: ", user.length);

		for (let i = 0; i < user.length; i++) {
			const currentDate = dayjs();
			const userCreatedDate = dayjs(user[i].createdAt);
			const dayDifferenceCount = currentDate.diff(userCreatedDate, "day");

			if (user[0].userApiConnections.length === 0 && TEMPLATE_TITLE_API_MAP[dayDifferenceCount]) {
				promiseList.push(notificationSender(user[i], TEMPLATE_TITLE_API_MAP[dayDifferenceCount]));
			}

			if (user[0].strategyFollowers.length === 0 && TEMPLATE_TITLE_STRATEGY_MAP[dayDifferenceCount]) {
				promiseList.push(notificationSender(user[i], TEMPLATE_TITLE_STRATEGY_MAP[dayDifferenceCount]));
			}
		}

		await Promise.all(promiseList);

		console.log("Executed successfully.");

		return;
	} catch (e) {
		console.log(e);
	} finally {
		process.exit(0);
	}
}

module.exports = { sendMarketingReminderEmail };
