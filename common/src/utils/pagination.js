const getPaginationQuery = (pageNumber, pageSize) => {
	const paginationQuery = {
		skip: pageNumber ? parseInt(pageNumber) * parseInt(pageSize) : 0,
		take: pageSize ? parseInt(pageSize) : 50,
	};

	return paginationQuery;
};

module.exports = {
	getPaginationQuery,
};
