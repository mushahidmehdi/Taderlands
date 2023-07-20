const Router = require("koa-router");
const Joi = require("joi");

const generateRandomUuid = require("uuid");
const dayjs = require("dayjs");

const rateLimit = require("@backend/common/middlewares/rateLimit");

const CookieSettings = Joi.object({
	rc: Joi.string().optional(), // requiredCookies
	pc: Joi.string().optional(), // preferredCookies
	ac: Joi.string().optional(), // acceptedCookies
}).error(new Joi.ValidationError(`Cookie settings not valid.`));

async function retrieveCookies(ctx, next) {
	const body = Joi.attempt(ctx.request.body, CookieSettings);

	const { rc, pc, ac } = body;

	const cookieOptions = {
		httpOnly: true,
		secure: true,
		signed: true,
		overwrite: true,
		// Expires after 360000 ms from the time it is set.
		expires: new Date(360000 + dayjs().unix() * 1000),
	};

	ctx.cookies.set("requiredCookies", generateRandomUuid.v4(), cookieOptions);
	pc && ctx.cookies.set("preferredCookies", generateRandomUuid.v4(), cookieOptions);
	ac && ctx.cookies.set("acceptedCookies", generateRandomUuid.v4(), cookieOptions);
}

const router = Router();

router.post("/wafer", rateLimit("/wafer"), retrieveCookies);

module.exports = router;
