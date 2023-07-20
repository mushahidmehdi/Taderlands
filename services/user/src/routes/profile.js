const Router = require("koa-router");
const Joi = require("joi");
const qrcode = require("qrcode");
const axios = require("axios");

const { dbClient } = require("@paratica/common/prisma");
const rateLimit = require("@backend/common/middlewares/rateLimit");

const {
	REGEXP_PASSWORD,
	REGEXP_EMAIL,
	REGEXP_PHONE_NUMBER,
	MAXIMUM_EMAIL_LENGTH,
	MAXIMUM_PHONE_NUMBER_LENGTH,
	MAXIMUM_PASSWORD_LENGTH,
} = require("@backend/common/enums/regularExpressions.js");

const profileSchema = Joi.object({
	email: Joi.string().regex(new RegExp(REGEXP_EMAIL)).optional().max(MAXIMUM_EMAIL_LENGTH),
	phoneNumber: Joi.string().regex(new RegExp(REGEXP_PHONE_NUMBER)).optional().max(MAXIMUM_PHONE_NUMBER_LENGTH),
	password: Joi.string().optional().regex(new RegExp(REGEXP_PASSWORD)).max(MAXIMUM_PASSWORD_LENGTH),
	name: Joi.string().optional(),
	surname: Joi.string().optional(),
}).error(
	new Joi.ValidationError(
		`phoneNumber or email required password must be  At least 8 characters A mixture of letters and numbers Inclusion of at least one special character, e.g., ! @ # ? ]`
	)
);

/**
 * @route POST /example
 * @group example - create example
 *
 * @param {string} password.body.required - password - eg: shuffly,beurteletchat
 * @param {string} email.body.required - email - eg: shuffly,beurteletchat
 *
 * @returns {object} 200 - on success
 *
 * @security ApiKey
 */
async function postProfile(ctx, next) {
	const body = Joi.attempt(ctx.request.body, profileSchema);
	const userId = ctx.request.auth.userId;
	let data = {
		phoneNumber: body.phoneNumber,
		name: body.name,
		surname: body.surname,
	};

	const user = await dbClient.user.update({
		where: {
			id: userId,
		},
		data,
	});

	ctx.body.message = "ok";
	ctx.body.data = data;
	ctx.status = 200;

	return next();
}

async function getProfile(ctx, next) {
	const userId = ctx.request.auth.userId;

	let profile = await dbClient.user.findFirst({
		where: {
			id: userId,
		},
		select: {
			email: true,
			id: true,
			phoneNumber: true,
			baseFees: true,
			name: true,
			surname: true,
			emailVerificationStatus: true,
			phoneNumberVerificationStatus: true,
			paritiesCount: true,
			role: true,
			agreements: true,
			userSecuritySetting: {
				select: {
					twofaSecurityActive: true,
					emailSecurityActive: true,
					smsSecurityActive: true,
					ipSecurityActive: true,
					kycStatus: true,
				},
			},
			strategyFollowers: {
				where: {
					status: { not: "UNFOLLOWED" },
				},
				select: {
					status: true,
					strategy: {
						select: {
							id: true,
							name: true,
							public: true,
							marketStrategy: {
								select: {
									id: true,
									name: true,
									merchantId: true,
								},
							},
							platformId: true,
						},
					},
				},
			},
			merchant: {
				select: {
					id: true,
					nickname: true,
					progressStatus: true,
				},
			},
			usedReferenceCode: {
				include: { _count: { select: { usedBy: true } } },
			},
			ownedReferenceCodes: {
				where: {
					default: true,
				},
			},
			userBrief: {
				select: {
					successRatio: true,
					averagePositionDuration: true,
					totalVolume: true,
					totalProfit: true,
					averageProfit: true,
					totalProfitAmount: true,
					openPositionsCount: true,
					closedPositionsCount: true,
					isApiConnected: true,
					lastDepositDate: true,
				},
			},
		},
	});

	let totalUsedReferenceCode = 0;

	for (let i = 0; i < profile?.ownedReferenceCodes.length; i++) {
		const url = process.env.FRONTEND_URL + "/register?referenceCode=" + profile.ownedReferenceCodes[i].code;
		const qr = await qrcode.toDataURL(url);
		totalUsedReferenceCode += profile.ownedReferenceCodes[i]?._count?.usedBy
			? profile.ownedReferenceCodes[i]?._count?.usedBy
			: 0;

		if (qr) {
			profile.ownedReferenceCodes[i].qr = qr;
		}
	}
	if (profile) {
		profile.totalUsedReferenceCode = totalUsedReferenceCode;
	}

	ctx.body.message = "ok";
	ctx.body.data = { profile };
	ctx.status = 200;

	return next();
}

const ALLOWED_FILE_KEYS_REGEX =
	/merchant\/(profile_pictures|banner_pictures)\/\w{8}-\w{4}-\w{4}-\w{4}-\w{12}\.(?:jpg|gif|png)/;

const FileUpload = Joi.object({
	key: Joi.string().regex(ALLOWED_FILE_KEYS_REGEX).required(),
}).error(new Joi.ValidationError(`File upload key is invalid`));

async function getFileUploadLink(ctx, next) {
	const body = Joi.attempt(ctx.request.body, FileUpload);

	const res = await axios.get(`http://${process.env.MASTER_IP}/api/file/${body.key}/upload`);

	ctx.body.data = res.data;
	ctx.status = 200;

	return next();
}

const router = Router();

router.post("/profile", rateLimit("/profile/get"), postProfile);
router.get("/profile", rateLimit("/profile/get"), getProfile);
router.post("/file/upload", rateLimit("/profile/file/upload"), getFileUploadLink);

module.exports = router;
