const { dbClient } = require("@paratica/common/prisma");

const KycProcessRefreshIntervalMinutes = process.env.KYC_REFRESH_INTERVAL_MINUTES;
const currentDate = new Date();
const controlDate = new Date(currentDate.getTime() - KycProcessRefreshIntervalMinutes * 60000);

async function updateKycStatus() {
	try {
		console.log("updateKycStatus() started");

		const pendingKycStatusUsers = await dbClient.user.findMany({
			where: {
				userSecuritySetting: {
					is: {
						kycStatus: "PENDING",
					},
				},
				kycProcess: {
					is: {
						status: "PENDING",
						updatedAt: {
							lt: controlDate,
						},
					},
				},
			},
		});

		if (pendingKycStatusUsers.length === 0) {
			console.log("No pending KYC status users found");
			return;
		}

		const pendingkycStatusUserList = [];

		console.log("Pending kyc status users list length: ", pendingKycStatusUsers.length);

		for (let i = 0; i < pendingKycStatusUsers.length; i++) {
			pendingkycStatusUserList.push(pendingKycStatusUsers[i].id);
		}

		const updatedValues = await dbClient.userSecuritySetting.updateMany({
			where: {
				userId: {
					in: pendingkycStatusUserList,
				},
			},
			data: {
				kycStatus: "NOT_COMPLETED",
			},
		});

		console.log(`${updatedValues.count} rows updated`);
	} catch (error) {
		console.log(error);
	} finally {
		process.exit(0);
	}
}

module.exports = { updateKycStatus };
