const Redis = require("ioredis");
const redis = new Redis({
	port: process.env.REDIS_PORT ?? 6379,
	host: process.env.REDIS_HOST ?? "localhost",
	password: process.env.REDIS_PASS ?? "",
	//family: 4, // 4 (IPv4) or 6 (IPv6)
	//username: ""
	//db: 0,
});

const removeByPrefix = (prefix) => {
	return new Promise((resolve, reject) => {
		const stream = redis.scanStream({
			match: `${prefix}*`,
		});

		stream.on("data", (keys) => {
			// `keys` is an array of strings representing key names
			if (keys.length) {
				var pipeline = redis.pipeline();
				keys.forEach(function (key) {
					pipeline.del(key);
				});
				pipeline.exec();
			}

			resolve();
		});

		stream.on("end", () => {
			resolve();
		});

		stream.on("error", (err) => {
			reject(err);
		});
	});
};

const getKeysByPrefix = (prefix) =>
	new Promise((resolve, reject) => {
		let keys = [];

		const stream = redis.scanStream({
			match: `${prefix}*`,
		});

		stream.on("data", (keysFromStream) => {
			keys = keysFromStream;
		});

		stream.on("end", () => {
			resolve(keys);
		});

		stream.on("error", (err) => {
			reject(err);
		});
	});

module.exports = { redis, removeByPrefix, getKeysByPrefix };
