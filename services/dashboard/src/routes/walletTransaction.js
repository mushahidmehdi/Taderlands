const Router = require("koa-router");
const router = Router();
const Joi = require("joi");

const { pick } = require("lodash");

const { dbClient } = require("@paratica/common/prisma");
const { STATUS_TYPES, TYPES } = require("../constants");

const rateLimit = require("@backend/common/middlewares/rateLimit");

async function getTotalBalance(userId, type) {
	const receiver = await dbClient.walletTransaction.aggregate({
		where: {
			receiver: {
				id: userId,
			},
			type,
			status: STATUS_TYPES.DONE,
		},
		_sum: {
			amount: true,
		},
	});

	const sender = await dbClient.walletTransaction.aggregate({
		where: {
			sender: {
				id: userId,
			},
			type,
			status: STATUS_TYPES.DONE,
		},
		_sum: {
			amount: true,
		},
	});

	const totalReceived = receiver?._sum?.amount ?? 0;
	const totalSent = sender?._sum?.amount ?? 0;

	return parseFloat((totalReceived - totalSent).toFixed(2));
}

async function getWallet(ctx, next) {
	const userId = ctx.request.auth.userId;

	const realBalance = await getTotalBalance(userId, TYPES.REAL);
	const bonusBalance = await getTotalBalance(userId, TYPES.BONUS);

	const walletTransaction = {
		realBalance,
		bonusBalance,
	};

	ctx.status = 200;
	ctx.body.data = { walletTransaction };
	return next();
}

async function getTransactionSummary(ctx, next) {
	const userId = ctx.request.auth.userId;

	const walletTransactionSummaries = await dbClient.walletTransactionSummary.groupBy({
		by: ["senderId", "receiverId", "source", "transactionDate"],
		where: {
			OR: [{ senderId: userId }, { receiverId: userId }],
		},
		_sum: {
			sentAmount: true,
			receivedAmount: true,
		},
		orderBy: {
			transactionDate: "desc",
		},
	});

	const walletTransaction = walletTransactionSummaries.reduce((acc, curr) => {
		const groupKey = `${curr.transactionDate}/${curr.source}`;

		const userSender = curr.senderId === userId;
		const userReceiver = curr.receiverId === userId;

		const sentAmount = userSender ? (acc?.[groupKey]?.sentAmount ?? 0) + curr._sum.sentAmount : 0;
		const receivedAmount = userReceiver ? (acc?.[groupKey]?.receivedAmount ?? 0) + curr._sum.receivedAmount : 0;

		acc[groupKey] = {
			sentAmount,
			receivedAmount,
			amount: receivedAmount - sentAmount,
			...pick(curr, ["transactionDate", "source"]),
		};

		return acc;
	}, {});

	const walletTransactionSummary = Object.values(walletTransaction);

	ctx.status = 200;
	ctx.body.data = { walletTransactionSummary };
	return next();
}

const getTransactionDetailSchema = Joi.object({
	transactionDateGte: Joi.date().optional(),
	transactionDatelt: Joi.date().optional(),
	status: Joi.string().optional(),
	source: Joi.string().optional(),
	type: Joi.string().optional(),
}).error(new Joi.ValidationError(`getTransactionDetailSchema type error`));

async function getTransactionDetails(ctx, next) {
	const requestQuery = Joi.attempt(ctx.request.query, getTransactionDetailSchema);
	const userId = ctx.request.auth.userId;
	const { transactionDateGte, transactionDatelt, source, status, type } = requestQuery;

	const walletTransactionDetails = await dbClient.walletTransactionSummary.groupBy({
		by: ["pivot", "senderId", "senderUsername", "receiverId", "receiverUsername", "source", "status", "type"],
		where: {
			OR: [{ senderId: userId }, { receiverId: userId }],
			source,
			status,
			type,
			transactionDate: {
				...(transactionDateGte ? { gte: transactionDateGte } : {}),
				...(transactionDatelt ? { lt: transactionDatelt } : {}),
			},
		},
		_sum: {
			sentAmount: true,
			receivedAmount: true,
		},
	});

	ctx.status = 200;
	ctx.body.data = { walletTransactionDetails };
	return next();
}

router.get("/wallet", rateLimit("/wallet"), getWallet);
router.get("/wallet/transactions-summary", rateLimit("/wallet/transactions-summary"), getTransactionSummary);
router.get("/wallet/transaction-details", rateLimit("/wallet/transaction-details"), getTransactionDetails);

module.exports = router;
