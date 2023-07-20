const Joi = require("joi");

const { STATUS_TYPES } = require("../constants");

const Story = Joi.object({
	info: Joi.object({
		en: Joi.object({
			text: Joi.string().allow("").required(),
			imageUrl: Joi.string().uri().allow("").required(),
			url: Joi.string().uri().allow("").required(),
		}).required(),
		tr: Joi.object({
			text: Joi.string().allow("").required(),
			imageUrl: Joi.string().uri().allow("").required(),
			url: Joi.string().uri().allow("").required(),
		}).required(),
	}),
	topicId: Joi.number().required(),
	status: Joi.string()
		.required()
		.allow({ values: Object.values(STATUS_TYPES) }),
}).error(new Joi.ValidationError(`Bad request.`));

const StoryUpdate = Joi.object({
	info: Joi.object({
		en: Joi.object({
			text: Joi.string().allow("").required(),
			imageUrl: Joi.string().uri().allow("").required(),
			url: Joi.string().uri().allow("").required(),
		}).required(),
		tr: Joi.object({
			text: Joi.string().allow("").required(),
			imageUrl: Joi.string().uri().allow("").required(),
			url: Joi.string().uri().allow("").required(),
		}).required(),
	}),
	topicId: Joi.number().optional(),
	status: Joi.string()
		.allow({ values: Object.values(STATUS_TYPES) })
		.optional(),
}).error(new Joi.ValidationError(`Bad request.`));

module.exports = {
	Story,
	StoryUpdate,
};
