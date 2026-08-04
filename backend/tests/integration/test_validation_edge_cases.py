"""Integration test covering spec.md Edge Cases: malformed request bodies and
wrong-type fields must be rejected with 400 and must not be partially applied."""

from fastapi.testclient import TestClient

from tests.conftest import auth_headers


def test_create_with_non_string_title_returns_400(client: TestClient) -> None:
    response = client.post(
        "/api/edge-user/tasks", json={"title": 12345}, headers=auth_headers("edge-user")
    )
    assert response.status_code == 400


def test_create_with_missing_title_field_returns_400(client: TestClient) -> None:
    response = client.post(
        "/api/edge-user/tasks", json={"description": "no title at all"},
        headers=auth_headers("edge-user"),
    )
    assert response.status_code == 400


def test_create_with_non_json_body_returns_400(client: TestClient) -> None:
    response = client.post(
        "/api/edge-user/tasks",
        content=b"not-json-at-all",
        headers={**auth_headers("edge-user"), "Content-Type": "application/json"},
    )
    assert response.status_code == 400


def test_malformed_create_does_not_partially_create_a_task(client: TestClient) -> None:
    headers = auth_headers("edge-user")
    before = client.get("/api/edge-user/tasks", headers=headers).json()

    client.post("/api/edge-user/tasks", json={"title": None}, headers=headers)

    after = client.get("/api/edge-user/tasks", headers=headers).json()
    assert len(after) == len(before)


def test_update_with_wrong_type_description_returns_400(client: TestClient) -> None:
    headers = auth_headers("edge-user")
    task = client.post("/api/edge-user/tasks", json={"title": "Valid"}, headers=headers).json()

    response = client.put(
        f"/api/edge-user/tasks/{task['id']}",
        json={"description": 42},
        headers=headers,
    )
    assert response.status_code == 400
