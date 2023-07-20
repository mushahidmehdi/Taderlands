const axios = require("axios");

async function checkCaptcha(value) {
	// await axios.get(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.CAPTCHA_SECRET}&response=${body.captcha}&remoteip=${ctx.request.header["cf-connecting-ip"]}`);
	const res = await axios.get(
		`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.CAPTCHA_SECRET}&response=${value}`
	);

	return res.data?.success;
}

module.exports = checkCaptcha;
