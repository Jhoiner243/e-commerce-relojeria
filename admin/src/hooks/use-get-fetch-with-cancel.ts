/* eslint-disable @typescript-eslint/no-explicit-any */
export class ApiError extends Error {
	public status: number;

	public url: string;

	public title: string;

	public timestamp: string;

	public constructor(status: number, url: string, title: string, message: string) {
		super(message);
		this.status = status;
		this.url = url;
		this.title = title;
		this.timestamp = new Date().toISOString();
		this.name = "ApiError";
	}
}

type CacheMode = "no-store" | "reload" | "force-cache";

//* Cache to store responses temporarily
const cache = new Map<string, unknown>();

//* Generic interface for response data
export interface ResponseDTO<T> {
	data: T | null;
	status: number;
	message?: string;
	url: string;
	timestamp: string;
}

//! Ensure environment variable is defined
if (!process.env.NEXT_PUBLIC_URL_FRONT) {
	throw new Error("NEXT_PUBLIC_URL_FRONT is not defined");
}

export const getFetchWithCancel = async <ResponseType, RequestType = any>(
	url: string,
	method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
	data?: RequestType | null | undefined,
	cacheMode: CacheMode = "no-store",
	headers: Record<string, string> = {},
	timeout?: number,
): Promise<ResponseType | undefined> => {
	const controller = new AbortController();
	const signal = controller.signal;

	const timeoutId = timeout ? setTimeout(() => controller.abort(), timeout) : null;

	try {
		//* Perform fetch request
		const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}${url}`, {
			method,
			body: data ? JSON.stringify(data) : null,
			headers: {
				"Content-Type": "application/json",
				...headers,
			},
			credentials: "include",
			cache: cacheMode,
			signal,
		});

		if (!response.ok) {
			if (response.status === 401) {
				throw new ApiError(response.status, url, "Unauthorized", "Unauthorized access");
			}
			throw new ApiError(response.status, url, "Fetch Error", response.statusText);
		}

		//* Parse response data
		let responseData: ResponseType | null = null;

		try {
			const contentType = response.headers.get("content-type");

			if (contentType && contentType.includes("application/json")) {
				responseData = await response.json();
				//? Handle text/plain response if needed
			} else {
				throw new ApiError(
					500,
					url,
					"Invalid Content-Type",
					"Expected JSON or text response but received different content type",
				);
			}
		} catch (jsonError) {
			//! Replace console.error with an alternative
			if (jsonError instanceof SyntaxError) {
				throw new ApiError(500, url, "JSON Parse Error", "Failed to parse JSON response");
			} else {
				throw new ApiError(
					500,
					url,
					"Unknown JSON Error",
					"An unknown error occurred while parsing JSON response",
				);
			}
		}

		//! Handle case where the response data is null or missing expected structure
		if (!responseData) {
			throw new ApiError(500, url, "Fetch Error", "No response data found");
		}

		//* Cache the response if not using "no-store"
		if (cacheMode !== "no-store") {
			cache.set(url, responseData);
		}

		return responseData;
	} catch (err: unknown) {
		if (err instanceof ApiError) {
			throw err;
		}

		if (err instanceof Error && err.name === "AbortError") {
			throw new ApiError(499, url, "Abort Error", "Client Closed Request");
		}

		//* Return cached response if available and cacheMode allows it
		if (cacheMode !== "no-store" && cache.has(url)) {
			return cache.get(url) as ResponseType;
		}

		//! Default error if nothing works
		throw new ApiError(500, url, "Internal Error", "Internal Server Error");
	} finally {
		if (timeoutId) {
			clearTimeout(timeoutId);
		}
		controller.abort();
	}
};