const Router = require("koa-router");
const router = Router();
const Joi = require("joi");

const { dbClient } = require("@paratica/common/prisma");
const { removeByPrefix } = require("@backend/common/services/redis");
const dayjs = require("dayjs");

const { Story, StoryUpdate } = require("../models/story");
const { getPaginationQuery } = require("@backend/common/utils");
const rateLimit = require("@backend/common/middlewares/rateLimit");

const getStoriesSchema = Joi.object({
	status: Joi.string().optional(),
	topicId: Joi.number().optional(),
	pageNumber: Joi.number().min(0).optional().default(0),
	pageSize: Joi.number().min(0).max(100).optional().default(100),
}).error(new Joi.ValidationError(`getStoriesSchema type error`));

async function getStories(ctx, next) {
	const body = Joi.attempt(ctx.request.query, getStoriesSchema);
	const { status, topicId, pageNumber, pageSize } = ctx.request.query;

	const storyDeaultDaysCount = process.env.STORY_DEFAULT_DAYS_COUNT;
	const controlDate = dayjs().add(-storyDeaultDaysCount, "day").toDate();

	const stories = await dbClient.story.findMany({
		where: {
			...(status ? { status } : {}),
			...(topicId ? { topicId: parseInt(topicId) } : {}),
			createdAt: {
				gte: controlDate,
			},
		},
		...getPaginationQuery(pageNumber, pageSize),
	});

	ctx.body.data = { stories };
	ctx.status = 200;
	return next();
}

async function getStory(ctx, next) {
	const story = await dbClient.story.findFirst({
		where: {
			id: ctx.request.params.id,
		},
	});

	ctx.body.data = { story };
	ctx.status = 200;
	return next();
}

async function createStory(ctx, next) {
	const body = Joi.attempt(ctx.request.body, Story);

	const story = await dbClient.story.create({
		data: {
			...body,
			createdBy: ctx.request.auth.userId,
			confirmedBy: process.env.ZERO_VALUE_USER_ID,
		},
	});

	await removeByPrefix("/stories");

	ctx.body.message = "ok";
	ctx.body.data = { story };
	ctx.status = 200;

	return next();
}

async function updateStory(ctx, next) {
	const body = Joi.attempt(ctx.request.body, StoryUpdate);

	const story = await dbClient.story.update({
		where: {
			id: parseInt(ctx.request.params.id),
		},
		data: body,
	});

	await removeByPrefix("/story");
	await removeByPrefix("/stories");

	ctx.body.message = "ok";
	ctx.body.data = { story };
	ctx.status = 200;

	return next();
}

router.get("/stories", rateLimit("/stories"), getStories);
router.get("/story/:id", rateLimit("/story/id/get"), getStory);
router.put("/story/:id", rateLimit("/story/id/put"), updateStory);
router.post("/story", rateLimit("/story"), createStory);
module.exports = router;
