export const KEYS = {
	CLAUSE: "C",
	GROUP: "G",
	NAME: "N",
	RULES: "R",
	LEFT_EXCHANGE: "LE",
	LEFT_PAIR: "LP",
	LEFT_INTERVAL: "LI",
	LEFT_INDICATOR: "LD",
	LEFT_INDEX: "LX",
	LEFT_PARAMS: "LeftParams",
	OPERATOR: "OP",
	RIGHT_EXCHANGE: "RE",
	RIGHT_PAIR: "RP",
	RIGHT_INTERVAL: "RI",
	RIGHT_INDICATOR: "RD",
	RIGHT_INDEX: "RX",
	RIGHT_PARAMS: "RightParams",
	RIGHT_VALUE: "R0",
	RIGHT_RANGE_MIN: "R1",
	RIGHT_RANGE_MAX: "R2",
};

export const INDEX_TEXT = {
	0: "Open Bar",
	1: "Closed Bar -1",
	2: "Closed Bar -2",
	3: "Closed Bar -3",
	4: "Closed Bar -4",
	5: "Closed Bar -5",
	6: "Closed Bar -6",
	7: "Closed Bar -7",
	8: "Closed Bar -8",
	9: "Closed Bar -9",
};

export const INDEX_TEXT_RENDER = {
	0: "Open Bar",
	1: "Closed -1",
	2: "Closed -2",
	3: "Closed -3",
	4: "Closed -4",
	5: "Closed -5",
	6: "Closed -6",
	7: "Closed -7",
	8: "Closed -8",
	9: "Closed -9",
};

export const VALUES = {
	ENTER: 1,
	EXIT: 2,

	SHORT_ENTER: 3,
	SHORT_EXIT: 4,

	AND: 1,
	OR: 2,

	INDICATOR_EQUAL: 11,
	INDICATOR_NOT_EQUAL: 12,
	INDICATOR_GREATER_THAN: 13,
	INDICATOR_GREATER_THAN_OR_EQUAL: 14,
	INDICATOR_LOWER_THAN: 15,
	INDICATOR_LOWER_THAN_OR_EQUAL: 16,

	VALUE_EQUAL: 21,
	VALUE_NOT_EQUAL: 22,
	VALUE_GREATER_THAN: 23,
	VALUE_GREATER_THAN_OR_EQUAL: 24,
	VALUE_LOWER_THAN: 25,
	VALUE_LOWER_THAN_OR_EQUAL: 26,

	RANGE_BETWEEN: 31,
	RANGE_NOT_BETWEEN: 32,
	RANGE_BETWEEN_OR_EQUAL: 33,
	RANGE_NOT_BETWEEN_OR_EQUAL: 34,

	LIST_IN: 41,
	LIST_NOT_IN: 42,
};

export const OPERATION_MAP = {
	Indicator: {
		"=": VALUES.INDICATOR_EQUAL,
		"!=": VALUES.INDICATOR_NOT_EQUAL,
		">": VALUES.INDICATOR_GREATER_THAN,
		">=": VALUES.INDICATOR_GREATER_THAN_OR_EQUAL,
		"<": VALUES.INDICATOR_LOWER_THAN,
		"<=": VALUES.INDICATOR_LOWER_THAN_OR_EQUAL,
	},
	Value: {
		"=": VALUES.VALUE_EQUAL,
		"!=": VALUES.VALUE_NOT_EQUAL,
		">": VALUES.VALUE_GREATER_THAN,
		">=": VALUES.VALUE_GREATER_THAN_OR_EQUAL,
		"<": VALUES.VALUE_LOWER_THAN,
		"<=": VALUES.VALUE_LOWER_THAN_OR_EQUAL,
	},
	Range: {
		Between: VALUES.RANGE_BETWEEN,
		"Not Between": VALUES.RANGE_NOT_BETWEEN,
		"Between or Equal": VALUES.RANGE_BETWEEN_OR_EQUAL,
		"Not Between or Equal": VALUES.RANGE_NOT_BETWEEN_OR_EQUAL,
	},
};

export const REVERSE_OPERATION_MAP = {
	[VALUES.INDICATOR_EQUAL]: {
		value: "=",
		label: "=",
		type: "Indicator",
	},
	[VALUES.INDICATOR_NOT_EQUAL]: {
		value: "!=",
		label: "!=",
		type: "Indicator",
	},
	[VALUES.INDICATOR_GREATER_THAN]: {
		value: ">",
		label: ">",
		type: "Indicator",
	},
	[VALUES.INDICATOR_GREATER_THAN_OR_EQUAL]: {
		value: ">=",
		label: ">=",
		type: "Indicator",
	},
	[VALUES.INDICATOR_LOWER_THAN]: {
		value: "<",
		label: "<",
		type: "Indicator",
	},
	[VALUES.INDICATOR_LOWER_THAN_OR_EQUAL]: {
		value: "<=",
		label: "<=",
		type: "Indicator",
	},
	[VALUES.VALUE_EQUAL]: {
		value: "=",
		label: "=",
		type: "Value",
	},
	[VALUES.VALUE_NOT_EQUAL]: {
		value: "!=",
		label: "!=",
		type: "Value",
	},
	[VALUES.VALUE_GREATER_THAN]: {
		value: ">",
		label: ">",
		type: "Value",
	},
	[VALUES.VALUE_GREATER_THAN_OR_EQUAL]: {
		value: ">=",
		label: ">=",
		type: "Value",
	},
	[VALUES.VALUE_LOWER_THAN]: {
		value: "<",
		label: "<",
		type: "Value",
	},
	[VALUES.VALUE_LOWER_THAN_OR_EQUAL]: {
		value: "<=",
		label: "<=",
		type: "Value",
	},
	[VALUES.RANGE_BETWEEN]: {
		value: "Between",
		label: "Btw",
		type: "Range",
	},
	[VALUES.RANGE_NOT_BETWEEN]: {
		value: "Not Between",
		label: "Not Btw",
		type: "Range",
	},
	[VALUES.RANGE_BETWEEN_OR_EQUAL]: {
		value: "Between or Equal",
		label: "Btw E",
		type: "Range",
	},
	[VALUES.RANGE_NOT_BETWEEN_OR_EQUAL]: {
		value: "Not Between or Equal",
		label: "N Btw E",
		type: "Range",
	},
};

// IMPORTANT: Right now (21-07-2022), possible intervals are the same for all platforms
// In the future, when new platforms are to be added, this section should be updated.
export const PLATFORM_INTERVALS = [
	{
		duration: 5,
		name: "5m",
	},
	{
		duration: 15,
		name: "15m",
	},
	{
		duration: 60,
		name: "1h",
	},
	{
		duration: 240,
		name: "4h",
	},
	{
		duration: 1440,
		name: "1d",
	},
];
