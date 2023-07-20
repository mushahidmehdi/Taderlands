const { sendApiEndTimeReminderNotification } = require("./apiEndTimeReminder");

sendApiEndTimeReminderNotification();

process.on("exit", () => {
	console.log("Process shut down successfully.");
});
