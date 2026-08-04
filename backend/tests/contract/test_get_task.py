"""Contract test for GET /api/{user_id}/tasks/{id} — contracts/tasks-api.md."""

from fastapi.testclient import TestClient

from tests.conftest import auth_headers


def test_get_task_returns_full_details(client: TestClient) -> None:
    headers = auth_headers("user-get")
    created = client.post(
        "/api/user-get/tasks", json={"title": "Detail task"}, headers=headers
    ).json()

    response = client.get(f"/api/user-get/tasks/{created['id']}", headers=headers)
    assert response.status_code == 200
    assert response.json()["id"] == created["id"]
    assert response.json()["title"] == "Detail task"


def test_get_nonexistent_task_returns_404(client: TestClient) -> None:
    response = client.get("/api/user-get/tasks/999999", headers=auth_headers("user-get"))
    assert response.status_code == 404
    assert "detail" in response.json()


def test_get_task_without_token_returns_401(client: TestClient) -> None:
    response = client.get("/api/user-get/tasks/1")
    assert response.status_code == 401
