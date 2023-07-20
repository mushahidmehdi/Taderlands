const Joi = require("joi");

const { STATUS_TYPES } = require("../constants");

const CreateMerchant = Joi.object({
	nickname: Joi.string().required(),
	bio: Joi.array()
		.items(
			Joi.object({
				language: Joi.string(),
				text: Joi.string().allow("").optional(),
			})
		)
		.optional(),
	name: Joi.string().max(250).required(),
	surname: Joi.string().max(250).required(),
	strategyInfo: Joi.array()
		.items(
			Joi.object({
				language: Joi.string(),
				text: Joi.string().allow("").optional(),
			})
		)
		.optional(),
	profilePictureUrl: Joi.string().uri().required(),
	bannerPictureUrl: Joi.string().uri().optional(),
	socialLinks: Joi.array().optional(),
	phoneNumber: Joi.string().optional(),
	email: Joi.string().optional(),
}).error(new Joi.ValidationError(`type error : Merchant`));

const UpdateMerchant = Joi.object({
	nickname: Joi.string().optional(),
	bio: Joi.array()
		.items(
			Joi.object({
				language: Joi.string(),
				text: Joi.string().allow("").optional(),
			})
		)
		.optional(),
	name: Joi.string().max(250).optional(),
	surname: Joi.string().max(250).optional(),
	strategyInfo: Joi.array()
		.items(
			Joi.object({
				language: Joi.string(),
				text: Joi.string().allow("").optional(),
			})
		)
		.optional(),
	profilePictureUrl: Joi.string().uri().required(),
	bannerPictureUrl: Joi.string().uri().optional(),
	socialLinks: Joi.array().optional(),
	phoneNumber: Joi.string().optional(),
	email: Joi.string().optional(),
}).error(new Joi.ValidationError(`type error : Merchant`));

const MerchantStatus = Joi.object({
	progress: Joi.object({
		status: Joi.string()
			.required()
			.allow({ values: Object.values(STATUS_TYPES) }),
		reason: Joi.string(),
	}).required(),
}).error(new Joi.ValidationError(` type error: MerchantStatus`));

module.exports = {
	UpdateMerchant,
	CreateMerchant,
	MerchantStatus,
};
