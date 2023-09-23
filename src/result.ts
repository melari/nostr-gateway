export type Result<T> = { data: T; ok: true } | { error: string; ok: false };

export function wrap<T>(data: T): Result<T> {
	return { data, ok: true };
}

export function err<T>(error: string): Result<T> {
    return { error, ok: false };
}

export function unwrap<T>(result: Result<T>): T {
	if (result.ok) {
		return result.data;
	} else {
		throw new Error(result.error);
	}
}