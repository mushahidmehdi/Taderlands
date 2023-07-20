const normalize = (data) => {
	return Object.keys(data).reduce((acc, key) => {
		acc[key] =
			acc?.[key]?.value || acc?.[key]?.steps
				? {
						...acc[key],
						steps: data[key]?.steps?.map((x) => {
							let obj = x;

							["value", "startsAt", "followDistance"].forEach((y) => {
								if (obj?.[y] !== null && obj?.[y] !== undefined) {
									obj = { ...obj, [y]: parseFloat(obj?.[y]?.toString().replace(",", ".") ?? 0) };
								}
							});

							return obj;
						}),
				  }
				: acc[key];

		acc[key] =
			acc?.[key]?.value || acc?.[key]?.steps
				? {
						...acc[key],
						enabled: Boolean(
							acc?.[key]?.value || acc?.[key]?.steps?.[0].value || acc?.[key]?.steps?.[0].startsAt
						),
				  }
				: acc?.[key];

		return acc;
	}, data);
};

module.exports = {
	normalize,
};
