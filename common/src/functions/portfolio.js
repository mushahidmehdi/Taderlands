const AWS = require("aws-sdk");

AWS.config.update({ region: "eu-central-1" });
const lambda = new AWS.Lambda();

async function getCurrentPortfolioByPlatform(params, platformKey) {
	try {
		const beginDate = new Date();
		const data = {
			FunctionName: platformKey + "-get-overall-balance-" + process.env.NODE_ENV,
			InvocationType: "RequestResponse",
			LogType: "Tail",
			Payload: Buffer.from(JSON.stringify(params)),
		};

		let response = await lambda.invoke(data).promise();
		const endDate = new Date();
		console.log(
			`[getCurrentPortfolioByPlatform] start date: ${beginDate}, end date: ${endDate}, difference: ${
				endDate - beginDate
			}`
		);
		return JSON.parse(response.Payload);
	} catch (error) {
		console.log(error);
	}
}

module.exports = { getCurrentPortfolioByPlatform };
