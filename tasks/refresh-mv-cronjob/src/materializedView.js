const { dbClient } = require("@paratica/common/prisma");

async function refreshMaterializedView() {
	const materializedViews = await dbClient.$queryRaw`select * from pg_matviews where schemaname ='public' ;`;

	for (let i = 0; i < materializedViews.length; ++i) {
		try {
			const outputMessage =
				await dbClient.$queryRaw`select refresh_materialized_view(${materializedViews[i].matviewname});`;

			console.log(outputMessage);

			if (outputMessage[0].refresh_materialized_view) {
				console.log(materializedViews[i].matviewname + " : " + outputMessage[0].refresh_materialized_view);
			}
		} catch (error) {
			console.log(materializedViews[i].matviewname + " error : " + error);
		}
	}

	process.exit(0);

	return;
}

module.exports = { refreshMaterializedView };
