const Router = require("koa-router");
const generateRandomUuid = require("uuid");
const Joi = require("joi");

const { dbClient } = require("@paratica/common/prisma");
const { sendOtp, setTransaction } = require("@backend/common/functions/otp");
const { setError } = require("@backend/common/utils");

const rateLimit = require("@backend/common/middlewares/rateLimit");

const {
	REGEXP_EMAIL,
	REGEXP_PHONE_NUMBER,
	MAXIMUM_EMAIL_LENGTH,
	MAXIMUM_PHONE_NUMBER_LENGTH,
} = require("@backend/common/enums/regularExpressions.js");

const sendOtpAgainSchema = Joi.object({
	email: Joi.string().regex(new RegExp(REGEXP_EMAIL)).max(MAXIMUM_EMAIL_LENGTH),
	phoneNumber: Joi.string().regex(new RegExp(REGEXP_PHONE_NUMBER)).max(MAXIMUM_PHONE_NUMBER_LENGTH),
})
	.oxor("phoneNumber", "email")
	.error(new Joi.ValidationError(`phoneNumber or email required `));

async function sendOtpAgain(ctx, next) {
	//TODO: need to be delete in future and all otp services could be use same endpoint
	const body = Joi.attempt(ctx.request.body, sendOtpAgainSchema);

	const user = await dbClient.user.findFirst({
		where: {
			OR: [{ phoneNumber: body.phoneNumber }, { email: body.email }],
		},
		select: {
			phoneNumber: true,
			email: true,
			usedReferenceCodeId: true,
		},
	});
	if (user) {
		await sendOtp({ ...body, type: "register", language: ctx.request.headers.lang });

		const transactionId = generateRandomUuid.v4();
		const userId = user.id;
		await setTransaction({ userId, transactionId, type: "operation", val: JSON.stringify(body) });

		ctx.body.data = user;
		ctx.body.data.transactionId = transactionId;
		ctx.body.message = "ok";
		ctx.status = 200;
	} else {
		setError(ctx, 401, "USER_NOT_FOUND");
	}

	return next();
}

const router = Router();

router.post("/send-otp-again", rateLimit("/send-otp-again"), sendOtpAgain);

module.exports = router;
