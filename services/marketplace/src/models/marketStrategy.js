const Joi = require("joi");

const { STATUS_TYPES, LANGUAGE_SHORT_CODE_LIST } = require("../constants");

const MarketStrategy = Joi.object({
	strategyId: Joi.string().required(),
	name: Joi.string().required(),
	explanations: Joi.object()
		.pattern(
			LANGUAGE_SHORT_CODE_LIST,
			Joi.object({
				text: Joi.string().optional(),
			})
		)
		.optional(),
	pricing: Joi.object({
		type: Joi.string().optional(),
		duration: Joi.string().optional(),
		amount: Joi.number().optional(),
	}).optional(),
	onDiscount: Joi.boolean().required(),
	status: Joi.string()
		.required()
		.allow({ values: Object.values(STATUS_TYPES) }),
}).error(new Joi.ValidationError(`Bad request.`));

const MarketStrategyStatus = Joi.object({
	status: Joi.string()
		.required()
		.allow({ values: Object.values(STATUS_TYPES) }),
}).error(new Joi.ValidationError(` type error`));

module.exports = {
	MarketStrategy,
	MarketStrategyStatus,
};
