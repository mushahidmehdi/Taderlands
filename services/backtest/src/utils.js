const { orderBy } = require("lodash");

const MAP = {
	TIME: {
		KEY: "t", // Bar time. Unix timestamp (UTC)
		IX: 0,
	},
	CLOSING: {
		KEY: "c",
		IX: 4,
	},
	OPENING: {
		KEY: "o",
		IX: 1,
	},
	HIGH: {
		KEY: "h",
		IX: 2,
	},
	LOW: {
		KEY: "l",
		IX: 3,
	},
	VOLUME: {
		KEY: "v",
		IX: 5,
	},
};

const transformCandlesticks = (bars) =>
	bars.reduce((acc, curr) => {
		Object.values(MAP).map(({ KEY, IX }) => {
			acc[KEY] = [...(acc?.[KEY] ?? []), KEY === MAP.TIME.KEY ? curr[IX] / 1000 : curr[IX]];
		});
		return acc;
	}, {});

const transformMarks = (positions, executionType) => {
	let result = [];

	positions.forEach(({ enterDate, exitDate, exitSource }) => {
		result.push({
			id: Date.parse(enterDate) / 1000,
			time: Date.parse(enterDate) / 1000,
			color: ["SPOT", "LONG"].includes(executionType) ? "blue" : "red",
			text: `OPEN ${executionType} POSITION`,
			label: executionType,
			labelFontColor: "white",
			minSize: 20,
		});

		result.push({
			id: Date.parse(exitDate) / 1000,
			time: Date.parse(exitDate) / 1000,
			color: "yellow",
			text: exitSource,
			label: exitSource,
			labelFontColor: "black",
			minSize: 20,
		});
	});

	orderBy(result, ["time"], ["asc"]);

	return result;
};

module.exports = {
	transformCandlesticks,
	transformMarks,
};
