"""Integration test covering spec.md US3 Scenarios 2-3: a valid credential for
User A cannot access data addressed under a different user's identifier, and
cannot retrieve/modify User B's tasks — both refused as 404 (FR-003, FR-011)."""

from fastapi.testclient import TestClient

from tests.conftest import auth_headers


def test_scenario_2_requesting_under_another_users_identifier_is_refused(
    client: TestClient,
) -> None:
    response = client.get("/api/user-b/tasks", headers=auth_headers("user-a"))
    assert response.status_code == 404


def test_scenario_3_cannot_get_update_toggle_or_delete_another_users_task(
    client: TestClient,
) -> None:
    task = client.post(
        "/api/user-b/tasks", json={"title": "User B's task"}, headers=auth_headers("user-b")
    ).json()
    task_id = task["id"]

    attacker_headers = auth_headers("user-a")
    assert client.get(f"/api/user-b/tasks/{task_id}", headers=attacker_headers).status_code == 404
    assert (
        client.put(
            f"/api/user-b/tasks/{task_id}", json={"title": "hijacked"}, headers=attacker_headers
        ).status_code
        == 404
    )
    assert (
        client.patch(
            f"/api/user-b/tasks/{task_id}/complete", headers=attacker_headers
        ).status_code
        == 404
    )
    assert (
        client.delete(f"/api/user-b/tasks/{task_id}", headers=attacker_headers).status_code == 404
    )

    # Confirm User B's task is untouched by the refused attempts.
    still_there = client.get(
        f"/api/user-b/tasks/{task_id}", headers=auth_headers("user-b")
    )
    assert still_there.status_code == 200
    assert still_there.json()["title"] == "User B's task"
    assert still_there.json()["completed"] is False
