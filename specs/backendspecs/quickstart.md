# Quickstart: Backend (Todo Task Management REST API)

## Prerequisites

- Python 3.12+
- `uv` (or `pip`) for dependency management
- A reachable PostgreSQL connection string (Neon Serverless Postgres in
  production/dev; a local/test Postgres for running tests)
- The same `BETTER_AUTH_SECRET` value configured on the Frontend/Database &
  Authentication feature, so tokens issued there verify here

## Environment variables

Create `backend/.env` (never commit this file):

```env
DATABASE_URL=postgresql://<user>:<password>@<neon-host>/<db>?sslmode=require
BETTER_AUTH_SECRET=<shared secret — same value the frontend/auth service uses>
```

`BETTER_AUTH_SECRET` MUST be identical to the value configured on the
frontend (Constitution IV) — Better Auth signs tokens with this value; this
backend's JWT verification middleware verifies with the same value.

## Install & run

```bash
cd backend
uv sync                    # or: pip install -e .
uv run alembic upgrade head   # apply the tasks table migration
uv run uvicorn app.main:app --reload --port 8000
```

The API serves at `http://localhost:8000`.

## Running tests

```bash
cd backend
uv run pytest tests/unit          # fast, no real database
uv run pytest tests/contract       # requires TEST_DATABASE_URL (real Postgres)
uv run pytest tests/integration    # one test per user story in spec.md
```

## Verifying the golden path manually

With the server running and a valid JWT for a test user (`<token>`) and
that user's ID (`<user_id>`):

1. Create a task with a title only:
   ```bash
   curl -X POST http://localhost:8000/api/<user_id>/tasks \
     -H "Authorization: Bearer <token>" -H "Content-Type: application/json" \
     -d '{"title": "Buy groceries"}'
   ```
   → confirm the response is `201` with `completed: false` (US1).
2. List tasks for that user:
   ```bash
   curl http://localhost:8000/api/<user_id>/tasks \
     -H "Authorization: Bearer <token>"
   ```
   → confirm the task created in step 1 is present (US2).
3. Toggle its completion:
   ```bash
   curl -X PATCH http://localhost:8000/api/<user_id>/tasks/<id>/complete \
     -H "Authorization: Bearer <token>"
   ```
   → confirm `completed: true` in the response, then repeat to confirm it
   reverts to `false` (US4).
4. Update its title:
   ```bash
   curl -X PUT http://localhost:8000/api/<user_id>/tasks/<id> \
     -H "Authorization: Bearer <token>" -H "Content-Type: application/json" \
     -d '{"title": "Buy groceries and fruit"}'
   ```
   → confirm the list (step 2) now reflects the new title (US5).
5. Delete it:
   ```bash
   curl -X DELETE http://localhost:8000/api/<user_id>/tasks/<id> \
     -H "Authorization: Bearer <token>"
   ```
   → confirm `204`, and that a subsequent `GET` on that ID returns `404`
   (US6).
6. Repeat step 2 with no `Authorization` header → confirm `401` (US3).
7. Repeat step 2 with a valid token for a *different* user's ID in the path
   → confirm `404`, not the other user's tasks (US3).
