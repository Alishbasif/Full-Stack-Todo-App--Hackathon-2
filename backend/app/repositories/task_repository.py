"""Task persistence layer.

The only layer that touches the SQLModel session/database directly. Every
function is scoped by `user_id` — there is no code path here that can query,
mutate, or delete a task without an owning user_id filter (Constitution III,
FR-002).
"""

from datetime import UTC, datetime

from sqlmodel import Session, select

from app.db.models import Task


def create(session: Session, *, user_id: str, title: str, description: str | None) -> Task:
    """Insert a new task owned by `user_id`."""
    task = Task(user_id=user_id, title=title, description=description, completed=False)
    session.add(task)
    session.commit()
    session.refresh(task)
    return task


def list_for_user(
    session: Session,
    *,
    user_id: str,
    status: str = "all",
    sort: str = "created",
) -> list[Task]:
    """Return tasks owned by `user_id`, optionally filtered/sorted.

    `status`: "all" | "pending" | "completed" (contracts/tasks-api.md).
    `sort`: "created" (default, newest first) | "title" (alphabetical).
    """
    statement = select(Task).where(Task.user_id == user_id)
    if status == "pending":
        statement = statement.where(Task.completed == False)  # noqa: E712
    elif status == "completed":
        statement = statement.where(Task.completed == True)  # noqa: E712

    if sort == "title":
        statement = statement.order_by(Task.title.asc())
    else:
        statement = statement.order_by(Task.created_at.desc())

    return list(session.exec(statement).all())


def get_by_id(session: Session, *, user_id: str, task_id: int) -> Task | None:
    """Return the task with `task_id` iff it is owned by `user_id`, else None."""
    statement = select(Task).where(Task.id == task_id, Task.user_id == user_id)
    return session.exec(statement).first()


def update(
    session: Session,
    *,
    task: Task,
    title: str | None,
    description: str | None,
    description_provided: bool,
) -> Task:
    """Apply a partial update to an already-fetched, ownership-verified task."""
    if title is not None:
        task.title = title
    if description_provided:
        task.description = description
    task.updated_at = datetime.now(UTC)
    session.add(task)
    session.commit()
    session.refresh(task)
    return task


def toggle_complete(session: Session, *, task: Task) -> Task:
    """Flip `completed` on an already-fetched, ownership-verified task."""
    task.completed = not task.completed
    task.updated_at = datetime.now(UTC)
    session.add(task)
    session.commit()
    session.refresh(task)
    return task


def delete(session: Session, *, task: Task) -> None:
    """Permanently remove an already-fetched, ownership-verified task."""
    session.delete(task)
    session.commit()
