"""Pydantic request/response schemas for the Task resource.

Shapes match specs/backendspecs/contracts/tasks-api.md and data-model.md
exactly. `user_id` and `completed` are never accepted from a create/update
request body (FR-002, FR-009) — they are server-derived.
"""

from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field, field_validator


class TaskCreate(BaseModel):
    """Request body for POST /api/{user_id}/tasks (FR-006, FR-007)."""

    title: str = Field(..., min_length=1, max_length=200)
    description: str | None = Field(default=None, max_length=1000)

    @field_validator("title")
    @classmethod
    def _title_not_blank(cls, value: str) -> str:
        stripped = value.strip()
        if not stripped:
            raise ValueError("title must not be empty")
        if len(stripped) > 200:
            raise ValueError("title must not exceed 200 characters")
        return stripped

    @field_validator("description")
    @classmethod
    def _description_max_length(cls, value: str | None) -> str | None:
        if value is None:
            return value
        if len(value) > 1000:
            raise ValueError("description must not exceed 1000 characters")
        return value


class TaskUpdate(BaseModel):
    """Request body for PUT /api/{user_id}/tasks/{id} (FR-007, FR-008)."""

    title: str | None = Field(default=None, min_length=1, max_length=200)
    description: str | None = Field(default=None, max_length=1000)

    @field_validator("title")
    @classmethod
    def _title_not_blank(cls, value: str | None) -> str | None:
        if value is None:
            return value
        stripped = value.strip()
        if not stripped:
            raise ValueError("title must not be empty")
        if len(stripped) > 200:
            raise ValueError("title must not exceed 200 characters")
        return stripped

    @field_validator("description")
    @classmethod
    def _description_max_length(cls, value: str | None) -> str | None:
        if value is None:
            return value
        if len(value) > 1000:
            raise ValueError("description must not exceed 1000 characters")
        return value


class TaskRead(BaseModel):
    """Response body shape for a single Task (contracts/tasks-api.md)."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    description: str | None
    completed: bool
    created_at: datetime
    updated_at: datetime
