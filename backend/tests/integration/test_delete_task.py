"""Integration test covering spec.md US6 Acceptance Scenarios 1-2 (Delete a Task)."""

from fastapi.testclient import TestClient

from tests.conftest import auth_headers


def test_scenario_1_deleted_task_removed_from_list_and_detail(client: TestClient) -> None:
    headers = auth_headers("us6-user")
    task = client.post("/api/us6-user/tasks", json={"title": "Delete me"}, headers=headers).json()

    response = client.delete(f"/api/us6-user/tasks/{task['id']}", headers=headers)
    assert response.status_code == 204

    listing = client.get("/api/us6-user/tasks", headers=headers)
    assert task["id"] not in [t["id"] for t in listing.json()]

    detail = client.get(f"/api/us6-user/tasks/{task['id']}", headers=headers)
    assert detail.status_code == 404


def test_scenario_2_deleting_nonexistent_or_not_owned_task_refused(client: TestClient) -> None:
    headers = auth_headers("us6-user")
    response = client.delete("/api/us6-user/tasks/999999999", headers=headers)
    assert response.status_code == 404
