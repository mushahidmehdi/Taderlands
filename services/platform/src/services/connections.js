const memoize = require("memoizee");
const { omit } = require("lodash");

const { dbClient } = require("@paratica/common/prisma");

const MAX_AGE = 3 * 1000;

const getConnections = memoize(
	async (userId, exchange, removeApiSecret) => getUserApiConnections(userId, exchange, removeApiSecret),
	{
		promise: true,
		maxAge: MAX_AGE,
		preFetch: true,
	}
);

async function getUserApiConnections(userId, exchange, removeApiSecret) {
	let userApiConnections = await dbClient.userApiConnection.findMany({
		where: {
			...(userId ? { user: { id: userId } } : {}),
			...(exchange ? { platform: { exchange } } : {}),
		},
		select: {
			name: true,
			platform: {
				select: {
					id: true,
					name: true,
					info: true,
					exchange: true,
				},
			},
			exchangeConnectionInfo: true,
			restrictions: true,
			isActive: true,
			platformId: true,
			updatedAt: true,
			name: true,
		},
	});

	userApiConnections = userApiConnections.map((x) => {
		x.exchangeConnectionInfo = JSON.parse(x.exchangeConnectionInfo);

		if (removeApiSecret) {
			x.exchangeConnectionInfo = omit(x.exchangeConnectionInfo, "apiSecret");
			return x;
		}

		return x;
	});

	return userApiConnections;
}

module.exports = {
	getConnections,
};
