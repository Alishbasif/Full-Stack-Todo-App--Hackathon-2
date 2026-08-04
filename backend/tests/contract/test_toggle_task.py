"""Contract test for PATCH /api/{user_id}/tasks/{id}/complete — contracts/tasks-api.md."""

from fastapi.testclient import TestClient

from tests.conftest import auth_headers


def test_toggle_task_flips_completed(client: TestClient) -> None:
    headers = auth_headers("user-toggle")
    created = client.post(
        "/api/user-toggle/tasks", json={"title": "Toggle me"}, headers=headers
    ).json()
    assert created["completed"] is False

    response = client.patch(
        f"/api/user-toggle/tasks/{created['id']}/complete", headers=headers
    )
    assert response.status_code == 200
    assert response.json()["completed"] is True

    response_again = client.patch(
        f"/api/user-toggle/tasks/{created['id']}/complete", headers=headers
    )
    assert response_again.status_code == 200
    assert response_again.json()["completed"] is False


def test_toggle_nonexistent_task_returns_404(client: TestClient) -> None:
    response = client.patch(
        "/api/user-toggle/tasks/999999/complete", headers=auth_headers("user-toggle")
    )
    assert response.status_code == 404


def test_toggle_task_without_token_returns_401(client: TestClient) -> None:
    response = client.patch("/api/user-toggle/tasks/1/complete")
    assert response.status_code == 401
