BigInt.prototype.toJSON = function () {
	return this.toString();
};

const { startPortfolioCronJob } = require("./portfolioCronjob");

startPortfolioCronJob();

process.on("exit", () => {
	console.log("Process shut down successfully.");
});
