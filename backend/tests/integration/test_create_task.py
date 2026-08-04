"""Integration test covering spec.md US1 Acceptance Scenarios 1-3 (Create a Task)."""

from fastapi.testclient import TestClient

from tests.conftest import auth_headers


def test_scenario_1_title_between_1_and_200_chars_creates_incomplete_task(
    client: TestClient,
) -> None:
    response = client.post(
        "/api/us1-user/tasks", json={"title": "Buy groceries"}, headers=auth_headers("us1-user")
    )
    assert response.status_code == 201
    body = response.json()
    assert body["completed"] is False
    assert "created_at" in body


def test_scenario_2_description_up_to_1000_chars_is_saved(client: TestClient) -> None:
    description = "x" * 1000
    response = client.post(
        "/api/us1-user/tasks",
        json={"title": "With description", "description": description},
        headers=auth_headers("us1-user"),
    )
    assert response.status_code == 201
    assert response.json()["description"] == description


def test_scenario_3_empty_title_rejected_no_task_created(client: TestClient) -> None:
    headers = auth_headers("us1-user")
    before = client.get("/api/us1-user/tasks", headers=headers).json()

    response = client.post("/api/us1-user/tasks", json={"title": ""}, headers=headers)
    assert response.status_code == 400

    after = client.get("/api/us1-user/tasks", headers=headers).json()
    assert len(after) == len(before)
