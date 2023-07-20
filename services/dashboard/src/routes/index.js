const fs = require("fs");
const Router = require("koa-router");

const authParser = require("@backend/common/middlewares/authParser");
const authRequired = require("@backend/common/middlewares/authRequired");
const errorHandler = require("@backend/common/middlewares/errorHandler");
const responseBody = require("@backend/common/middlewares/responseBody");
const pathUsageCount = require("@backend/common/middlewares/pathUsageCount");
const { subscribe: subscribeCache, intervene: interveneWithCache } = require("@backend/common/middlewares/cache");

const router = Router();

// MIDDLEWARES
router.use(errorHandler);
router.use(authParser);
router.use(authRequired);
router.use(responseBody);
router.use(pathUsageCount);

router.use(["/dashboard"], subscribeCache(), interveneWithCache);

// ROUTES
const routes = fs.readdirSync(__dirname);
for (const route of routes) {
	if (route !== "index.js") {
		router.use(require("./" + route.substring(0, route.length - 3)).middleware());
	}
}

module.exports = router;
