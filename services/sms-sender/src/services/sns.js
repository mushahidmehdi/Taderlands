const { SNSClient } = require("@aws-sdk/client-sns");
const REGION = process.env.AWS_REGION;
const snsClient = new SNSClient({ region: REGION });
const { omit } = require("lodash");
const { dbClient } = require("@paratica/common/prisma");

const {
	CheckIfPhoneNumberIsOptedOutCommand,
	ConfirmSubscriptionCommand,
	CreateTopicCommand,
	DeleteTopicCommand,
	GetSMSAttributesCommand,
	GetTopicAttributesCommand,
	ListSubscriptionsByTopicCommand,
	ListTopicsCommand,
	PublishCommand,
	SetSMSAttributesCommand,
} = require("@aws-sdk/client-sns");

async function setSMSAttributes(params) {
	try {
		const data = await snsClient.send(new SetSMSAttributesCommand(params));

		return data;
	} catch (err) {
		console.log("Error", err.stack);
	}
}

async function checkIfPhoneNumberIsOptedOut(params) {
	try {
		const data = await snsClient.send(new CheckIfPhoneNumberIsOptedOutCommand(params));

		return data;
	} catch (err) {
		console.log("Error", err.stack);
	}
}

async function confirmSubscription(params) {
	try {
		const data = await snsClient.send(new ConfirmSubscriptionCommand(params));

		return data;
	} catch (err) {
		console.log("Error", err.stack);
	}
}

async function createTopic(params) {
	try {
		const data = await snsClient.send(new CreateTopicCommand(params));

		return data;
	} catch (err) {
		console.log("Error", err.stack);
	}
}

async function unsubscribe(params) {
	try {
		const data = await snsClient.send(new UnsubscribeCommand(params));

		return data;
	} catch (err) {
		console.log("Error", err.stack);
	}
}

async function deleteTopic(params) {
	try {
		const data = await snsClient.send(new DeleteTopicCommand(params));

		return data;
	} catch (err) {
		console.log("Error", err.stack);
	}
}

async function getTopicAttributes(params) {
	try {
		const data = await snsClient.send(new GetTopicAttributesCommand(params));

		return data;
	} catch (err) {
		console.log("Error", err.stack);
	}
}

async function getSMSAttributes(params) {
	try {
		const data = await snsClient.send(new GetSMSAttributesCommand(params));

		return data;
	} catch (err) {
		console.log("Error", err.stack);
	}
}

async function listSubscriptionsByTopic(params) {
	try {
		const data = await snsClient.send(new ListSubscriptionsByTopicCommand(params));

		return data;
	} catch (err) {
		console.log("Error", err.stack);
	}
}

async function listTopics(params) {
	try {
		const data = await snsClient.send(new ListTopicsCommand({}));

		return data;
	} catch (err) {
		console.log("Error", err.stack);
	}
}

async function publish(params) {
	const transactionId = params?.transactionId;
	try {
		params.MessageAttributes = {
			"AWS.SNS.SMS.SenderID": {
				DataType: "String",
				StringValue: "Traderlands",
			},
		};

		params = omit(params, ["transactionId"]);

		params.PhoneNumber = `+${params.PhoneNumber.replace(/\D+/g, "")}`;

		const data = await snsClient.send(new PublishCommand(params));

		await dbClient.otpRequest.update({
			where: {
				transactionId,
			},
			data: {
				status: "SENT",
			},
		});

		return data;
	} catch (err) {
		if (transactionId) {
			await dbClient.otpRequest.update({
				where: {
					transactionId,
				},
				data: {
					status: "ERROR",
				},
			});
		}
		console.log("Error", err.stack);
	}
}

async function setSMSAttributes(params) {
	try {
		const data = await snsClient.send(new SetSMSAttributesCommand(params));

		return data;
	} catch (err) {
		console.log("Error", err.stack);
	}
}

async function Subscribe(params) {
	try {
		const data = await snsClient.send(new SubscribeCommand(params));

		return data;
	} catch (err) {
		console.log("Error", err.stack);
	}
}

module.exports = {
	setSMSAttributes,
	checkIfPhoneNumberIsOptedOut,
	confirmSubscription,
	createTopic,
	deleteTopic,
	getTopicAttributes,
	getSMSAttributes,
	listSubscriptionsByTopic,
	listTopics,
	publish,
	setSMSAttributes,
	Subscribe,
};
