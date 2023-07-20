const fs = require("fs");
const Router = require("koa-router");
const router = Router();

const authParser = require("@backend/common/middlewares/authParser");
const authRequired = require("@backend/common/middlewares/authRequired");
const errorHandler = require("@backend/common/middlewares/errorHandler");
const responseBody = require("@backend/common/middlewares/responseBody");
const { subscribe: subscribeCache, intervene: interveneWithCache } = require("@backend/common/middlewares/cache");

// MIDDLEWARES
router.use(errorHandler);
router.use(authParser);
router.use(authRequired);
router.use(responseBody);

router.use(
	["/funnels", "/merchants", "/market-strategies", "/stories", "/topics"],
	subscribeCache(),
	interveneWithCache
);

// ROUTES
const routes = fs.readdirSync(__dirname);
for (const route of routes) {
	if (route !== "index.js") {
		router.use(require("./" + route.substring(0, route.length - 3)).middleware());
	}
}

module.exports = router;
