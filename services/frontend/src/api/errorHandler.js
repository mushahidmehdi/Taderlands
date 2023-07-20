export class ApiError extends Error {
	constructor(message) {
		super(message);
		this.name = "ApiError";
		this.message = message;
	}
}

export const errorHandler = async (res) => {
	if (res.status === 204) return;

	const json = await res.json();

	if (!res?.ok) {
		if (json?.error?.code === "001" || json?.error?.code === "010") {
			throw new ApiError(json?.error?.detail);
		}

		throw new ApiError(`${json?.error?.code}.${json?.error?.detail}`);
	}

	return json;
};
