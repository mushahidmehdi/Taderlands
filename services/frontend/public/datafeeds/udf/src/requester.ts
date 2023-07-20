import { RequestParams, UdfErrorResponse, UdfResponse, logMessage } from './helpers';

export class Requester {
	private _headers: HeadersInit | undefined;

	public constructor(headers?: HeadersInit) {
		if (headers) {
			this._headers = headers;
		}
	}

	public sendRequest<T extends UdfResponse>(datafeedUrl: string, urlPath: string, params?: RequestParams): Promise<T | UdfErrorResponse>;
	public sendRequest<T>(datafeedUrl: string, urlPath: string, params?: RequestParams): Promise<T>;
	public sendRequest<T>(datafeedUrl: string, urlPath: string, params?: RequestParams): Promise<T> {
		if (params !== undefined) {
			const paramKeys = Object.keys(params);
			if (paramKeys.length !== 0) {
				urlPath += '?';
			}

			urlPath += paramKeys.map((key: string) => {
				return `${encodeURIComponent(key)}=${encodeURIComponent(params[key].toString())}`;
			}).join('&');
		}

		logMessage('New request: ' + urlPath);

		// Send user cookies if the URL is on the same origin as the calling script.
		const options: RequestInit = { credentials: 'same-origin' };

		if (this._headers !== undefined) {
			options.headers = this._headers;
		}
		let jwt = '';

		try {
			jwt =  JSON.parse(JSON.parse(localStorage.getItem("persist:paratica:paratica-web" )||"{}").jwt).jwt.accessToken;
		} catch (error) {
			console.log("Can not get token.");
		}

		return fetch(`${datafeedUrl}/${urlPath}`, {...options, headers: {
			...options?.headers,
			...(jwt ? {Authorization: `Bearer ${jwt}})`} : {}),
		}})
			.then((response: Response) => response.text())
			.then((responseTest: string) => JSON.parse(responseTest));
	}
}
