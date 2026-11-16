import axios, { isAxiosError } from "axios";

// In the browser we call same-origin `/api`, which next.config.ts rewrites to the
// backend — so cookies (better-auth session) work and there is no CORS.
// On the server (Server Components) there is no origin, so we call the backend directly.
const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:5000";

export const API_BASE_URL =
  typeof window === "undefined" ? `${BACKEND_URL}/api` : "/api";

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// Backend errors come back as `{ message }` (controllers, better-auth) or `{ error }` (auth middleware).
function toApiError(cause: unknown): ApiError {
  if (!isAxiosError(cause)) {
    return new ApiError(0, "Something went wrong. Please try again.");
  }
  if (!cause.response) {
    return new ApiError(0, "Could not reach the server. Check your connection.");
  }

  const body = cause.response.data as
    | { message?: string; error?: string }
    | undefined;
  return new ApiError(
    cause.response.status,
    body?.message ??
      body?.error ??
      `Request failed with status ${cause.response.status}`,
  );
}

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 15_000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.response.use(
  (response) => response,
  (cause) =>
    axios.isCancel(cause)
      ? Promise.reject(cause)
      : Promise.reject(toApiError(cause)),
);

/** Standard envelope returned by the backend controllers. */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface Paginated<T> extends ApiResponse<T[]> {
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
