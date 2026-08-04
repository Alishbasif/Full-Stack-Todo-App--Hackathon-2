"""Integration test covering spec.md US5 Acceptance Scenarios 1-3 (Update Task Details)."""

from fastapi.testclient import TestClient

from tests.conftest import auth_headers


def test_scenario_1_new_title_reflected_with_newer_updated_at(client: TestClient) -> None:
    headers = auth_headers("us5-user")
    task = client.post("/api/us5-user/tasks", json={"title": "Old"}, headers=headers).json()

    response = client.put(
        f"/api/us5-user/tasks/{task['id']}", json={"title": "New valid title"}, headers=headers
    )
    assert response.status_code == 200
    body = response.json()
    assert body["title"] == "New valid title"
    assert body["updated_at"] >= task["updated_at"]


def test_scenario_2_new_description_persisted(client: TestClient) -> None:
    headers = auth_headers("us5-user")
    task = client.post("/api/us5-user/tasks", json={"title": "Desc test"}, headers=headers).json()

    response = client.put(
        f"/api/us5-user/tasks/{task['id']}",
        json={"description": "updated description"},
        headers=headers,
    )
    assert response.status_code == 200
    assert response.json()["description"] == "updated description"


def test_scenario_3_empty_title_rejected_task_unchanged(client: TestClient) -> None:
    headers = auth_headers("us5-user")
    task = client.post(
        "/api/us5-user/tasks", json={"title": "Stays the same"}, headers=headers
    ).json()

    response = client.put(
        f"/api/us5-user/tasks/{task['id']}", json={"title": ""}, headers=headers
    )
    assert response.status_code == 400

    unchanged = client.get(f"/api/us5-user/tasks/{task['id']}", headers=headers)
    assert unchanged.json()["title"] == "Stays the same"
