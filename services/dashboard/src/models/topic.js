const Joi = require("joi");

const { STATUS_TYPES } = require("../constants");

const Topic = Joi.object({
	info: Joi.object({
		en: Joi.object({
			title: Joi.string().allow("").required(),
			explanation: Joi.string().allow("").required(),
		}).required(),
		tr: Joi.object({
			title: Joi.string().allow("").required(),
			explanation: Joi.string().allow("").required(),
		}).required(),
		imageUrl: Joi.string().uri().allow("").required(),
	}),
	status: Joi.string()
		.required()
		.allow({ values: Object.values(STATUS_TYPES) }),
}).error(new Joi.ValidationError(`Bad request : Topic`));

const TopicUpdate = Joi.object({
	info: Joi.object({
		en: Joi.object({
			title: Joi.string().allow("").required(),
			explanation: Joi.string().allow("").required(),
		}).required(),
		tr: Joi.object({
			title: Joi.string().allow("").required(),
			explanation: Joi.string().allow("").required(),
		}).required(),
		imageUrl: Joi.string().uri().allow("").required(),
	}),
	status: Joi.string()
		.allow({ values: Object.values(STATUS_TYPES) })
		.optional(),
}).error(new Joi.ValidationError(`Bad request : TopicUpdate`));

module.exports = {
	Topic,
	TopicUpdate,
};
