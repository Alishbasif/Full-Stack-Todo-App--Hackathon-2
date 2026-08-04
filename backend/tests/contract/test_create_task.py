"""Contract test for POST /api/{user_id}/tasks — contracts/tasks-api.md."""

from fastapi.testclient import TestClient

from tests.conftest import auth_headers


def test_create_task_returns_201_with_task_shape(client: TestClient) -> None:
    response = client.post(
        "/api/user-1/tasks",
        json={"title": "Buy groceries", "description": "Milk, eggs, bread"},
        headers=auth_headers("user-1"),
    )
    assert response.status_code == 201
    body = response.json()
    assert body["title"] == "Buy groceries"
    assert body["description"] == "Milk, eggs, bread"
    assert body["completed"] is False
    assert isinstance(body["id"], int)
    assert "created_at" in body
    assert "updated_at" in body


def test_create_task_title_only(client: TestClient) -> None:
    response = client.post(
        "/api/user-1/tasks", json={"title": "Just a title"}, headers=auth_headers("user-1")
    )
    assert response.status_code == 201
    assert response.json()["description"] is None


def test_create_task_empty_title_returns_400(client: TestClient) -> None:
    response = client.post("/api/user-1/tasks", json={"title": ""}, headers=auth_headers("user-1"))
    assert response.status_code == 400
    assert "detail" in response.json()


def test_create_task_title_too_long_returns_400(client: TestClient) -> None:
    response = client.post(
        "/api/user-1/tasks", json={"title": "x" * 201}, headers=auth_headers("user-1")
    )
    assert response.status_code == 400


def test_create_task_description_too_long_returns_400(client: TestClient) -> None:
    response = client.post(
        "/api/user-1/tasks",
        json={"title": "Valid title", "description": "x" * 1001},
        headers=auth_headers("user-1"),
    )
    assert response.status_code == 400


def test_create_task_without_token_returns_401(client: TestClient) -> None:
    response = client.post("/api/user-1/tasks", json={"title": "No auth"})
    assert response.status_code == 401
