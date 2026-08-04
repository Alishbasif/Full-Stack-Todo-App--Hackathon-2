"""Task business logic: validation, ownership enforcement, orchestration.

Routes call only this module; this module is the only caller of
`app.repositories.task_repository`. Pydantic schemas already validate shape
and length at the request boundary (schemas/task.py); this layer is
responsible for not-found handling (FR-011) and any cross-field business
rules.
"""

from fastapi import HTTPException, status
from sqlmodel import Session

from app.db.models import Task
from app.repositories import task_repository
from app.schemas.task import TaskCreate, TaskUpdate

_TASK_NOT_FOUND = HTTPException(
    status_code=status.HTTP_404_NOT_FOUND,
    detail="Task not found",
)


def create_task(session: Session, *, user_id: str, payload: TaskCreate) -> Task:
    """Create a new task owned by `user_id` (US1, FR-006, FR-007)."""
    return task_repository.create(
        session,
        user_id=user_id,
        title=payload.title,
        description=payload.description,
    )


def list_tasks(
    session: Session, *, user_id: str, status: str = "all", sort: str = "created"
) -> list[Task]:
    """List tasks owned by `user_id`, empty list if none (US2)."""
    return task_repository.list_for_user(session, user_id=user_id, status=status, sort=sort)


def get_task(session: Session, *, user_id: str, task_id: int) -> Task:
    """Fetch a single task, raising 404 if missing or not owned (US2, FR-011)."""
    task = task_repository.get_by_id(session, user_id=user_id, task_id=task_id)
    if task is None:
        raise _TASK_NOT_FOUND
    return task


def update_task(session: Session, *, user_id: str, task_id: int, payload: TaskUpdate) -> Task:
    """Update title and/or description, refreshing `updated_at` (US5, FR-008)."""
    task = get_task(session, user_id=user_id, task_id=task_id)
    return task_repository.update(
        session,
        task=task,
        title=payload.title,
        description=payload.description,
        description_provided="description" in payload.model_fields_set,
    )


def toggle_task_complete(session: Session, *, user_id: str, task_id: int) -> Task:
    """Flip a task's completion status (US4, FR-009)."""
    task = get_task(session, user_id=user_id, task_id=task_id)
    return task_repository.toggle_complete(session, task=task)


def delete_task(session: Session, *, user_id: str, task_id: int) -> None:
    """Permanently delete a task (US6, FR-010)."""
    task = get_task(session, user_id=user_id, task_id=task_id)
    task_repository.delete(session, task=task)
