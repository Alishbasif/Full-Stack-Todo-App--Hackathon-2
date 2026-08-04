"""Integration test covering spec.md US3 Scenario 1: every operation without a
credential is rejected before any task data is read or modified (FR-001)."""

import jwt
import pytest
from fastapi.testclient import TestClient

from app.core.config import get_settings


@pytest.mark.parametrize(
    ("method", "path", "json"),
    [
        ("get", "/api/some-user/tasks", None),
        ("post", "/api/some-user/tasks", {"title": "x"}),
        ("get", "/api/some-user/tasks/1", None),
        ("put", "/api/some-user/tasks/1", {"title": "x"}),
        ("delete", "/api/some-user/tasks/1", None),
        ("patch", "/api/some-user/tasks/1/complete", None),
    ],
)
def test_operation_without_token_returns_401(
    client: TestClient, method: str, path: str, json: dict | None
) -> None:
    response = client.request(method, path, json=json)
    assert response.status_code == 401


def test_operation_with_malformed_token_returns_401(client: TestClient) -> None:
    response = client.get(
        "/api/some-user/tasks", headers={"Authorization": "Bearer not-a-real-jwt"}
    )
    assert response.status_code == 401


def test_token_with_aud_and_iss_claims_is_accepted(client: TestClient) -> None:
    """Regression test: Better Auth's `jwt` plugin stamps every real token
    with `aud`/`iss` set to its own baseURL (lib/auth.ts). PyJWT rejects any
    token carrying an `aud` claim unless `jwt.decode` is also given a
    matching `audience`, which previously caused every real login token to
    be rejected with 401 even though correctly signed (security.py must
    pass `options={"verify_aud": False}`)."""
    settings = get_settings()
    token = jwt.encode(
        {
            "sub": "some-user",
            "aud": "http://localhost:3000",
            "iss": "http://localhost:3000",
        },
        settings.better_auth_secret,
        algorithm=settings.jwt_algorithm,
    )
    response = client.get(
        "/api/some-user/tasks", headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
