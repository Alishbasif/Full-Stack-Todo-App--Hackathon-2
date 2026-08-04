# Feature Specification: Todo Task Management REST API

**Feature Branch**: `002-todo-backend`
**Created**: 2026-08-04
**Status**: Draft
**Input**: User description: "Backend part of Phase II — a FastAPI REST API implementing the 5 Basic Level todo features (Add, Delete, Update, View, Mark Complete), enforcing per-user data isolation via Better Auth JWTs, and persisting to Neon PostgreSQL via SQLModel, per the Phase II Backend requirements read from Hackathon_II_Todo_Spec_Driven_Development.md."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Create a Task (Priority: P1)

As a client application acting on behalf of an authenticated user, I can
submit a request to create a new task with a title and an optional
description, so that the user's work item is captured and stored durably.

**Why this priority**: Without the ability to create tasks, the API has no
data to list, update, complete, or delete — this is the entry point every
other capability depends on.

**Independent Test**: Can be tested by submitting a task-creation request
with a valid title on behalf of an authenticated user and confirming the
task is retrievable in a subsequent request, with an incomplete status and
a created timestamp.

**Acceptance Scenarios**:

1. **Given** an authenticated user with no existing tasks, **When** the
   client submits a task-creation request with a title between 1 and 200
   characters, **Then** the task is stored, marked incomplete, and returned
   with a unique identifier and a created timestamp.
2. **Given** an authenticated user, **When** the client submits a
   task-creation request that also includes a description of up to 1000
   characters, **Then** the description is stored and returned unchanged.
3. **Given** an authenticated user, **When** the client submits a
   task-creation request with an empty or missing title, **Then** the
   request is rejected with a clear validation error and no task is
   created.

---

### User Story 2 - Retrieve Tasks (List and Single) (Priority: P1)

As a client application acting on behalf of an authenticated user, I can
request the full list of that user's tasks or the details of one specific
task, so that the user can see what they need to do.

**Why this priority**: Retrieval is the primary reason any client calls
this API and is a prerequisite for every other operation to be meaningful
— a client cannot update, complete, or delete what it cannot first see.

**Independent Test**: Can be tested by creating one or more tasks for an
authenticated user, requesting the full task list, and confirming every
created task is present; then requesting a single task by its identifier
and confirming its full details are returned.

**Acceptance Scenarios**:

1. **Given** an authenticated user with existing tasks, **When** the client
   requests that user's task list, **Then** every task belonging to that
   user is returned with its title, description, completion status,
   created timestamp, and last-updated timestamp.
2. **Given** an authenticated user with no tasks yet, **When** the client
   requests that user's task list, **Then** an empty list is returned
   rather than an error.
3. **Given** an authenticated user with a known task identifier, **When**
   the client requests that single task's details, **Then** the full task
   details are returned; **if** the identifier does not correspond to any
   task owned by that user, **Then** a clear "not found" response is
   returned instead.

---

### User Story 3 - Enforce Per-User Data Isolation and Authenticated Access (Priority: P1)

As a client application, every request I make to this API is authenticated
and scoped to the correct user, so that tasks are never created, viewed,
modified, or deleted across user boundaries — regardless of what identifier
a request references.

**Why this priority**: Data isolation is the flagship requirement of this
phase's API surface. Without it, every other capability (create, view,
update, complete, delete) is unsafe to offer at all, since any client could
read or tamper with another user's data.

