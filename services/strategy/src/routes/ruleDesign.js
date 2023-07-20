const Router = require("koa-router");
const Joi = require("joi");
const { omit } = require("lodash");

const { dbClient } = require("@paratica/common/prisma");

const { validate } = require("@backend/common/functions/ruleDesign");
const rateLimit = require("@backend/common/middlewares/rateLimit");

const { LABEL_MAP } = require("../constants/labelMap");

const RULE_DESIGN_TYPES = {
	ENTER: "ENTER",
	EXIT: "EXIT",
};

async function getRuleDesigns(ctx, next) {
	const ruleDesigns = await dbClient.ruleDesign.findMany({
		where: {
			userId: ctx.request.auth.userId,
		},
		orderBy: {
			id: "desc",
		},
	});

	ctx.body.data = { ruleDesigns };
	ctx.status = 200;

	return next();
}

async function getRuleDesign(ctx, next) {
	const { id } = ctx.request.params;

	const ruleDesign = await dbClient.ruleDesign.findUnique({
		where: {
			id: BigInt(id),
		},
	});

	ctx.body.data = { ruleDesign };
	ctx.status = 200;

	return next();
}

const createtRuleDesignSchema = Joi.object({
	strategyId: Joi.number().optional(),
	type: Joi.string().required(),
	name: Joi.string().required(),
	note: Joi.string().optional(),
	rules: Joi.object().required(),
}).error(new Joi.ValidationError(`createtRuleDesignSchema type error`));

async function createRuleDesign(ctx, next) {
	const body = Joi.attempt(ctx.request.body, createtRuleDesignSchema);
	const { userId } = ctx.request.auth;

	const normalizedRules = validate(body.rules);

	const ruleDesign = await dbClient.ruleDesign.create({
		data: {
			...omit(body, "strategyId"),
			rules: normalizedRules,
			userId,
			createdBy: process.env.ZERO_VALUE_USER_ID,
		},
	});

	let ruleDesignEnterId;
	let ruleDesignExitId;

	if (body.type === RULE_DESIGN_TYPES.ENTER) {
		ruleDesignEnterId = ruleDesign.id;
	} else if (body.type === RULE_DESIGN_TYPES.EXIT) {
		ruleDesignExitId = ruleDesign.id;
	}

	const strategy = await dbClient.strategy.findUnique({
		where: { id: body.strategyId },
	});

	let labels = strategy.labels;

	if (ruleDesignExitId && !labels.includes(LABEL_MAP.strategyExit)) {
		labels = [...(labels ?? []), LABEL_MAP.strategyExit];
	}

	await dbClient.strategy.update({
		where: { id: body.strategyId },
		data: { ruleDesignEnterId, ruleDesignExitId, labels },
	});

	ctx.body.data = { ruleDesign };
	ctx.status = 200;

	return next();
}

const router = Router();

router.get("/rule-designs", rateLimit("/rule-designs"), getRuleDesigns);
router.get("/rule-design/:id", rateLimit("/rule-design/id"), getRuleDesign);
router.post("/rule-design", rateLimit("/rule-design"), createRuleDesign);

module.exports = router;
