const { callWebService } = require("../utils/util");

const { dbClient } = require("@paratica/common/prisma");

const GROUP_NAME = "Genel";

const API_URL_PATH_MAP = {
	GET_TOKEN: "/auth/login",
	ASSING_TO_LIST: "/Member/AddToSendLists",
	REMOVE_FROM_LIST: "/Member/RemoveFromSendLists",
	CREATE_NEW_USER: "/Member/InsertMemberDemography",
};

async function getToken() {
	const params = {
		method: "post",
		path: API_URL_PATH_MAP.GET_TOKEN,
		data: JSON.stringify({
			username: process.env.EURO_MESSAGE_USERNAME,
			password: process.env.EURO_MESSAGE_PASSWORD,
		}),
	};

	const result = await callWebService(params);
	return result.ServiceTicket;
}

async function createNewUser(user, token) {
	const params = {
		method: "post",
		token,
		path: API_URL_PATH_MAP.CREATE_NEW_USER,
		data: JSON.stringify({
			Key: "EMAIL",
			Value: user.email,
			ForceUpdate: false,
			DemographicData: [],
		}),
	};

	await callWebService(params);
}

async function removeExistingAssigneeList(user, token, SendLists) {
	const userAssignedListParams = {
		method: "get",
		path: "/Member/QuerySendLists?Key=EMAIL&Value=" + user.email,
		token,
	};

	const assignedSendLists = await callWebService(userAssignedListParams);

	const removeList = [];

	for (let i = 0; i < assignedSendLists?.SendLists?.length; i++) {
		const assignedSendList = assignedSendLists?.SendLists[i];
		if (!SendLists.some((x) => x.ListName === assignedSendList.ListName)) {
			removeList.push({
				ListName: assignedSendList.ListName,
				GroupName: GROUP_NAME,
			});
		}
	}

	const removeListData = JSON.stringify({
		Key: "EMAIL",
		Value: user.email,
		DeleteIfInNoList: false,
		SendLists: removeList,
	});

	const removeListParams = {
		method: "post",
		path: API_URL_PATH_MAP.REMOVE_FROM_LIST,
		token,
		data: removeListData,
	};

	await callWebService(removeListParams);

	const euroMessageTransactionData = {
		userId: user.id,
		newAssignment: SendLists,
		removedAssignment: removeList,
		transactionDate: new Date(),
	};

	await dbClient.euroMessageAssignment.create({
		data: euroMessageTransactionData,
	});
}

module.exports = { getToken, createNewUser, removeExistingAssigneeList };
