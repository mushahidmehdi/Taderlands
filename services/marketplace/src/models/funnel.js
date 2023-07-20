const Joi = require("joi");

const { STATUS_TYPES } = require("../constants");

const Funnel = Joi.object({
	info: Joi.object({
		title: Joi.object().optional(),
		imageUrl: Joi.string().uri().allow("").required(),
	}),
	type: Joi.object({
		featured: Joi.boolean(),
		topBanner: Joi.boolean(),
		order: Joi.number().min(1),
	}),
	query: Joi.object(),
	status: Joi.string()
		.required()
		.allow({ values: Object.values(STATUS_TYPES) }),
}).error(new Joi.ValidationError(`Bad request : Funnel`));

const FunnelUpdate = Joi.object({
	info: Joi.object({
		title: Joi.object().optional(),
		imageUrl: Joi.string().optional(),
	}),
	type: Joi.object({
		featured: Joi.boolean().optional(),
		topBanner: Joi.boolean().optional(),
		order: Joi.number().min(1).optional(),
	}),
	query: Joi.object().optional(),
	status: Joi.string()
		.allow({ values: Object.values(STATUS_TYPES) })
		.optional(),
}).error(new Joi.ValidationError(`Bad request : FunnelUpdate`));

module.exports = {
	Funnel,
	FunnelUpdate,
};
