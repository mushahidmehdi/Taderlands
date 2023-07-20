const Router = require("koa-router");
const speakeasy = require("speakeasy");
const qrcode = require("qrcode");

const rateLimit = require("@backend/common/middlewares/rateLimit");
const passwordProtection = require("../services/passwordProtection");

async function postTwofa(ctx, next) {
	const secret = speakeasy.generateSecret({
		name: process.env.TWO_FACTOR_AUTHENTICATION_APP_NAME + " (" + ctx.request.username + ")",
	});
	const qr = await qrcode.toDataURL(secret.otpauth_url);

	ctx.body.data = { qr, secret };
	return next();
}

const router = Router();

router.post("/twofa", rateLimit("/twofa"), passwordProtection, postTwofa);

module.exports = router;
