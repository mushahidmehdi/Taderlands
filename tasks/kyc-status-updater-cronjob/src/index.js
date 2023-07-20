const { updateKycStatus } = require("./kycStatusUpdater");

updateKycStatus();

process.on("exit", () => {
	console.log("Process shut down successfully.");
});
