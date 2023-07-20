const { dbClient } = require("@paratica/common/prisma");

async function getUsedReferenceCodeCount(userId) {
	const userOwnedReferenceCodes = await dbClient.referenceCode.findMany({
		where: {
			ownerId: userId,
		},
		include: { _count: { select: { usedBy: true } } },
	});
	let totalUsedByCount = 0;
	for (let i = 0; i < userOwnedReferenceCodes.length; i++) {
		totalUsedByCount += userOwnedReferenceCodes[i]._count.usedBy;
	}

	return totalUsedByCount;
}

module.exports = { getUsedReferenceCodeCount };
