const { updateUserFields } = require("./marketingFeeder");

updateUserFields();

process.on("exit", () => {
	console.log("Process shut down successfully.");
});
