const { updateUserLists } = require("./euroMessage");

updateUserLists();

process.on("exit", () => {
	console.log("Process shut down successfully.");
});
