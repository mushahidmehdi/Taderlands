const Router = require("koa-router");
const router = Router();
const Joi = require("joi");
const { omit } = require("lodash");
const dayjs = require("dayjs");

const { dbClient } = require("@paratica/common/prisma");

const { getPaginationQuery, setError } = require("@backend/common/utils");
const rateLimit = require("@backend/common/middlewares/rateLimit");
const { removeByPrefix, redis } = require("@backend/common/services/redis");

const {
	getCampaignById,
	campaignStepsChecker,
	STATUS_TYPES,
	_maskEmail,
	CONTROL_FUNCTION_LIST,
} = require("../services/campaign");

const getCampaignsSchema = Joi.object({
	status: Joi.string().optional(),
	pageNumber: Joi.number().min(0).optional().default(0),
	pageSize: Joi.number().min(0).max(100).optional().default(100),
	startDate: Joi.date().optional(),
	endDate: Joi.date().optional(),
}).error(new Joi.ValidationError(`getFunnelsSchema type error`));

async function getCampaigns(ctx, next) {
	const body = Joi.attempt(ctx.request.query, getCampaignsSchema);
	const { status, pageNumber, pageSize, startDate, endDate } = body;

	const campaigns = await dbClient.campaign.findMany({
		where: {
			...(status ? { status } : {}),
			startDate: {
				...(startDate ? { gte: startDate } : {}),
				...(endDate ? { lt: endDate } : {}),
			},
		},
		...getPaginationQuery(pageNumber, pageSize),
	});

	ctx.body.data = { campaigns };
	ctx.status = 200;
	return next();
}

async function getAttendedCampaigns(ctx, next) {
	const { userId } = ctx.request.auth;

	const campaignAttendances = await dbClient.campaignAttendance.findMany({
		where: {
			userId,
		},
	});

	ctx.body.data = { campaignAttendances };
	ctx.status = 200;
	return next();
}

async function getCampaign(ctx, next) {
	const campaign = await getCampaignById(ctx.request.params.id);

	ctx.body.data = { campaign };
	ctx.status = 200;
	return next();
}

const createCampaignSchema = Joi.object({
	title: Joi.object({
		tr: Joi.string().required(),
		en: Joi.string().required(),
	}).required(),
	description: Joi.object({
		tr: Joi.string().required(),
		en: Joi.string().required(),
	}).required(),
	bannerUrl: Joi.string().uri().allow("").required(),
	prize: Joi.object({
		tr: Joi.string().required(),
		en: Joi.string().required(),
	}).required(),
	slogan: Joi.object({
		tr: Joi.string().required(),
		en: Joi.string().required(),
	}).required(),
	scope: Joi.string().required(),
	maxAttendeeCount: Joi.number().required(),
	startDate: Joi.date().required(),
	endDate: Joi.date().required(),
	checklist: Joi.object({
		register: Joi.object({
			steps: Joi.array()
				.items(
					Joi.object({
						stepNumber: Joi.number().required(),
						description: Joi.object({
							tr: Joi.string().required(),
							en: Joi.string().required(),
						}).required(),
						controlParameters: Joi.object().required(),
						reward: Joi.string().optional(),
						direction: Joi.string().optional(),
					})
				)
				.optional(),
		}).optional(),
		claim: Joi.object({
			steps: Joi.array()
				.items(
					Joi.object({
						stepNumber: Joi.number().required(),
						description: Joi.object({
							tr: Joi.string().required(),
							en: Joi.string().required(),
						}).required(),
						controlParameters: Joi.object().required(),
						reward: Joi.string().optional(),
						direction: Joi.string().optional(),
					})
				)
				.optional(),
		}).optional(),
		merchant: Joi.object({
			steps: Joi.array()
				.items(
					Joi.object({
						stepNumber: Joi.number().required(),
						description: Joi.object({
							tr: Joi.string().required(),
							en: Joi.string().required(),
						}).required(),
						controlParameters: Joi.object().required(),
						reward: Joi.string().optional(),
						direction: Joi.string().optional(),
					})
				)
				.optional(),
		}).optional(),
	}).optional(),
	checklistTypes: Joi.object({
		claim: Joi.number().required(),
		register: Joi.number().required(),
	}).required(),
	onTop: Joi.boolean().required(),
	order: Joi.number().required(),
	forMerchant: Joi.boolean().required(),
	leaderboardMapping: Joi.object().optional(),
	leaderboardInfo: Joi.object().required(),
	termsConditionsUrl: Joi.string().uri().allow("").optional(),
}).error(new Joi.ValidationError(`createCampaignSchema type error`));

