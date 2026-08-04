"""Tasks REST API routes.

Thin route handlers only — they resolve dependencies (DB session, verified
user identity) and delegate to `app.services.task_service`
(Constitution III: routes → services → repositories). Every route requires
`verify_path_user_matches_token`, which itself depends on
`get_current_user_id` (401 on missing/invalid token) and additionally
enforces the `{user_id}` path-vs-token-identity check (404 on mismatch,
research.md).
"""

from typing import Literal

from fastapi import APIRouter, Depends, status
from sqlmodel import Session

from app.core.security import verify_path_user_matches_token
from app.db.session import get_session
from app.schemas.task import TaskCreate, TaskRead, TaskUpdate
from app.services import task_service

router = APIRouter(prefix="/api/{user_id}/tasks", tags=["tasks"])


@router.get("", response_model=list[TaskRead])
def list_tasks(
    status_filter: Literal["all", "pending", "completed"] = "all",
    sort: Literal["created", "title"] = "created",
    user_id: str = Depends(verify_path_user_matches_token),
    session: Session = Depends(get_session),
) -> list[TaskRead]:
    """GET /api/{user_id}/tasks — list all tasks for the authenticated user."""
    tasks = task_service.list_tasks(session, user_id=user_id, status=status_filter, sort=sort)
    return [TaskRead.model_validate(task) for task in tasks]


@router.post("", response_model=TaskRead, status_code=status.HTTP_201_CREATED)
def create_task(
    payload: TaskCreate,
    user_id: str = Depends(verify_path_user_matches_token),
    session: Session = Depends(get_session),
) -> TaskRead:
    """POST /api/{user_id}/tasks — create a new task."""
    task = task_service.create_task(session, user_id=user_id, payload=payload)
    return TaskRead.model_validate(task)


@router.get("/{task_id}", response_model=TaskRead)
def get_task(
    task_id: int,
    user_id: str = Depends(verify_path_user_matches_token),
    session: Session = Depends(get_session),
) -> TaskRead:
    """GET /api/{user_id}/tasks/{id} — get a single task's details."""
    task = task_service.get_task(session, user_id=user_id, task_id=task_id)
    return TaskRead.model_validate(task)


@router.put("/{task_id}", response_model=TaskRead)
def update_task(
    task_id: int,
    payload: TaskUpdate,
    user_id: str = Depends(verify_path_user_matches_token),
    session: Session = Depends(get_session),
) -> TaskRead:
    """PUT /api/{user_id}/tasks/{id} — update a task's title/description."""
    task = task_service.update_task(session, user_id=user_id, task_id=task_id, payload=payload)
    return TaskRead.model_validate(task)


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(
    task_id: int,
    user_id: str = Depends(verify_path_user_matches_token),
    session: Session = Depends(get_session),
) -> None:
    """DELETE /api/{user_id}/tasks/{id} — permanently delete a task."""
    task_service.delete_task(session, user_id=user_id, task_id=task_id)


@router.patch("/{task_id}/complete", response_model=TaskRead)
def toggle_task_complete(
    task_id: int,
    user_id: str = Depends(verify_path_user_matches_token),
    session: Session = Depends(get_session),
) -> TaskRead:
    """PATCH /api/{user_id}/tasks/{id}/complete — toggle completion status."""
    task = task_service.toggle_task_complete(session, user_id=user_id, task_id=task_id)
    return TaskRead.model_validate(task)
