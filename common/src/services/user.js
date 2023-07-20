const memoize = require("memoizee");
const dayjs = require("dayjs");

const { dbClient } = require("@paratica/common/prisma");

const MAX_AGE = 2 * 1000;

const getUserByUserId = memoize(
	async (userId) => {
		return await dbClient.user.findUnique({
			where: {
				id: userId,
			},
		});
	},
	{ promise: true, maxAge: MAX_AGE, preFetch: true }
);

const getUserByIdentity = memoize(
	async (email, phoneNumber) => {
		const users = await dbClient.user.findMany({
			where: {
				OR: [{ phoneNumber }, { email }],
			},
		});

		return users?.length ? users[0] : null;
	},
	{ promise: true, maxAge: MAX_AGE, preFetch: true }
);

function checkDeleted(user) {
	const dateControlRange = process.env.DATE_CONTROL_RANGE;
	const controlDate = dayjs().subtract(dateControlRange, "day").toDate();

	if (user.deletedAt !== null && user.deletedAt < controlDate) {
		return true;
	}
	return false;
}
module.exports = {
	getUserByIdentity,
	getUserByUserId,
	checkDeleted,
};
