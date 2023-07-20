const { dbClient } = require("@paratica/common/prisma");

async function createStrategyFollower(strategyFollowerSchema, userId) {
	return await dbClient.strategyFollower.upsert({
		where: {
			strategyId_followerId: {
				strategyId: BigInt(strategyFollowerSchema.strategyId),
				followerId: strategyFollowerSchema.followerId,
			},
		},
		update: strategyFollowerSchema,
		create: {
			...strategyFollowerSchema,
			createdBy: userId,
		},
	});
}

module.exports = { createStrategyFollower };
