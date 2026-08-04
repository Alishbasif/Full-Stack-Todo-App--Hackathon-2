"""Integration test covering spec.md US2 Acceptance Scenarios 1-3 (Retrieve Tasks)."""

from fastapi.testclient import TestClient

from tests.conftest import auth_headers


def test_scenario_1_list_returns_title_description_status_and_timestamps(
    client: TestClient,
) -> None:
    headers = auth_headers("us2-user")
    client.post(
        "/api/us2-user/tasks",
        json={"title": "Full details", "description": "desc"},
        headers=headers,
    )

    response = client.get("/api/us2-user/tasks", headers=headers)
    assert response.status_code == 200
    task = response.json()[0]
    for field in ("title", "description", "completed", "created_at", "updated_at"):
        assert field in task


def test_scenario_2_no_tasks_returns_empty_list_not_error(client: TestClient) -> None:
    response = client.get("/api/us2-empty-user/tasks", headers=auth_headers("us2-empty-user"))
    assert response.status_code == 200
    assert response.json() == []


def test_scenario_3_single_task_details_and_not_found(client: TestClient) -> None:
    headers = auth_headers("us2-user")
    created = client.post(
        "/api/us2-user/tasks", json={"title": "Findable"}, headers=headers
    ).json()

    found = client.get(f"/api/us2-user/tasks/{created['id']}", headers=headers)
    assert found.status_code == 200
    assert found.json()["title"] == "Findable"

    not_found = client.get("/api/us2-user/tasks/99999999", headers=headers)
    assert not_found.status_code == 404
