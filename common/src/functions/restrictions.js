const platformHelpers = require("@paratica/common/platformHelpers");

const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
dayjs.extend(utc);

const AWS = require("aws-sdk");
AWS.config.update({ region: "eu-central-1" });
const lambda = new AWS.Lambda();

const signatureSchema = {
	binance: { apiSecret: "", queryString: `timestamp=` },
	binanceTr: { apiSecret: "", queryString: `timestamp=` },
	okx: { apiSecret: "", timestamp: "" },
	bitmex: { apiSecret: "", verb: "POST", path: "/api/v1/order", apiKey: "", postBody: JSON.stringify({}) },
	ftx: {
		apiSecret: "",
		timestamp: "",
		verb: "POST",
		path: "/api/orders",
		postBody: "",
	},
	huobiUid: {
		verb: "GET\n",
		host: "api.huobi.pro\n",
		path: "/v2/user/uid\n",
		apiKey: "",
		timestamp: "",
		apiSecret: "",
	},
	huobiRestriction: {
		verb: "GET\n",
		host: "api.huobi.pro\n",
		path: "/v2/user/api-key\n",
		apiKey: "",
		timestamp: "",
		apiSecret: "",
		uid: "",
	},
};
function makeSeconds(timestamp) {
	return Math.round(timestamp / 1000) + 5 * 60;
}
async function prepareSignature(params) {
	const { platform, apiSecret, apiKey, uid } = params;
	let timestamp = new Date().getTime();
	let signature;
	let signatureParams;
	switch (platform) {
		case "binance":
			signatureParams = signatureSchema[platform];
			signatureParams.queryString = `timestamp=${timestamp}`;
			signatureParams.apiSecret = apiSecret;
			signature = await platformHelpers[platform].createSignature(signatureParams);
			break;

		case "binanceTr":
			signatureParams = signatureSchema[platform];
			signatureParams.queryString = `timestamp=${timestamp}`;
			signatureParams.apiSecret = apiSecret;
			signature = await platformHelpers["binance"].createSignature(signatureParams);
			break;

		case "bitmex":
			signatureParams = signatureSchema[platform];
			signatureParams.apiKey = apiKey;
			signatureParams.apiSecret = apiSecret;
			break;
		case "ftx":
			signatureParams = signatureSchema[platform];
			signatureParams.apiSecret = apiSecret;
			signatureParams.timestamp = timestamp;
			signature = await platformHelpers[platform].createSignature(signatureParams);
			break;
		case "ftxTr":
			signatureParams = signatureSchema["ftx"];
			signatureParams.apiSecret = apiSecret;
			signatureParams.timestamp = timestamp;
			signature = await platformHelpers["ftx"].createSignature(signatureParams);
			break;
		case "huobiUid":
			signatureParams = signatureSchema[platform];
			timestamp = dayjs().utc().format("YYYY-MM-DDTHH:mm:ss");
			signatureParams.apiSecret = apiSecret;
			signatureParams.apiKey = apiKey;
			signatureParams.timestamp = timestamp;
			signature = await platformHelpers["huobi"].createUidTypeSignature(signatureParams);
			break;
		case "huobiRestriction":
			signatureParams = signatureSchema[platform];
			timestamp = dayjs().utc().format("YYYY-MM-DDTHH:mm:ss");
			signatureParams.apiSecret = apiSecret;
			signatureParams.apiKey = apiKey;
			signatureParams.timestamp = timestamp;
			signatureParams.uid = uid;
			signature = await platformHelpers["huobi"].createRestrictionTypeSignature(signatureParams);
			break;
		case "okx":
			//ISOString timestamp needed for okx
			timestamp = new Date().toISOString();
			signatureParams = signatureSchema[platform];
			signatureParams.timestamp = timestamp;
			signatureParams.apiSecret = apiSecret;
			signature = await platformHelpers[platform].createSignature(signatureParams);
			break;

		default:
			break;
	}

	return { signature, timestamp };
}
async function checkRestrictions(params) {
	try {
		const data = {
			FunctionName: params.platform + "-api-restrictions-" + process.env.NODE_ENV,
			InvocationType: "RequestResponse",
			LogType: "Tail",
			Payload: Buffer.from(JSON.stringify(params)),
		};

		let response = await lambda.invoke(data).promise();

		return JSON.parse(response.Payload)?.body;
	} catch (error) {
		console.log(error);
	}
}

async function getRestrictions(exchange, apiInfo) {
	const { apiKey, apiSecret } = apiInfo;
	if (exchange === "huobi") {
		//first find uid then check Restrictions
		const { signature: uidSignature, timestamp: timestampUid } = await prepareSignature({
			platform: "huobiUid",
			apiKey,
			apiSecret,
		});
		const uidOb = await checkRestrictions({
			platform: exchange,
			apiKey,
			apiSecret,
			signature: uidSignature,
			timestamp: timestampUid,
			type: "uid",
		});

		const { signature, timestamp } = await prepareSignature({
			platform: "huobiRestriction",
			apiKey,
			apiSecret,
			uid: uidOb.uid,
		});

		return await checkRestrictions({
			platform: exchange,
			apiKey,
			apiSecret,
			signature,
			timestamp,
			uid: uidOb.uid,
			type: "restriction",
		});
	} else if (exchange === "dYdX") {
		//no signature needed
		return await checkRestrictions({
			platform: exchange,
			...apiInfo,
		});
	} else if (exchange === "okx") {
		const { signature, timestamp } = await prepareSignature({ platform: exchange, apiSecret });
		return await checkRestrictions({
			platform: exchange,
			apiKey,
			apiSecret,
			signature,
			timestamp,
			passphrase: apiInfo.passphrase,
			expires: makeSeconds(timestamp),
		});
	} else {
		const { signature, timestamp } = await prepareSignature({ platform: exchange, apiKey, apiSecret });
		return await checkRestrictions({
			platform: exchange,
			apiKey,
			apiSecret,
			signature,
			timestamp,
			expires: makeSeconds(timestamp),
		});
	}
}

module.exports = { getRestrictions };