**Independent Test**: Can be tested by attempting to call every operation
(list, create, get, update, delete, toggle) without a credential and
confirming each is rejected; then, using a valid credential for User A,
attempting to access or act on a task belonging to User B (or addressed
under User B's identifier) and confirming the request is refused or treated
as not found, never as successful.

**Acceptance Scenarios**:

1. **Given** no credential or an invalid/expired credential is presented,
   **When** any task operation is requested, **Then** the request is
   rejected before any task data is read or modified, and no task data is
   returned.
2. **Given** a valid credential for User A, **When** the client requests
   tasks addressed under a different user's identifier, **Then** the
   request is refused and no data belonging to that other user is
   returned.
3. **Given** a valid credential for User A, **When** the client attempts to
   retrieve, update, complete, or delete a task that belongs to User B,
   **Then** the operation is treated as if the task does not exist for
   User A and no change is made to User B's data.

---

### User Story 4 - Toggle Task Completion (Priority: P2)

As a client application acting on behalf of an authenticated user, I can
request that a specific task's completion status be flipped, so that the
user can track their progress.

**Why this priority**: Completion tracking is core to the value of a todo
API beyond static storage, but it depends on creation and retrieval already
working reliably.

**Independent Test**: Can be tested by creating a task (defaulting to
incomplete), requesting its completion status be toggled, and confirming a
subsequent retrieval reflects the new status; then toggling it again and
confirming it reverts.

**Acceptance Scenarios**:

1. **Given** an existing incomplete task owned by the authenticated user,
   **When** the client requests its completion be toggled, **Then** the
   task's status becomes complete and this is reflected in the very next
   retrieval.
2. **Given** an existing complete task owned by the authenticated user,
   **When** the client requests its completion be toggled again, **Then**
   the task's status reverts to incomplete.
3. **Given** a task identifier that does not belong to the authenticated
   user, **When** the client requests its completion be toggled, **Then**
   the request is refused with a clear "not found" response and no status
   change occurs.

---

### User Story 5 - Update Task Details (Priority: P2)

As a client application acting on behalf of an authenticated user, I can
request that an existing task's title and/or description be changed, so
that the user can correct mistakes or refine what they need to do.

**Why this priority**: Updating is necessary for a usable API but is
exercised less frequently than creating and retrieving tasks, and it
depends on both already being reliable.

**Independent Test**: Can be tested by creating a task, submitting an
update request with a new title and/or description, and confirming a
subsequent retrieval reflects the change along with an updated timestamp.

**Acceptance Scenarios**:

1. **Given** an existing task owned by the authenticated user, **When** the
   client submits an update with a new valid title (1–200 characters),
   **Then** the stored task reflects the new title and an updated
   timestamp newer than the created timestamp.
2. **Given** an existing task owned by the authenticated user, **When** the
   client submits an update with a new description (up to 1000
   characters), **Then** the stored task reflects the new description.
3. **Given** an existing task owned by the authenticated user, **When** the
   client submits an update with an empty title, **Then** the request is
   rejected with a clear validation error and the stored task is
   unchanged.

---

### User Story 6 - Delete a Task (Priority: P3)

As a client application acting on behalf of an authenticated user, I can
request that a specific task be permanently removed, so that the user's
task list stays relevant.

**Why this priority**: Deletion is necessary for long-term usability but is
the least frequently exercised of the six operations and has no dependency
from the other stories.

**Independent Test**: Can be tested by creating a task, requesting its
deletion, and confirming a subsequent retrieval of the list no longer
includes it and a direct retrieval of that task returns "not found."

**Acceptance Scenarios**:

1. **Given** an existing task owned by the authenticated user, **When** the
   client requests its deletion, **Then** the task is permanently removed
   and no longer appears in that user's task list.
2. **Given** a task identifier that does not exist or does not belong to
   the authenticated user, **When** the client requests its deletion,
   **Then** the request is refused with a clear "not found" response and
   no data is removed.

---

### Edge Cases

- What happens when a request is missing a credential, or presents an
  invalid or expired one? → The request MUST be rejected before any task
  data is read or modified, with a clear, non-leaking authentication error
  (see US3).
- What happens when a request's target user identifier does not match the
  identity established by the credential? → The request MUST be refused;
  no data belonging to the mismatched identifier MUST be returned or
  altered (see US3).
- What happens when a client acts on a task identifier that does not exist
  at all, versus one that exists but belongs to another user? → Both cases
  MUST return the same clear "not found" response, so a caller cannot
  distinguish "doesn't exist" from "not yours."
- What happens when a title or description is submitted at exactly the
  maximum allowed length (200 characters for title, 1000 for description)?
  → The operation MUST succeed; only lengths beyond the maximum, or an
  empty title, MUST be rejected.
- What happens when two sessions modify the same task at nearly the same
  time (e.g., one toggles completion while another updates the title)? →
  Both operations MUST be applied safely without corrupting the stored
  task or losing track of which fields changed; the final state MUST
  reflect a consistent, well-defined outcome rather than partial or mixed
  data.
- What happens when a request body is malformed or contains fields of the
  wrong type (e.g., a non-boolean completion value, a title that isn't
  text)? → The request MUST be rejected with a clear validation error and
  MUST NOT be partially applied.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The API MUST require a valid credential on every task
  operation (list, create, get, update, delete, toggle completion);
  requests without one MUST be rejected before any task data is accessed.
- **FR-002**: The API MUST derive the caller's identity from the presented
  credential and MUST scope every task operation exclusively to that
  identity's own data, regardless of any user identifier referenced in the
  request.
- **FR-003**: The API MUST refuse any request whose referenced user
  identifier does not match the credential's identity, without revealing
  whether data exists for that other identifier.
- **FR-004**: The API MUST allow retrieval of the full list of tasks
  belonging to the authenticated user, including title, description,
  completion status, created timestamp, and last-updated timestamp for
  each task.
- **FR-005**: The API MUST allow retrieval of a single task's full details
  by identifier, scoped to the authenticated user.
- **FR-006**: The API MUST allow creation of a new task with a required
  title (1–200 characters) and an optional description (up to 1000
  characters), defaulting completion status to incomplete and recording a
  created timestamp.
- **FR-007**: The API MUST validate title and description length on both
  creation and update, rejecting an empty or over-length title and an
  over-length description with a clear, field-specific validation error.
- **FR-008**: The API MUST allow updating an existing task's title and/or
  description, scoped to the authenticated user, and MUST record an
  updated timestamp whenever a change is applied.
- **FR-009**: The API MUST allow toggling a task's completion status
  between complete and incomplete, scoped to the authenticated user.
- **FR-010**: The API MUST allow permanent deletion of an existing task,
  scoped to the authenticated user.
- **FR-011**: The API MUST return a clear, distinguishable "not found"
  response when an operation targets a task that does not exist or does
  not belong to the authenticated user, without leaking whether the task
  exists for someone else.
- **FR-012**: The API MUST return clear, structured error responses for
  authentication failures, validation failures, and not-found conditions,
  without exposing internal implementation details, stack traces, or raw
  storage errors.
- **FR-013**: The API MUST ensure that any create, update, delete, or
  completion-toggle operation is immediately visible in the very next
  retrieval of that task or the task list (read-after-write consistency).
- **FR-014**: The API's request and response contracts MUST remain stable
  and consistent for any authenticated client type — the current web
  frontend as well as future non-browser clients — without requiring
  client-specific behavior.

### Key Entities

- **Task**: A single todo item owned by exactly one user. Attributes:
  title (required, 1–200 characters), description (optional, up to 1000
  characters), completion status (complete/incomplete), created timestamp,
  last-updated timestamp.
- **User**: The identity on whose behalf a client makes requests. Users
  are established and authenticated by a separate identity system; this
  specification references a user only by an identifier and does not
  define how identities are created or verified.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of requests without a valid credential are rejected
  before any task data is returned or modified.
- **SC-002**: 0% of requests can access, modify, or delete another user's
  tasks, regardless of how the request addresses that data.
- **SC-003**: A client can create a task and see it reflected in a
  subsequent retrieval of the task list in under 1 second.
- **SC-004**: 100% of validation failures (invalid title/description
  length, malformed input) produce a clear, field-specific error rather
  than a silent failure or a generic server error.
- **SC-005**: 100% of operations targeting a nonexistent or not-owned task
  produce the same clear "not found" outcome, indistinguishable from each
  other.
- **SC-006**: The API supports at least two independent client types (the
  Phase II web frontend and a future automated client) against the same
  contract without requiring a breaking change.

## Assumptions

- Identity and credential issuance (sign-up, sign-in, credential renewal)
  are covered by the separate Database & Authentication specification, not
  this one; this spec assumes a valid credential can be presented and
  verified.
- This spec covers only the API's own request/response behavior and
  contracts — schema design, migrations, and storage indexing are covered
  by the separate Database & Authentication specification.
- Each user has exactly one personal task list for this phase; no shared
  or team task lists are in scope.
- A future AI chatbot client is expected to consume this same API in a
  later phase; the contract defined here MUST NOT require breaking changes
  to accommodate that future consumer.


