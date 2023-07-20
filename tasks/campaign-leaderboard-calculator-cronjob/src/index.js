const { calculateLeaderboardRank } = require("./leaderboardCalculator");

calculateLeaderboardRank();

process.on("exit", () => {
	console.log("Process shut down successfully.");
});