async function createCampaign(ctx, next) {
	const body = Joi.attempt(ctx.request.body, createCampaignSchema);
	const userId = ctx.request.auth.userId;
	const campaign = await dbClient.campaign.create({
		data: {
			...body,
			createdBy: userId,
			updatedBy: userId,
		},
	});

	await removeByPrefix("/campaign");

	ctx.body.message = "ok";
	ctx.body.data = { campaign };
	ctx.status = 200;

	return next();
}

const updateCampaignSchema = Joi.object({
	id: Joi.number().required(),
	title: Joi.object({
		tr: Joi.string().required(),
		en: Joi.string().required(),
	}).required(),
	description: Joi.object({
		tr: Joi.string().required(),
		en: Joi.string().required(),
	}).required(),
	bannerUrl: Joi.string().uri().allow("").required(),
	prize: Joi.object({
		tr: Joi.string().required(),
		en: Joi.string().required(),
	}).required(),
	slogan: Joi.object({
		tr: Joi.string().required(),
		en: Joi.string().required(),
	}).required(),
	scope: "scope",
	maxAttendeeCount: Joi.number().required(),
	startDate: Joi.date().required(),
	endDate: Joi.date().required(),
	checklist: Joi.object({
		register: Joi.object({
			steps: Joi.array()
				.items(
					Joi.object({
						stepNumber: Joi.number().required(),
						description: Joi.object({
							tr: Joi.string().required(),
							en: Joi.string().required(),
						}).required(),
						controlParameters: Joi.object().required(),
						reward: Joi.string().optional(),
						direction: Joi.string().optional(),
					})
				)
				.optional(),
		}).optional(),
		claim: Joi.object({
			steps: Joi.array()
				.items(
					Joi.object({
						stepNumber: Joi.number().required(),
						description: Joi.object({
							tr: Joi.string().required(),
							en: Joi.string().required(),
						}).required(),
						controlParameters: Joi.object().required(),
						reward: Joi.string().optional(),
						direction: Joi.string().optional(),
					})
				)
				.optional(),
		}).optional(),
		merchant: Joi.object({
			steps: Joi.array()
				.items(
					Joi.object({
						stepNumber: Joi.number().required(),
						description: Joi.object({
							tr: Joi.string().required(),
							en: Joi.string().required(),
						}).required(),
						controlParameters: Joi.object().required(),
						reward: Joi.string().optional(),
						direction: Joi.string().optional(),
					})
				)
				.optional(),
		}).optional(),
	}).optional(),
	checklistTypes: Joi.object({
		claim: Joi.number().required(),
		register: Joi.number().required(),
	}).required(),
	onTop: Joi.boolean().required(),
	order: Joi.number().required(),
	forMerchant: Joi.boolean().required(),
	leaderboardMapping: Joi.object().optional(),
	leaderboardInfo: Joi.object().required(),
	termsConditionsUrl: Joi.string().uri().allow("").optional(),
}).error(new Joi.ValidationError(`updateCampaignSchema type error`));

async function updateCampaign(ctx, next) {
	const body = Joi.attempt({ ...ctx.request.body, ...ctx.request.params }, updateCampaignSchema);
	const userId = ctx.request.auth.userId;

	const campaign = await dbClient.campaign.update({
		where: {
			id: parseInt(body.id),
		},
		data: {
			...body,
			updatedBy: userId,
		},
	});

	await removeByPrefix("/campaign");
	await getCampaignById.delete(campaign?.id);

	ctx.body.message = "ok";
	ctx.body.data = { campaign };
	ctx.status = 200;

	return next();
}

