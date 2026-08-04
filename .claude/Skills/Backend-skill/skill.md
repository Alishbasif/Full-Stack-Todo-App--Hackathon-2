---
name: backend-skill
description: Build production-ready FastAPI backend APIs by generating routes, handling requests and responses, implementing business logic, and connecting securely to databases. Use whenever creating or modifying backend functionality.
---

# Backend Skill

## Objective

Design and implement scalable, secure, and maintainable FastAPI backend services that expose RESTful APIs, validate requests, process business logic, and interact with the database efficiently.

This skill applies to:

- FastAPI Route Generation
- Request Handling
- Response Handling
- Database Connectivity
- Business Logic
- CRUD Operations
- Dependency Injection
- Error Handling

---

# Route Generation

Create RESTful API endpoints using FastAPI.

Use:

- APIRouter
- Proper route prefixes
- Resource-based URLs
- Dependency Injection
- Response Models

Supported methods:

- GET
- POST
- PUT
- PATCH
- DELETE

Checklist:

- Follow REST conventions.
- Use descriptive endpoint names.
- Return appropriate HTTP status codes.
- Keep routes lightweight.
- Document endpoints automatically.

---

# Request Handling

Validate every incoming request using Pydantic.

Handle:

- Request Body
- Query Parameters
- Path Parameters
- Headers
- Authentication Information

Always:

- Validate required fields.
- Reject invalid requests.
- Sanitize user input.
- Return meaningful validation errors.

Never:

- Trust client input.
- Skip validation.

---

# Response Handling

Every endpoint should return consistent responses.

Include:

- Status
- Message
- Data
- Metadata (when applicable)

Requirements:

- Use response models.
- Return proper HTTP status codes.
- Hide internal implementation details.
- Exclude sensitive information.

Handle responses for:

- Success
- Validation Errors
- Authentication Errors
- Authorization Errors
- Resource Not Found
- Server Errors

---

# Database Connectivity

Connect backend services securely to PostgreSQL or Neon Serverless PostgreSQL.

Best practices:

- Use dependency injection for database sessions.
- Keep connections short-lived.
- Close sessions properly.
- Handle transactions safely.
- Use connection pooling where appropriate.

Never:

- Hardcode credentials.
- Open unnecessary connections.
- Leave sessions open.

---

# CRUD Operations

Implement complete CRUD functionality.

Support:

- Create
- Read
- Update
- Delete

Requirements:

- Validate inputs.
- Handle missing resources.
- Prevent duplicate records.
- Return meaningful responses.
- Use transactions when necessary.

---

# Business Logic

Separate business logic from route handlers.

Recommended structure:

- Routers
- Services
- Repositories
- Models
- Schemas
- Database Layer

Keep routes responsible only for:

- Receiving requests
- Calling services
- Returning responses

---

# Dependency Injection

Use FastAPI dependency injection for:

- Database sessions
- Authentication
- Authorization
- Configuration
- Shared services

Benefits:

- Reusability
- Testability
- Loose coupling

---

# Error Handling

Implement centralized exception handling.

Handle:

- Validation errors
- Authentication failures
- Authorization failures
- Database errors
- Resource not found
- Unexpected exceptions

Return:

- Proper HTTP status codes
- Consistent error format
- User-friendly messages

Never expose:

- Stack traces
- SQL errors
- Secrets
- Internal implementation details

---

# Security

Always:

- Validate inputs.
- Use parameterized database queries.
- Protect authenticated routes.
- Store secrets in environment variables.
- Prevent SQL injection.
- Handle authentication securely.
- Apply authorization checks.
- Sanitize user-generated content.

Never:

- Hardcode secrets.
- Expose database errors.
- Return sensitive data.
- Trust client input.

---

# Performance

Optimize backend performance by:

- Using async endpoints where appropriate.
- Minimizing database queries.
- Avoiding N+1 queries.
- Implementing pagination.
- Selecting only required fields.
- Using efficient indexes.
- Keeping responses lightweight.

---

# Project Structure

Organize backend code using a clean architecture.

Example structure:

```
app/
├── api/
│   ├── routes/
│   └── dependencies/
├── core/
├── db/
├── models/
├── schemas/
├── services/
├── repositories/
├── middleware/
├── utils/
└── main.py
```

Keep responsibilities separated and modules reusable.

---

# Code Quality

Backend code should be:

- Clean
- Readable
- Modular
- Testable
- Well documented
- Type-safe

Follow:

- SOLID principles
- DRY (Don't Repeat Yourself)
- KISS (Keep It Simple, Stupid)

---

# Testing Checklist

Verify:

- Routes return correct responses.
- Request validation works.
- Response models are correct.
- CRUD operations behave as expected.
- Database interactions succeed.
- Authentication is enforced.
- Authorization rules are respected.
- Errors are handled consistently.
- Edge cases are covered.

---

# Deliverables

Every backend implementation should include:

- RESTful FastAPI routes
- Request validation
- Response models
- CRUD operations
- Business logic layer
- Secure database connectivity
- Dependency injection
- Error handling
- Authentication-ready architecture
- Clean project structure
- Production-ready, maintainable code