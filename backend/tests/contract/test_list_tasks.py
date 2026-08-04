"""Contract test for GET /api/{user_id}/tasks — contracts/tasks-api.md."""

from fastapi.testclient import TestClient

from tests.conftest import auth_headers


def test_list_tasks_empty_returns_200_with_empty_array(client: TestClient) -> None:
    response = client.get("/api/user-empty/tasks", headers=auth_headers("user-empty"))
    assert response.status_code == 200
    assert response.json() == []


def test_list_tasks_returns_created_tasks(client: TestClient) -> None:
    headers = auth_headers("user-list")
    client.post("/api/user-list/tasks", json={"title": "Task A"}, headers=headers)
    client.post("/api/user-list/tasks", json={"title": "Task B"}, headers=headers)

    response = client.get("/api/user-list/tasks", headers=headers)
    assert response.status_code == 200
    titles = {task["title"] for task in response.json()}
    assert titles == {"Task A", "Task B"}


def test_list_tasks_without_token_returns_401(client: TestClient) -> None:
    response = client.get("/api/user-list/tasks")
    assert response.status_code == 401