async function createCampaignAttendance(ctx, next) {
	const userId = ctx.request.auth.userId;
	const campaignId = parseInt(ctx.request.params.id);

	const campaign = await getCampaignById(campaignId);

	if (!campaign) {
		setError(ctx, 400, "CAMPAIGN_NOT_FOUND");
		return;
	}

	const existingCampaignAttendance = await dbClient.campaignAttendance.findFirst({
		where: {
			userId,
			campaignId,
		},
	});

	if (existingCampaignAttendance) {
		setError(ctx, 400, "USER_CAMPAIGN_ATTENDANCE_ALREADY_EXISTS");
		return;
	}

	if (campaign.attendeeCount >= campaign.maxAttendeeCount) {
		setError(ctx, 400, "MAX_CAMPAIGN_ATTENDANCE_COUNT_REACHED");
		return;
	}

	const campaignAttendanceData = {
		campaignId,
		userId,
		status: STATUS_TYPES.SIGNED,
		rewardStatus: STATUS_TYPES.PENDING,
		checklist: {},
		details: {
			volumeGenerated: 0,
			successRate: 0,
		},
	};

	const campaignAttendance = await dbClient.campaignAttendance.create({
		data: {
			...campaignAttendanceData,
		},
	});

	await dbClient.campaign.update({
		where: {
			id: campaign.id,
		},
		data: {
			attendeeCount: { increment: 1 },
		},
	});

	ctx.body.message = "ok";
	ctx.body.data = { campaignAttendance };
	ctx.status = 200;

	return next();
}

async function getCampaignAttendance(ctx, next) {
	const userId = ctx.request.auth.userId;
	const campaignId = parseInt(ctx.request.params.id);

	const campaignAttendance = await dbClient.campaignAttendance.findFirst({
		where: {
			userId,
			campaignId,
		},
	});

	if (!campaignAttendance) {
		setError(ctx, 400, "USER_CAMPAIGN_ATTENDANCE_NOT_FOUND");
		return;
	}

	ctx.body.data = { campaignAttendance };
	ctx.status = 200;
	return next();
}

async function updateCampaignUserStatus(ctx, next) {
	const userId = ctx.request.auth.userId;
	const campaignId = parseInt(ctx.request.params.id);

	const campaign = await getCampaignById(campaignId);

	if (!campaign) {
		setError(ctx, 400, "CAMPAIGN_NOT_FOUND");
		return;
	}

	if (campaign.attendeeCount >= campaign.maxAttendeeCount) {
		setError(ctx, 400, "MAX_CAMPAIGN_ATTENDANCE_COUNT_REACHED");
		return;
	}

	let campaignAttendance = await dbClient.campaignAttendance.findFirst({
		where: { campaignId, userId },
	});

	if (!campaignAttendance) {
		setError(ctx, 400, "USER_CAMPAIGN_ATTENDANCE_NOT_FOUND");
		return;
	}

	if (campaignAttendance.status === STATUS_TYPES.CLAIMED) {
		ctx.body.data = { campaignAttendance };
		ctx.status = 200;

		return next();
	}

	let stepsStatus = true;
	let status = true;
	let details;
	let checklistData = {};

	const objectKeys = Object.keys(campaign.checklist);

	let removeRedisKeys = false;

	for (let i = 0; i < objectKeys.length; ++i) {
		const steps = [];
		for (let j = 0; j < campaign.checklist[objectKeys[i]]?.steps?.length; ++j) {
			if (
				campaign.checklist[objectKeys[i]].steps[j].controlParameters.functionName ===
				CONTROL_FUNCTION_LIST.MERCHANT_VOLUME
			) {
				removeRedisKeys = true;
			}

			const params = {
				...campaign.checklist[objectKeys[i]].steps[j].controlParameters,
				campaignStartDate: campaign.startDate,
				userId,
				forMerchant: campaign.forMerchant,
				campaignId: campaign.id,
			};

			const controlResult = await campaignStepsChecker(params);
			details = params.details;
			stepsStatus = stepsStatus && controlResult;

			steps.push({
				stepNumber: campaign.checklist[objectKeys[i]].steps[j].stepNumber,
				completed: controlResult,
			});
		}

		if (removeRedisKeys) {
			await redis.del("userId:" + userId + ":campaignId:" + campaign.id);
			removeRedisKeys = false;
		}

		status = status && stepsStatus;
		checklistData[objectKeys[i]] = { steps, stepsStatus };
	}

	checklistData.status = status;

	campaignAttendance = await dbClient.campaignAttendance.update({
		where: {
			id: campaignAttendance.id,
		},
		data: {
			checklist: checklistData,
			...(status && dayjs(campaign.startDate).isBefore(dayjs()) && { status: STATUS_TYPES.COMPLETED }),
			...(details && { details }),
		},
	});

	ctx.body.data = { campaignAttendance };
	ctx.status = 200;

	return next();
}

