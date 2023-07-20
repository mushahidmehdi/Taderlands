export class ApiError extends Error {
	constructor(message) {
		super(message);
		this.name = "ApiError";
		this.message = message;
	}
}

export const errorHandler = async (res) => {
	const json = await res.json();

	if (!res?.ok) {
		throw new ApiError(`${json?.error?.code}.${json?.error?.detail}`);
	}

	return json;
};
