const Joi = require("joi");

function isNumeric(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
}

const validate = (rule) => ({
	...rule,
	G: rule.G.map((group) => {
		return {
			...group,
			R: group.R.map((rule) => {
				return {
					...rule,
					...["R0", "R1", "R2"].reduce((acc, curr) => {
						if (typeof rule?.[curr] === "undefined") {
							return acc;
						}

						if (!isNumeric(rule?.[curr].toString().replace(",", "."))) {
							throw new Joi.ValidationError("There are invalid decimal values on rule definition.");
						}

						acc = { ...acc, [curr]: parseFloat(rule[curr].toString().replace(",", ".")) };

						return acc;
					}, {}),
				};
			}),
		};
	}),
});

module.exports = { validate };
