const STATUS_TYPES = {
	INITIALIZE: "INITIALIZE",
	PENDING: "PENDING",
	DONE: "DONE",
	ERROR: "ERROR",
	INSUFFICIENT: "INSUFFICIENT",
	DECLINED: "DECLINED",
	CANCELLED: "CANCELLED",
};

const TYPES = {
	REAL: "REAL",
	BONUS: "BONUS",
};

const SOURCE_TYPES = {
	SYSTEM: "SYSTEM",
	STRATEGY: "STRATEGY",
	REFERENCE: "REFERENCE",
	COLLABORATION: "COLLABORATION",
};

const REQUEST_TYPES = {
	INITIALIZE: "INITIALIZE",
	CALLBACK: "CALLBACK",
};

const STATUS_TYPES_MAP = {
	initialize: STATUS_TYPES.INITIALIZE,
	pending: STATUS_TYPES.PENDING,
	confirmed: STATUS_TYPES.DONE,
	error: STATUS_TYPES.ERROR,
	declined: STATUS_TYPES.DECLINED,
	cancelled: STATUS_TYPES.CANCELLED,
};

module.exports = { STATUS_TYPES, REQUEST_TYPES, SOURCE_TYPES, TYPES, STATUS_TYPES_MAP };
