const Router = require("koa-router");
const router = Router();

const { dbClient } = require("@paratica/common/prisma");
const rateLimit = require("@backend/common/middlewares/rateLimit");

async function getConfig(ctx, next) {
	const { title } = ctx.request.query;

	const config = await dbClient.config.findFirst({
		where: {
			title,
		},
	});

	ctx.status = 200;
	ctx.body.data = { config };
	return next();
}

router.get("/config", rateLimit("/config"), getConfig);

module.exports = router;
