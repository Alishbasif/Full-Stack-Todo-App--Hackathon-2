"""Integration test covering spec.md US4 Acceptance Scenarios 1-3 (Toggle Completion)."""

from fastapi.testclient import TestClient

from tests.conftest import auth_headers


def test_scenario_1_incomplete_task_toggled_to_complete(client: TestClient) -> None:
    headers = auth_headers("us4-user")
    task = client.post("/api/us4-user/tasks", json={"title": "Toggle"}, headers=headers).json()

    response = client.patch(f"/api/us4-user/tasks/{task['id']}/complete", headers=headers)
    assert response.status_code == 200
    assert response.json()["completed"] is True

    refetched = client.get(f"/api/us4-user/tasks/{task['id']}", headers=headers)
    assert refetched.json()["completed"] is True


def test_scenario_2_complete_task_toggled_back_to_incomplete(client: TestClient) -> None:
    headers = auth_headers("us4-user")
    task = client.post(
        "/api/us4-user/tasks", json={"title": "Toggle twice"}, headers=headers
    ).json()
    client.patch(f"/api/us4-user/tasks/{task['id']}/complete", headers=headers)

    response = client.patch(f"/api/us4-user/tasks/{task['id']}/complete", headers=headers)
    assert response.status_code == 200
    assert response.json()["completed"] is False


def test_scenario_3_toggling_task_not_owned_returns_404_no_change(client: TestClient) -> None:
    owner_headers = auth_headers("us4-owner")
    task = client.post(
        "/api/us4-owner/tasks", json={"title": "Not yours"}, headers=owner_headers
    ).json()

    other_headers = auth_headers("us4-other")
    response = client.patch(
        f"/api/us4-owner/tasks/{task['id']}/complete", headers=other_headers
    )
    assert response.status_code == 404

    unchanged = client.get(f"/api/us4-owner/tasks/{task['id']}", headers=owner_headers)
    assert unchanged.json()["completed"] is False
