const { sendMarketingReminderEmail } = require("./marketingReminder");

sendMarketingReminderEmail();

process.on("exit", () => {
	console.log("Process shut down successfully.");
});
