const speakeasy = require("speakeasy");
const { dbClient } = require("@paratica/common/prisma");

async function confimTwofa(userId, code) {
	const settings = await dbClient.userSecuritySetting.findFirst({
		where: { user: { id: userId } },

		select: {
			twofaInfo: true,
		},
	});
	return speakeasy.totp.verify({
		secret: settings.twofaInfo.secret,
		encoding: "base32",
		token: code,
	});
}

module.exports = { confimTwofa };
