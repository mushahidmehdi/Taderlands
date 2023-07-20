const { publish } = require("./services/sns.js");
const rabbitmq = require("@backend/common/services/rabbitmq");

const name = "smsNotification";
const queue = "sms_queue_sms";
const exchange = "smsNotification";
const routingKey = "smsNotification.send";

main();

async function main() {
	console.log("Service starting...");
	try {
		const channel = await rabbitmq.createChannelWrapper({ name, queue, exchange, routingKey });

		channel.consume(queue, async (receivedParams) => {
			const params = JSON.parse(receivedParams.content.toString());
			console.log(`starting sending sms to: ${params.PhoneNumber}`);

			publish(params);

			console.log(`finished sending sms to : ${params.PhoneNumber}`);
			channel.ack(receivedParams);
		});
	} catch (error) {
		console.log(`nacking message without requeue due to an error: ${error}`);
		channel.nack(receivedParams, false, false);
	}
}
