---
id: 3
title: Rename backend specs folder
stage: misc
date: 2026-08-04
surface: agent
model: claude-sonnet-5
feature: 002-todo-backend
branch: 002-todo-backend
user: Alishba Asif
command: none
labels: [backend, housekeeping, phase-2]
links:
  spec: specs/backendspecs/spec.md
  ticket: null
  adr: null
  pr: null
files:
 - specs/backendspecs/ (renamed from specs/002-todo-backend/)
 - specs/backendspecs/plan.md
tests:
 - none (housekeeping-only stage; no code produced)
---

## Prompt

change the name of the specs folder of backend from "002-todo-backend" to

[Message was truncated by the user; clarified via follow-up as "backendspecs" — matching the frontend feature's `specs/frontendspecs/` naming convention.]

## Response snapshot

Asked the user to confirm the target name since the message was cut off;
user selected "backendspecs" to mirror the frontend's `specs/frontendspecs/`
pattern. Confirmed `specs/002-todo-backend/` was untracked in git (no prior
commit), so performed a plain filesystem move rather than `git mv`. Updated
the three internal path references inside `plan.md` (Input line,
Constitution Check Principle I row, Documentation tree) from
`specs/002-todo-backend/` to `specs/backendspecs/`, and added a "Note"
directly under the plan's header — mirroring the frontend plan.md's own
rename note — explaining that the git branch (`002-todo-backend`) and the
`history/prompts/002-todo-backend/` folder are intentionally unaffected and
keep their original names. Verified no other stray path references
remained in the renamed folder's files.

## Outcome

- ✅ Impact: Backend spec/plan folder now matches the frontend's established naming convention (`specs/backendspecs/`).
- 🧪 Tests: none (housekeeping-only stage)
- 📁 Files: specs/backendspecs/ (renamed), specs/backendspecs/plan.md (path references updated)
- 🔁 Next prompts: /sp.tasks for the backend feature
- 🧠 Reflection: Keeping branch names and history/prompts/ folder names stable while only renaming the specs/ folder (same pattern as frontend) avoids breaking git history and PHR routing while still giving a human-friendly specs directory name.

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): n/a
- Prompt variant (if applicable): n/a
- Next experiment (smallest change to try): n/a
