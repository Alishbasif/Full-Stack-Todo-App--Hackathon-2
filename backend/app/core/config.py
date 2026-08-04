"""Environment configuration loader.

Reads DATABASE_URL and BETTER_AUTH_SECRET exclusively from the process
environment (pydantic-settings also loads `backend/.env` for local dev). No
secret is ever hardcoded here — Constitution IV / research.md.
"""

from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings sourced from environment variables / `.env`."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    database_url: str
    better_auth_secret: str
    jwt_algorithm: str = "HS256"

    @property
    def sqlalchemy_database_url(self) -> str:
        """`database_url`, normalized to explicitly use the psycopg3 driver.

        The provided Neon connection string uses the driver-less
        `postgresql://` scheme, which SQLAlchemy defaults to psycopg2 (not
        installed in this project — we use psycopg3 per pyproject.toml).
        """
        url = self.database_url
        if url.startswith("postgresql://"):
            return url.replace("postgresql://", "postgresql+psycopg://", 1)
        return url


@lru_cache
def get_settings() -> Settings:
    """Return a cached Settings instance (loaded once per process)."""
    return Settings()  # type: ignore[call-arg]
