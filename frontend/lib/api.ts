import { fromTaskDTO } from "@/types/task";
import type {
  CreateTaskInput,
  ListTasksParams,
  Task,
  TaskDTO,
  UpdateTaskInput,
} from "@/types/task";
import { authClient, getSessionToken } from "@/lib/auth-client";

/**
 * Centralized API client (Constitution II: "All backend calls MUST be
 * routed through a single centralized API client ... components and pages
 * MUST NOT call fetch/axios directly").
 *
 * Contract: specs/frontendspecs/contracts/tasks-api.md
 */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:8000";

export type ApiErrorKind =
  | "validation"
  | "not_found"
  | "unauthorized"
  | "network"
  | "server";

export class ApiError extends Error {
  readonly kind: ApiErrorKind;
  readonly status?: number;
  readonly fieldErrors?: Record<string, string>;

  constructor(
    message: string,
    kind: ApiErrorKind,
    status?: number,
    fieldErrors?: Record<string, string>
  ) {
    super(message);
    this.name = "ApiError";
    this.kind = kind;
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

/* -------------------------------------------------------------------------
 * Auth (US3, FR-012; specs/Database&Auth/contracts/auth-endpoints.md)
 * ---------------------------------------------------------------------- */

/**
 * The current session's JWT, issued by the Database & Authentication
 * feature's `lib/auth.ts` (HS256, shared `BETTER_AUTH_SECRET`) and verified
 * unchanged by the already-built backend's `get_current_user_id` dependency.
 */
export async function getAuthToken(): Promise<string | null> {
  if (typeof window === "undefined") return null;
  return getSessionToken();
}

/**
 * The signed-in account's id (JWT `sub`), used as the `{user_id}` path
 * segment on every request. Throws if called with no active session — every
 * call site here is already reached only from authenticated routes
 * (`middleware.ts` redirects unauthenticated requests to `/sign-in`).
 */
export async function getCurrentUserId(): Promise<string> {
  const { data } = await authClient.getSession();
  if (!data?.user?.id) {
    if (typeof window !== "undefined") {
      window.location.assign("/sign-in");
    }
    throw new ApiError(
      "Your session has expired. Redirecting to sign-in...",
      "unauthorized",
      401
    );
  }
  return data.user.id;
}

/* -------------------------------------------------------------------------
 * Core request wrapper + error mapping
 * (contracts/tasks-api.md -> "Frontend error-handling mapping")
 * ---------------------------------------------------------------------- */

async function safeJson(response: Response): Promise<Record<string, unknown> | null> {
  try {
    return (await response.json()) as Record<string, unknown>;
  } catch {
    return null;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const token = await getAuthToken();
  const headers = new Headers(init?.headers);
  headers.set("Content-Type", "application/json");
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, { ...init, headers });
  } catch {
    // Network failure / server unreachable -> FR-009 error state with retry
    throw new ApiError(
      "Unable to reach the server. Check your connection and try again.",
      "network"
    );
  }

  if (response.status === 401) {
    // Session expired or missing -> redirect to sign-in, do not retry silently.
    // The sign-in route itself belongs to the Database & Authentication
    // feature (out of scope here); this call site is wired per contract.
    if (typeof window !== "undefined") {
      window.location.assign("/sign-in");
    }
    throw new ApiError(
      "Your session has expired. Redirecting to sign-in...",
      "unauthorized",
      401
    );
  }

  if (response.status === 404) {
    throw new ApiError(
      "This task could not be found. It may have already been deleted.",
      "not_found",
      404
    );
  }

  if (response.status === 400) {
    const body = await safeJson(response);
    const message =
      (typeof body?.message === "string" && body.message) ||
      (typeof body?.detail === "string" && body.detail) ||
      "Please check the task details and try again.";
    const fieldErrors =
      body && typeof body.errors === "object"
        ? (body.errors as Record<string, string>)
        : undefined;
    throw new ApiError(message, "validation", 400, fieldErrors);
  }

  if (!response.ok) {
    throw new ApiError(
      "Something went wrong on the server. Please try again.",
      "server",
      response.status
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

/* -------------------------------------------------------------------------
 * Endpoints (contracts/tasks-api.md)
 * ---------------------------------------------------------------------- */

export async function listTasks(params: ListTasksParams = {}): Promise<Task[]> {
  const search = new URLSearchParams();
  if (params.status) search.set("status", params.status);
  if (params.sort) search.set("sort", params.sort);
  const qs = search.toString();
  const userId = await getCurrentUserId();
  const dtos = await request<TaskDTO[]>(
    `/api/${userId}/tasks${qs ? `?${qs}` : ""}`
  );
  return dtos.map(fromTaskDTO);
}

export async function createTask(input: CreateTaskInput): Promise<Task> {
  const userId = await getCurrentUserId();
  const dto = await request<TaskDTO>(`/api/${userId}/tasks`, {
    method: "POST",
    body: JSON.stringify(input),
  });
  return fromTaskDTO(dto);
}

export async function getTask(id: number): Promise<Task> {
  const userId = await getCurrentUserId();
  const dto = await request<TaskDTO>(`/api/${userId}/tasks/${id}`);
  return fromTaskDTO(dto);
}

export async function updateTask(
  id: number,
  input: UpdateTaskInput
): Promise<Task> {
  const userId = await getCurrentUserId();
  const dto = await request<TaskDTO>(`/api/${userId}/tasks/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
  return fromTaskDTO(dto);
}

export async function deleteTask(id: number): Promise<void> {
  const userId = await getCurrentUserId();
  await request<void>(`/api/${userId}/tasks/${id}`, {
    method: "DELETE",
  });
}

export async function toggleTaskComplete(id: number): Promise<Task> {
  const userId = await getCurrentUserId();
  const dto = await request<TaskDTO>(
    `/api/${userId}/tasks/${id}/complete`,
    { method: "PATCH" }
  );
  return fromTaskDTO(dto);
}
