BigInt.prototype.toJSON = function () {
	return this.toString();
};
const koa = require("koa");
const locale = require("koa-locale");
const helmet = require("koa-helmet");

const bodyParser = require("koa-bodyparser");
const cors = require("@koa/cors");
const { logger } = require("koa2-winston");
const winston = require("winston");
const router = require("./routes");

const PORT = process.env.PORT ?? 3000;
const LOG_LEVEL = process.env.LOG_LEVEL ?? "info";

const app = new koa();
app.use(cors());
app.use(helmet.hsts());

locale(app);

app.use(
	bodyParser({
		jsonLimit: "150mb",
	})
);

app.use(
	logger({
		transports: new winston.transports.Console({
			json: true,
			stringify: true,
			level: LOG_LEVEL,
		}),
		level: "debug",
	})
);

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(PORT, function () {
	console.log(`Server running on https://localhost:${PORT}`);
});