async function getEligibilityUserStatus(ctx, next) {
	const userId = ctx.request.auth.userId;
	const campaignId = parseInt(ctx.request.params.id);

	const campaign = await getCampaignById(campaignId);

	if (!campaign) {
		setError(ctx, 400, "CAMPAIGN_NOT_FOUND");
		return;
	}

	if (campaign.attendeeCount >= campaign.maxAttendeeCount) {
		setError(ctx, 400, "MAX_CAMPAIGN_ATTENDANCE_COUNT_REACHED");
		return;
	}

	const steps = [];
	let stepsStatus = true;

	for (let i = 0; i < campaign.checklist.register.steps.length; ++i) {
		const params = {
			...campaign.checklist.register.steps[i].controlParameters,
			campaignStartDate: campaign.startDate,
			userId,
		};

		const controlResult = await campaignStepsChecker(params);
		stepsStatus = stepsStatus && controlResult;

		steps.push({
			stepNumber: campaign.checklist.register.steps[i].stepNumber,
			completed: controlResult,
		});
	}

	const checklist = {
		register: { steps, status: stepsStatus },
	};

	ctx.body.data = { checklist };
	ctx.status = 200;

	return next();
}

async function claimRewards(ctx, next) {
	const userId = ctx.request.auth.userId;
	const campaignId = parseInt(ctx.request.params.id);

	const campaign = await getCampaignById(campaignId);

	if (!campaign) {
		setError(ctx, 400, "CAMPAIGN_NOT_FOUND");
		return;
	}

	if (campaign.attendeeCount >= campaign.maxAttendeeCount) {
		setError(ctx, 400, "MAX_CAMPAIGN_ATTENDANCE_COUNT_REACHED");
		return;
	}

	let campaignAttendance = await dbClient.campaignAttendance.findFirst({
		where: { campaignId, userId },
	});

	if (!campaignAttendance) {
		setError(ctx, 400, "USER_CAMPAIGN_ATTENDANCE_NOT_FOUND");
		return;
	}

	if (campaignAttendance.status === STATUS_TYPES.COMPLETED) {
		campaignAttendance = await dbClient.campaignAttendance.update({
			where: {
				id: campaignAttendance.id,
			},
			data: {
				status: STATUS_TYPES.CLAIMED,
			},
		});
	}

	ctx.body.data = { campaignAttendance };
	ctx.status = 200;

	return next();
}

const getLeaderboardSchema = Joi.object({
	campaignId: Joi.number().required(),
	pageNumber: Joi.number().optional().default(0),
	pageSize: Joi.number().optional().default(5),
}).error(new Joi.ValidationError(`getLeaderboardSchema type error`));

async function getLeaderboard(ctx, next) {
	const body = Joi.attempt({ ...ctx.request.query, ...ctx.request.params }, getLeaderboardSchema);
	const { pageNumber, pageSize, campaignId } = body;

	const campaign = await dbClient.campaign.findUnique({ where: { id: campaignId } });

	if (!campaign) {
		setError(ctx, 400, "CAMPAIGN_NOT_FOUND");
		return;
	}

	const iterationNo = campaign.leaderboardInfo?.iterationNo;

	if (!iterationNo) {
		setError(ctx, 400, "CAMPAIGN_ITERATION_NO_NOT_FOUND");
		return;
	}

	let leaderboard = await dbClient.leaderboard.findMany({
		where: { campaignId, iterationNo },
		include: {
			user: {
				select: {
					email: true,
				},
			},
		},
		orderBy: { rank: "asc" },
		...getPaginationQuery(pageNumber, pageSize),
	});

	leaderboard = leaderboard.map((item) => {
		const email = item.user.email ? _maskEmail(item.user.email) : null;
		return {
			...omit(item, ["user", "userId"]),
			email,
		};
	});

	ctx.status = 200;
	ctx.body.data = { leaderboard };
	return next();
}

