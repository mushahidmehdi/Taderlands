const Router = require("koa-router");
const router = Router();

const { dbClient } = require("@paratica/common/prisma");
const rateLimit = require("@backend/common/middlewares/rateLimit");

async function getPositionSummary(ctx, next) {
	const userId = ctx.request.auth.userId;

	const positionSummary = await dbClient.positionSummary.findUnique({
		where: {
			userId,
		},
	});

	ctx.status = 200;
	ctx.body.data = { positionSummary };
	return next();
}

router.get("/position-summary", rateLimit("/position-summary"), getPositionSummary);

module.exports = router;
