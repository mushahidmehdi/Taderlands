const Router = require("koa-router");
const router = Router();
const Joi = require("joi");
const dayjs = require("dayjs");

const { dbClient } = require("@paratica/common/prisma");
const { removeByPrefix } = require("@backend/common/services/redis");

const { Topic, TopicUpdate } = require("../models/topic");
const { getPaginationQuery } = require("@backend/common/utils");

const rateLimit = require("@backend/common/middlewares/rateLimit");

const getTopicsSchema = Joi.object({
	status: Joi.string().optional(),
	pageNumber: Joi.number().min(0).optional().default(0),
	pageSize: Joi.number().min(0).max(100).optional().default(100),
}).error(new Joi.ValidationError(`getTopicsSchema type error`));

async function getTopics(ctx, next) {
	const body = Joi.attempt(ctx.request.query, getTopicsSchema);
	const { status, pageNumber, pageSize } = body;

	const storyDeaultDaysCount = process.env.STORY_DEFAULT_DAYS_COUNT;
	const controlDate = dayjs().add(-storyDeaultDaysCount, "day").toDate();

	const topics = await dbClient.topic.findMany({
		where: {
			...(status ? { status } : {}),
		},
		include: {
			stories: {
				where: {
					createdAt: {
						gte: controlDate,
					},
				},
			},
		},
		...getPaginationQuery(pageNumber, pageSize),
	});

	ctx.body.data = { topics };
	ctx.status = 200;
	return next();
}

async function getTopic(ctx, next) {
	const topic = await dbClient.topic.findFirst({
		where: {
			id: ctx.request.params.id,
		},
	});

	ctx.body.data = { topic };
	ctx.status = 200;
	return next();
}

async function createTopic(ctx, next) {
	const body = Joi.attempt(ctx.request.body, Topic);
	const topic = await dbClient.topic.create({
		data: {
			...body,
			createdBy: ctx.request.auth.userId,
			confirmedBy: process.env.ZERO_VALUE_USER_ID,
		},
	});

	await removeByPrefix("/topics");

	ctx.body.message = "ok";
	ctx.body.data = { topic };
	ctx.status = 200;

	return next();
}

async function updateTopic(ctx, next) {
	const body = Joi.attempt(ctx.request.body, TopicUpdate);

	const topic = await dbClient.topic.update({
		where: {
			id: ctx.request.params.id,
		},
		data: body,
	});

	await removeByPrefix("/topic");
	ctx.body.message = "ok";
	ctx.body.data = { topic };
	ctx.status = 200;

	return next();
}

router.get("/topics", rateLimit("/topics"), getTopics);
router.get("/topic/:id", rateLimit("/topic/id/get"), getTopic);
router.put("/topic/:id", rateLimit("/topic/id/put"), updateTopic);
router.post("/topic", rateLimit("/topic"), createTopic);

module.exports = router;
