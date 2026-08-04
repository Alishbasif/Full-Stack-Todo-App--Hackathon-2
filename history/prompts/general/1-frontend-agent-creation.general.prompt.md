---
id: 1
title: Frontend Agent Creation
stage: general
date: 2026-08-03
surface: agent
model: claude-sonnet-5
feature: none
branch: master
user: Alishba Asif
command: none
labels: ["sub-agent", "frontend", "nextjs", "app-router"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - .claude/agents/frontend-agent.md
tests:
 - none
---

## Prompt

I want to create a sub-agent focused on the topic: ""Frontend Agent - generate responsive UI with Next.JS app Router"". Generate an agent prompt based on the reference agent-creation prompt I provided.    

Ensure that the agent explicitly uses the following skills: "Build, pages, component, layout, styling" Skill. Here is reference prompt: """---   
name: code-reviewer
description: Expert code review specialist. Proactively reviews code for quality, security, and maintainability. Use immediately after writing or modifying code.
tools: Read, Grep, Glob, Bash
model: inherit
---

You are a senior code reviewer ensuring high standards of code quality and security.

When invoked:
1. Run git diff to see recent changes
2. Focus on modified files
3. Begin review immediately

Review checklist:
- Code is simple and readable
- Functions and variables are well-named
- No duplicated code
- Proper error handling
- No exposed secrets or API keys
- Input validation implemented
- Good test coverage
- Performance considerations addressed

Provide feedback organized by priority:
- Critical issues (must fix)
- Warnings (should fix)
- Suggestions (consider improving)

Include specific examples of how to fix issues. """

## Response snapshot

Reviewed the existing `auth-agent.md` and `fastapi-backend-agent.md` sub-agents to match this project's established sub-agent conventions (frontmatter shape, mandatory skill invocation pattern, "When invoked" steps, priority-ordered review checklists). Read `.claude/Skills/Frontend-skills/skill.md` to ground the agent's responsibilities in the skill's actual sections (Layout Building, Page Development, Component Development, Styling, Responsive Design, Accessibility, State Management, API Integration, Performance).

Created `.claude/agents/frontend-agent.md`:
- `name: frontend-agent`, `tools: Read, Grep, Glob, Bash, Edit, Write`, `model: inherit`
- Mandates invoking the **Frontend-skills** skill at the start of every task, explicitly organized around the user-specified areas: Build, Pages, Components, Layout, Styling
- "When invoked" flow: git diff → analyze frontend architecture → invoke Frontend-skills → identify affected files → begin work
- Per-area checklists (Build, Page, Component, Layout, Styling) plus Accessibility & UX and Performance checklists, all derived from the skill's actual guidance
- Priority-ordered review feedback format (Critical / Accessibility & Responsiveness Risks / Structure Issues / Warnings / Suggestions), matching the reference `code-reviewer` prompt's style

## Outcome

- ✅ Impact: New `frontend-agent` sub-agent available for Next.js App Router UI work (pages, layouts, components, styling), consistent with existing `auth-agent` and `fastapi-backend-agent` conventions.
- 🧪 Tests: none (agent definition file only; no code executed)
- 📁 Files: `.claude/agents/frontend-agent.md` (created)
- 🔁 Next prompts: Invoke the frontend-agent on an actual UI task to validate the checklist coverage in practice.
- 🧠 Reflection: Followed the two existing sub-agent files as the style precedent rather than the single reference `code-reviewer` prompt alone, since the project already has an established local convention (mandatory skill invocation line, per-domain checklists) that the reference prompt doesn't include.

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): none run
- Prompt variant (if applicable): n/a
- Next experiment (smallest change to try): n/a
