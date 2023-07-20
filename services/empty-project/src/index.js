const koa = require("koa");
const locale = require("koa-locale");

const bodyParser = require("koa-bodyparser");
const { logger } = require("koa2-winston");
const winston = require("winston");
const router = require("./routes");



const PORT = process.env.PORT ?? 3000;
const LOG_LEVEL = process.env.LOG_LEVEL ?? "info";

const app = new koa();
locale(app);
app.use(bodyParser());
app.use(
	logger({
		transports: new winston.transports.Console({ json: true, stringify: true, level: LOG_LEVEL }),
		level: "debug",
	})
);

app.use(router.routes());

const options = {
	swaggerDefinition: {
		info: {
			description: "like Service",
			title: "paratica",
			version: "1.0.0",
		},
		host: app.env === "development" ? "api-dev.shuffley.io" : "api2.shuffley.io",
		basePath: "/v1/like",
		produces: ["application/json"],
		schemes: ["https"],
		securityDefinitions: {
			ApiKey: {
				type: "apiKey",
				in: "header",
				name: "X-API-KEY",
			},
		},
	},
	basedir: __dirname, //app absolute path
	files: ["./routes/**/*.js"], //Path to the API handle folder
};
const koaSwagger = require("koa-swagger-generator")(app);
koaSwagger(options);

app.listen(PORT, function () {
	console.log(`Server running on https://localhost:${PORT}`);
});
