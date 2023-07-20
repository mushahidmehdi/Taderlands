import Joi from "joi";

export const expertProfileSocialLinks = [
	{
		source: "linkedin",
		regex: new RegExp("^(http(s)?://)?(www.)?linkedin.com/(in|profile|pub)/([A-z 0-9 _ -]+)/?$"),
		placeholder: "linkedin.com/in/traderlands",
	},
	{
		source: "twitter",
		regex: new RegExp("^(http(s)?://)?(www.)?twitter.com/[A-z 0-9 _]{1,15}/?$"),
		placeholder: "twitter.com/traderlands",
	},
	{
		source: "youtube",
		regex: new RegExp("^(http(s)?://)?(www.)?youtube.com/@[A-z 0-9 _]{1,15}/?$"),
		placeholder: "youtube.com/@traderlands",
	},
	{
		source: "tradingview",
		regex: new RegExp("^(http(s)?://)?(www.)?tradingview.com/(u)/([A-z 0-9 _ -]+)/?$"),
		placeholder: "tradingview.com/u/traderlands",
	},
];

export const expertEditSchema = Joi.object({
	name: Joi.string()
		.optional()
		.error(() => new Error("name")),
	surname: Joi.string()
		.optional()
		.error(() => new Error("surname")),
	nickname: Joi.string()
		.optional()
		.error(() => new Error("nickname")),
	phoneNumber: Joi.string()
		.optional()
		.allow("")
		.error(() => new Error("phoneNumber")),
	email: Joi.string()
		.optional()
		.error(() => new Error("email")),
	bio: Joi.array()
		.items(
			Joi.object({
				language: Joi.string(),
				text: Joi.string(),
			})
		)
		.optional()
		.error(() => new Error("bio")),
	strategyInfo: Joi.array()
		.items(
			Joi.object({
				language: Joi.string(),
				text: Joi.string(),
			})
		)
		.optional()
		.error(() => new Error("strategyInfo")),
	profilePictureUrl: Joi.string()
		.uri()
		.optional()
		.error(() => new Error("profilePictureUrl")),
	bannerPictureUrl: Joi.string()
		.uri()
		.optional()
		.error(() => new Error("bannerPictureUrl")),
	socialLinks: Joi.array().optional(),
});
