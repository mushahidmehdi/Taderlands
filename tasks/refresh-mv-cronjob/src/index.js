const { refreshMaterializedView } = require("./materializedView");

refreshMaterializedView();

process.on("exit", () => {
	console.log("Process shut down successfully.");
});
