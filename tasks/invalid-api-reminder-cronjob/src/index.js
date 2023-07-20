const { sendInvalidApiReminderNotification } = require("./invalidApiReminder");

sendInvalidApiReminderNotification();

process.on("exit", () => {
	console.log("Process shut down successfully.");
});