async function getSelfLeaderboardRank(ctx, next) {
	const userId = ctx.request.auth.userId;
	const campaignId = parseInt(ctx.request.params.campaignId);

	const campaign = await dbClient.campaign.findUnique({ where: { id: campaignId } });

	if (!campaign) {
		setError(ctx, 400, "CAMPAIGN_NOT_FOUND");
		return;
	}

	const iterationNo = campaign.leaderboardInfo?.iterationNo;

	if (!iterationNo) {
		setError(ctx, 400, "CAMPAIGN_ITERATION_NO_NOT_FOUND");
		return;
	}

	let userRank = await dbClient.leaderboard.findFirst({
		where: { campaignId, iterationNo, userId },
		include: {
			user: {
				select: {
					email: true,
				},
			},
		},
	});

	if (!userRank) {
		ctx.status = 204;
		return next();
	}

	const email = userRank.user.email ? _maskEmail(userRank.user.email) : null;

	userRank = {
		...omit(userRank, ["user", "userId"]),
		email,
	};

	ctx.status = 200;
	ctx.body.data = { userRank };
	return next();
}

async function getLeaderboardProximity(ctx, next) {
	const userId = ctx.request.auth.userId;
	const campaignId = parseInt(ctx.request.params.campaignId);

	const campaign = await dbClient.campaign.findUnique({ where: { id: campaignId } });

	if (!campaign) {
		setError(ctx, 400, "CAMPAIGN_NOT_FOUND");
		return;
	}

	const iterationNo = campaign.leaderboardInfo?.iterationNo;

	if (!iterationNo) {
		setError(ctx, 400, "CAMPAIGN_ITERATION_NO_NOT_FOUND");
		return;
	}

	const leaderboard = await dbClient.leaderboard.findMany({
		where: { campaignId, iterationNo },
		include: {
			user: {
				select: {
					email: true,
				},
			},
		},
		orderBy: { rank: "asc" },
	});

	const userRank = leaderboard.filter((item) => item.userId === userId)[0];

	if (!userRank) {
		setError(ctx, 400, "USER_NOT_FOUND_IN_LEADERBOARD");
		return;
	}

	let proximityRank = leaderboard.filter((item) => item.rank >= userRank.rank - 2 && item.rank <= userRank.rank + 2);

	proximityRank = proximityRank.map((item) => {
		const email = item.user.email ? _maskEmail(item.user.email) : null;
		return {
			...omit(item, ["user", "userId"]),
			email,
		};
	});

	ctx.status = 200;
	ctx.body.data = { proximityRank, userRank };
	return next();
}

router.get("/campaigns/attended", rateLimit("/campaigns"), getAttendedCampaigns);
router.get("/campaigns", rateLimit("/campaigns"), getCampaigns);
router.get("/campaign/:id", rateLimit("/campaign/id/get"), getCampaign);
router.put("/campaign/:id", rateLimit("/campaign/id/put"), updateCampaign);
router.post("/campaign", rateLimit("/campaign"), createCampaign);

router.get("/campaign/:id/eligibility", rateLimit("/campaign/id/eligibility"), getEligibilityUserStatus);
router.post("/campaign/:id/attendance", rateLimit("/campaign/id/attendance/post"), createCampaignAttendance);
router.get("/campaign/:id/attendance", rateLimit("/campaign/id/attendance/get"), getCampaignAttendance);
router.patch("/campaign/:id/status", rateLimit("/campaign/id/status"), updateCampaignUserStatus);
router.patch("/campaign/:id/claim", rateLimit("/campaign/id/claim"), claimRewards);

router.get("/leaderboard/:campaignId", rateLimit("/leaderboard"), getLeaderboard);
router.get("/leaderboard/:campaignId/self", rateLimit("/leaderboard/self"), getSelfLeaderboardRank);
router.get("/leaderboard/:campaignId/proximity", rateLimit("/leaderboard/proximity"), getLeaderboardProximity);

module.exports = router;
