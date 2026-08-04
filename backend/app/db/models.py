"""SQLModel table models.

Authoritative schema source: specs/backendspecs/data-model.md and
Constitution IV. The `users` table is owned by the (forthcoming) Database &
Authentication feature and is not defined here — this feature only stores a
`user_id` string extracted from a verified JWT.
"""

from datetime import UTC, datetime

from sqlmodel import Field, SQLModel


def _utcnow() -> datetime:
    return datetime.now(UTC)


class Task(SQLModel, table=True):
    """A single todo item owned by exactly one user."""

    __tablename__ = "tasks"

    id: int | None = Field(default=None, primary_key=True)
    user_id: str = Field(
        index=True, nullable=False, description="Owning user's identity (from JWT `sub`)"
    )
    title: str = Field(nullable=False, min_length=1, max_length=200)
    description: str | None = Field(default=None, nullable=True, max_length=1000)
    completed: bool = Field(default=False, index=True, nullable=False)
    created_at: datetime = Field(default_factory=_utcnow, nullable=False)
    updated_at: datetime = Field(default_factory=_utcnow, nullable=False)
