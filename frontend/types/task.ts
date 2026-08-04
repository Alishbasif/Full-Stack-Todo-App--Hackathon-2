/**
 * Frontend-facing view of the Task entity.
 * Source of truth: specs/frontendspecs/data-model.md -> Entity: Task
 *
 * The frontend does not own persistence; this type mirrors the API's
 * response shape (specs/frontendspecs/contracts/tasks-api.md) after
 * normalizing the snake_case wire format to camelCase for UI code.
 */
export interface Task {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

/** Wire format returned by the Tasks REST API (contracts/tasks-api.md). */
export interface TaskDTO {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

/** Payload for POST /api/{user_id}/tasks */
export interface CreateTaskInput {
  title: string;
  description?: string;
}

/** Payload for PUT /api/{user_id}/tasks/{id} */
export interface UpdateTaskInput {
  title?: string;
  description?: string;
}

/** Optional query parameters for GET /api/{user_id}/tasks */
export type TaskStatusFilter = "all" | "pending" | "completed";
export type TaskSort = "created" | "title" | "due_date";

export interface ListTasksParams {
  status?: TaskStatusFilter;
  sort?: TaskSort;
}

/**
 * Derived, frontend-only view state for the task list.
 * Source: data-model.md -> Derived view state.
 */
export type TaskListStatus = "loading" | "error" | "empty" | "ready";

/** Per-field validation messages surfaced before a request is sent. */
export interface TaskFormErrors {
  title?: string;
  description?: string;
}

/** Maps a wire-format TaskDTO to the camelCase Task used throughout the UI. */
export function fromTaskDTO(dto: TaskDTO): Task {
  return {
    id: dto.id,
    title: dto.title,
    description: dto.description,
    completed: dto.completed,
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
  };
}
