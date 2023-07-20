const Router = require("koa-router");

/**
 * @route POST /example
 * @group example - create example
 *
 
 *
 * @returns {object} 200 - on success
 *
 * @security ApiKey
 */
async function handler(ctx, next) {
	

	return next();
}

const router = Router();

router.post("/:param", handler);


module.exports = router;
