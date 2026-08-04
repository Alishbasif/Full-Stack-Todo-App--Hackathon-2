"""FastAPI application entry point.

Mounts the tasks router and installs centralized, non-leaking exception
handling (FR-012): every error response is the `{"detail": "..."}` shape
from contracts/tasks-api.md — no stack traces, raw exception text, or
database errors are ever returned to a client.
"""

import logging
import os

from fastapi import FastAPI, HTTPException, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.routes.tasks import router as tasks_router

logger = logging.getLogger("app")

app = FastAPI(title="Todo Task Management REST API", version="0.1.0")

# The frontend (Next.js, a different origin/port) calls this API directly
# from the browser with an `Authorization: Bearer <token>` header — no
# cookies are used for task requests, so credentials do not need to be
# allowed. Origin is configurable via FRONTEND_ORIGIN for deployment; the
# Phase II frontend's local dev origin is the default.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.environ.get("FRONTEND_ORIGIN", "http://localhost:3000")],
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH"],
    allow_headers=["Authorization", "Content-Type"],
)


@app.exception_handler(HTTPException)
async def http_exception_handler(_: Request, exc: HTTPException) -> JSONResponse:
    """Ensure every HTTPException response uses the `{"detail": ...}` shape."""
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
        headers=exc.headers,
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(
    _: Request, exc: RequestValidationError
) -> JSONResponse:
    """Map request validation failures to 400 with a field-specific message.

    contracts/tasks-api.md specifies `400` for validation errors (FR-007),
    not FastAPI's default `422`.
    """
    errors = exc.errors()
    if errors:
        first = errors[0]
        field = ".".join(str(part) for part in first.get("loc", []) if part != "body")
        message = first.get("msg", "Invalid request")
        detail = f"{field}: {message}" if field else message
    else:
        detail = "Invalid request"
    return JSONResponse(status_code=status.HTTP_400_BAD_REQUEST, content={"detail": detail})


@app.exception_handler(Exception)
async def unhandled_exception_handler(_: Request, exc: Exception) -> JSONResponse:
    """Catch-all: never leak stack traces, SQL errors, or secrets (FR-012)."""
    logger.exception("Unhandled server error", exc_info=exc)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "An unexpected error occurred"},
    )


app.include_router(tasks_router)


@app.get("/health", tags=["health"])
def health_check() -> dict[str, str]:
    """Liveness probe — not part of the tasks contract."""
    return {"status": "ok"}
