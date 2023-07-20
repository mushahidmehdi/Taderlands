const Router = require("koa-router");
const { redis } = require("@backend/common/services/redis");
const rateLimit = require("@backend/common/middlewares/rateLimit");

const TELEGRAM_CODE_LENGTH = 12;

function generateReferenceCode(length) {
	let result = "";
	const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	const charactersLength = characters.length;
	for (var i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}

async function getTelegramCode(ctx, next) {
	const userId = ctx.request.auth.userId;

	let telegramCode = await redis.get("telegramCode:" + userId + ":telegramCode");

	if (!telegramCode) {
		telegramCode = generateReferenceCode(TELEGRAM_CODE_LENGTH);

		await redis.set("telegramCode:" + telegramCode + ":userId", userId, "EX", 300);
		await redis.set("telegramCode:" + userId + ":telegramCode", telegramCode, "EX", 300);
	}

	ctx.body.data = { telegramCode };
	ctx.status = 200;
	return next();
}

const router = Router();

router.get("/telegram-code", rateLimit("/telegram-code"), getTelegramCode);

module.exports = router;
