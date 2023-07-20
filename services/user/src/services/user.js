const { dbClient } = require("@paratica/common/prisma");

async function getUser({ phoneNumber, email }) {
	return await dbClient.user.findFirst({
		where: {
			OR: [{ phoneNumber }, { email }],
		},
	});
}

module.exports = { getUser };
