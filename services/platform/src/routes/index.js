const fs = require("fs");
const Router = require("koa-router");

const authParser = require("@backend/common/middlewares/authParser");
const errorHandler = require("@backend/common/middlewares/errorHandler");
const authRequired = require("@backend/common/middlewares/authRequired");
const responseBody = require("@backend/common/middlewares/responseBody");

const router = Router();

const routs = fs.readdirSync(__dirname);

router.use(errorHandler);
router.use(authParser);
router.use(authRequired);
router.use(responseBody);

for (const iterator of routs) {
	if (iterator === "index.js") {
	} else {
		router.use(require("./" + iterator.substring(0, iterator.length - 3)).routes());
	}
}

module.exports = router;
