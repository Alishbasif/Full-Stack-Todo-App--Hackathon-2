"""SQLModel engine/session factory.

Connects to Neon Serverless PostgreSQL via DATABASE_URL (read exclusively
from the environment — Constitution IV). Sessions are short-lived and
injected per-request via `get_session`; never held open longer than a single
request/service call (Backend-skill: Database Connectivity).
"""

from collections.abc import Generator

from sqlmodel import Session, create_engine

from app.core.config import get_settings

_settings = get_settings()

# `pool_pre_ping` avoids serving requests over a stale/dropped Neon
# serverless connection; Neon's pooler already handles connection pooling,
# so we keep the local pool small.
engine = create_engine(
    _settings.sqlalchemy_database_url,
    pool_pre_ping=True,
    pool_size=5,
    max_overflow=5,
)


def get_session() -> Generator[Session, None, None]:
    """FastAPI dependency yielding a short-lived DB session, always closed."""
    with Session(engine) as session:
        yield session
