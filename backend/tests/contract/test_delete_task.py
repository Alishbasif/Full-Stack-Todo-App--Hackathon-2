"""Contract test for DELETE /api/{user_id}/tasks/{id} — contracts/tasks-api.md."""

from fastapi.testclient import TestClient

from tests.conftest import auth_headers


def test_delete_task_returns_204(client: TestClient) -> None:
    headers = auth_headers("user-delete")
    created = client.post(
        "/api/user-delete/tasks", json={"title": "To delete"}, headers=headers
    ).json()

    response = client.delete(f"/api/user-delete/tasks/{created['id']}", headers=headers)
    assert response.status_code == 204
    assert response.content == b""

    follow_up = client.get(f"/api/user-delete/tasks/{created['id']}", headers=headers)
    assert follow_up.status_code == 404


def test_delete_nonexistent_task_returns_404(client: TestClient) -> None:
    response = client.delete("/api/user-delete/tasks/999999", headers=auth_headers("user-delete"))
    assert response.status_code == 404


def test_delete_task_without_token_returns_401(client: TestClient) -> None:
    response = client.delete("/api/user-delete/tasks/1")
    assert response.status_code == 401
