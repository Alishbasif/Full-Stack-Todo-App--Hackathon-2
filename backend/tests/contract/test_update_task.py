"""Contract test for PUT /api/{user_id}/tasks/{id} — contracts/tasks-api.md."""

from fastapi.testclient import TestClient

from tests.conftest import auth_headers


def test_update_task_title_returns_200(client: TestClient) -> None:
    headers = auth_headers("user-update")
    created = client.post(
        "/api/user-update/tasks", json={"title": "Old title"}, headers=headers
    ).json()

    response = client.put(
        f"/api/user-update/tasks/{created['id']}",
        json={"title": "New title"},
        headers=headers,
    )
    assert response.status_code == 200
    body = response.json()
    assert body["title"] == "New title"
    assert body["updated_at"] >= created["updated_at"]


def test_update_task_empty_title_returns_400(client: TestClient) -> None:
    headers = auth_headers("user-update")
    created = client.post(
        "/api/user-update/tasks", json={"title": "Keep me"}, headers=headers
    ).json()

    response = client.put(
        f"/api/user-update/tasks/{created['id']}", json={"title": ""}, headers=headers
    )
    assert response.status_code == 400


def test_update_nonexistent_task_returns_404(client: TestClient) -> None:
    response = client.put(
        "/api/user-update/tasks/999999",
        json={"title": "Doesn't matter"},
        headers=auth_headers("user-update"),
    )
    assert response.status_code == 404


def test_update_task_without_token_returns_401(client: TestClient) -> None:
    response = client.put("/api/user-update/tasks/1", json={"title": "x"})
    assert response.status_code == 401
