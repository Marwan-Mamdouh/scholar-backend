const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function readError(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as { message?: string };
    if (body?.message) return body.message;
  } catch {}
  return `Request failed with status ${response.status}`;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, init);
  } catch {
    throw new ApiError(0, "Could not reach the server. Check your connection.");
  }

  if (!response.ok) {
    throw new ApiError(response.status, await readError(response));
  }

  return (await response.json()) as T;
}

export function apiGet<T>(path: string, init?: RequestInit): Promise<T> {
  return request<T>(path, { ...init, method: "GET" });
}

export function apiPost<T>(
  path: string,
  body: unknown,
  init?: RequestInit,
): Promise<T> {
  return request<T>(path, {
    ...init,
    method: "POST",
    headers: { "Content-Type": "application/json", ...init?.headers },
    body: JSON.stringify(body),
  });
}
