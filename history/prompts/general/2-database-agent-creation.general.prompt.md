---
id: 2
title: Database Agent Creation
stage: general
date: 2026-08-03
surface: agent
model: claude-sonnet-5
feature: none
branch: master
user: Alishba Asif
command: none
labels: ["sub-agent", "database", "postgresql", "neon", "migrations"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - .claude/agents/database-agent.md
tests:
 - none
---

## Prompt

I want to create a sub-agent focused on the topic: ""Database Agent Manage Neon Serverless postgress operations"". Generate an agent prompt based on the reference agent-creation prompt I provided.  

Ensure that the agent explicitly uses the following skills: "create tables, migrations and schema design" Skill. Here is reference prompt: """---  
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

Read `.claude/Skills/Database-skill/skill.md` to ground the agent's responsibilities in the skill's actual sections (Schema Design, Table Creation, Relationships, Constraints, Migrations, Indexing, Query Design, Transactions, Data Integrity, Neon Serverless Best Practices, Security, Naming Conventions).

Created `.claude/agents/database-agent.md`, following the same local convention already established by `auth-agent.md`, `fastapi-backend-agent.md`, and `frontend-agent.md`:
- `name: database-agent`, `tools: Read, Grep, Glob, Bash, Edit, Write`, `model: inherit`
- Mandates invoking the **Database-skill** skill at the start of every task, explicitly organized around the user-specified areas: table creation, migrations, schema design
- "When invoked" flow: git diff → analyze existing database architecture → invoke Database-skill → identify affected files → begin work
- Per-area checklists (Schema Design, Table Creation, Migration, Relationships & Data Integrity, Query & Performance, Neon Serverless & Security)
- Priority-ordered review feedback format (Critical / Data Integrity & Security Risks / Migration Safety Issues / Warnings / Suggestions), matching the reference `code-reviewer` prompt's style

## Outcome

- ✅ Impact: New `database-agent` sub-agent available for Neon Serverless PostgreSQL work (schema design, table creation, migrations), consistent with existing sub-agent conventions in this repo.
- 🧪 Tests: none (agent definition file only; no code executed)
- 📁 Files: `.claude/agents/database-agent.md` (created)
- 🔁 Next prompts: Invoke database-agent on an actual schema/migration task to validate checklist coverage in practice.
- 🧠 Reflection: Continued the established local sub-agent pattern (mandatory skill invocation line, per-domain checklists, priority-ordered review format) rather than reproducing only the bare-bones reference `code-reviewer` structure, for consistency with `auth-agent`, `fastapi-backend-agent`, and `frontend-agent`.

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): none run
- Prompt variant (if applicable): n/a
- Next experiment (smallest change to try): n/a
