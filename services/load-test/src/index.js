const {
	getOpenSignals,
	getClosedPositionsCount,
	getOpenPositionsBySignalId,
	getOpenPositionsCount,
} = require("./services");

function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

async function execute() {
	try {
		getOpenPositionsCount();

		await sleep(100);

		await getClosedPositionsCount();

		await sleep(100);

		let openSignals = await getOpenSignals();

		await sleep(100);

		console.log("Open signals count: " + openSignals?.length);

		if (openSignals?.length < 5) {
			console.log("Not enough open signals");
			return;
		}

		for (const signal of openSignals) {
			await getOpenPositionsBySignalId(signal.id);
			await sleep(100);
		}

		openSignals = null;

		await sleep(200);
	} catch (e) {
		// console.log(e);

		console.log(e.message);
	}
}

async function main() {
	console.log("inside main");

	for (let i = 0; i < 3; i++) {
		await execute();
	}

	console.log("executed");

	await sleep(1 * 1000);

	await main();
}

main();
