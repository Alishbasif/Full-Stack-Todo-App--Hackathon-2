"""Integration test covering FR-013 (read-after-write consistency) and
spec.md's concurrent-modification edge case: two mutating operations applied
in sequence to the same task must both take effect safely, with a final
state that reflects both changes rather than one clobbering the other."""

from fastapi.testclient import TestClient

from tests.conftest import auth_headers


def test_create_is_immediately_visible_in_list_and_get(client: TestClient) -> None:
    headers = auth_headers("consistency-user")
    created = client.post(
        "/api/consistency-user/tasks", json={"title": "Read after write"}, headers=headers
    ).json()

    listing = client.get("/api/consistency-user/tasks", headers=headers)
    assert created["id"] in [t["id"] for t in listing.json()]

    detail = client.get(f"/api/consistency-user/tasks/{created['id']}", headers=headers)
    assert detail.status_code == 200
    assert detail.json()["title"] == "Read after write"


def test_toggle_then_update_both_take_effect_without_corrupting_task(
    client: TestClient,
) -> None:
    """Simulates two independent mutations 'racing' on the same task (one
    session toggles completion while another updates the title) — both must
    be reflected in a final, well-defined state (spec.md Edge Cases)."""
    headers = auth_headers("consistency-user")
    task = client.post(
        "/api/consistency-user/tasks", json={"title": "Original title"}, headers=headers
    ).json()

    toggle_response = client.patch(
        f"/api/consistency-user/tasks/{task['id']}/complete", headers=headers
    )
    update_response = client.put(
        f"/api/consistency-user/tasks/{task['id']}",
        json={"title": "Updated title"},
        headers=headers,
    )

    assert toggle_response.status_code == 200
    assert update_response.status_code == 200

    final = client.get(f"/api/consistency-user/tasks/{task['id']}", headers=headers).json()
    # Both mutations landed: completion flipped by the toggle, title changed
    # by the update — neither operation silently lost the other's write.
    assert final["completed"] is True
    assert final["title"] == "Updated title"


def test_delete_is_immediately_absent_from_subsequent_reads(client: TestClient) -> None:
    headers = auth_headers("consistency-user")
    task = client.post(
        "/api/consistency-user/tasks", json={"title": "Delete then read"}, headers=headers
    ).json()

    client.delete(f"/api/consistency-user/tasks/{task['id']}", headers=headers)

    listing = client.get("/api/consistency-user/tasks", headers=headers)
    assert task["id"] not in [t["id"] for t in listing.json()]
