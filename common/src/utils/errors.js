// Status is plain http status code
// error.code is implicit to paratica
const ERROR_MAP = require("../enums/error");

const setError = (ctx, status, errorType) => {
	ctx.body = { ...ctx.body, error: ERROR_MAP[errorType] };

	if (status) {
		ctx.status = status;
	}
};

module.exports = {
	setError,
};
