"""Shared pytest fixtures for contract and integration tests.

Test database: only one real Neon Postgres database is available in this
environment (no separate test branch, no local Docker Postgres) — see
research.md's "dedicated test database" decision, adapted here. Each test
runs inside its own DB-level transaction that is rolled back at teardown, so
no test data is ever permanently persisted to the real database.

Auth: no live Better Auth service exists yet (a separate, not-yet-built
feature), so tests mint their own valid JWTs directly with the same
BETTER_AUTH_SECRET the app verifies against.
"""

from collections.abc import Generator

import jwt
import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session

from app.core.config import get_settings
from app.db.session import engine, get_session
from app.main import app

_settings = get_settings()


@pytest.fixture
def db_session() -> Generator[Session, None, None]:
    """A Session bound to a transaction that is always rolled back."""
    connection = engine.connect()
    transaction = connection.begin()
    session = Session(bind=connection)
    try:
        yield session
    finally:
        session.close()
        transaction.rollback()
        connection.close()


@pytest.fixture
def client(db_session: Session) -> Generator[TestClient, None, None]:
    """A TestClient whose DB dependency is overridden to use the rolled-back session."""

    def _get_session_override() -> Generator[Session, None, None]:
        yield db_session

    app.dependency_overrides[get_session] = _get_session_override
    try:
        yield TestClient(app)
    finally:
        app.dependency_overrides.pop(get_session, None)


def make_token(user_id: str) -> str:
    """Mint a valid HS256 JWT for `user_id`, signed with the test BETTER_AUTH_SECRET."""
    return jwt.encode(
        {"sub": user_id}, _settings.better_auth_secret, algorithm=_settings.jwt_algorithm
    )


def auth_headers(user_id: str) -> dict[str, str]:
    """Authorization header for `user_id`."""
    return {"Authorization": f"Bearer {make_token(user_id)}"}
