const axios = require("axios");

function _orderByTier(tier, validatedUsers) {
	return validatedUsers.sort((a, b) => {
		const aValue = a[tier] || 0;
		const bValue = b[tier] || 0;

		return bValue - aValue;
	});
}

async function callWebService(params) {
	const { method, path, data, token } = params;

	const euroMessageBaseUrl = process.env.EURO_MESSAGE_API_BASE_URL;

	let config = {
		method,
		maxBodyLength: Infinity,
		url: euroMessageBaseUrl + path,
		headers: {
			"Content-Type": "application/json",
			...(token && { Authorization: token }),
		},
		data,
	};

	let responseData = "";

	await axios(config)
		.then(function (response) {
			responseData = response.data;
		})
		.catch(function (error) {
			responseData = error;
			console.log(error?.response?.data);
		});

	return responseData;
}
module.exports = { callWebService, _orderByTier };
