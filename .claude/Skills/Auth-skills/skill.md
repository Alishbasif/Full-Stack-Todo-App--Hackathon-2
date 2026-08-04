---
name: auth-skill
description: Secure authentication implementation for Signup, Sign In, Password Hashing, JWT Tokens, and Better Auth integration. Use whenever building or modifying authentication and authorization features.
---

# Auth Skill

## Objective

Implement secure, scalable, and production-ready authentication using modern security best practices.

This skill applies to:
- User Signup
- User Sign In
- Password Hashing
- JWT Authentication
- Better Auth Integration
- Session Management
- Authorization
- Protected Routes

---

# Authentication Flow

## Signup

Implement a secure registration flow that:

- Validates all user input.
- Verifies email uniqueness.
- Enforces password strength requirements.
- Hashes passwords before storage.
- Creates the user record securely.
- Returns appropriate success or error responses.
- Never stores plaintext passwords.

Checklist:

- Validate email format.
- Validate password strength.
- Confirm password (if applicable).
- Hash password before saving.
- Handle duplicate email errors.
- Return safe error messages.

---

## Sign In

Implement login functionality that:

- Validates credentials.
- Retrieves user securely.
- Verifies hashed password.
- Generates authentication tokens or sessions.
- Returns authenticated user information.
- Prevents user enumeration.

Checklist:

- Validate request body.
- Verify email exists.
- Compare hashed password securely.
- Generate JWT or Better Auth session.
- Return authentication token/session.
- Handle invalid credentials safely.

---

# Password Hashing

Always hash passwords using modern algorithms.

Preferred algorithms:

- Argon2 (Recommended)
- bcrypt

Requirements:

- Never store plaintext passwords.
- Never compare plaintext passwords directly.
- Use secure salt generation.
- Use recommended hashing parameters.

Never:

- MD5
- SHA1
- SHA256 alone
- Custom hashing algorithms

---

# JWT Authentication

When JWT authentication is used:

Generate tokens that include:

- User ID
- Email (optional)
- Role (if applicable)
- Expiration
- Issued At

Requirements:

- Sign using a secure secret.
- Load secrets from environment variables.
- Validate every incoming JWT.
- Reject expired tokens.
- Reject malformed tokens.
- Support refresh tokens when required.

Never:

- Hardcode JWT secrets.
- Expose JWT payloads unnecessarily.
- Accept unsigned tokens.

---

# Better Auth Integration

When Better Auth is available:

- Follow Better Auth conventions.
- Configure providers correctly.
- Secure session handling.
- Implement sign in and sign out.
- Protect authenticated routes.
- Manage sessions securely.
- Handle authentication callbacks correctly.
- Keep configuration modular.

---

# Authorization

Support authorization using:

- Roles
- Permissions
- Ownership checks

Requirements:

- Protect private endpoints.
- Verify user permissions.
- Apply least-privilege access.
- Deny unauthorized requests.

---

# Session Management

If sessions are used:

- Use secure cookies.
- Enable HttpOnly cookies.
- Enable Secure flag.
- Configure SameSite appropriately.
- Rotate sessions when necessary.
- Destroy sessions during logout.

---

# Input Validation

Always validate:

- Email
- Password
- Username
- Request body
- Authentication headers
- JWT payload

Reject:

- Missing fields
- Invalid email formats
- Weak passwords
- Invalid tokens
- Expired tokens

---

# Error Handling

Return consistent authentication errors.

Examples:

- Invalid credentials
- Unauthorized
- Forbidden
- User already exists
- Token expired
- Invalid token

Never leak:

- Password hashes
- Internal errors
- Database information
- Authentication secrets

---

# Security Best Practices

Always:

- Hash passwords.
- Use HTTPS.
- Store secrets in environment variables.
- Validate every request.
- Sanitize user input.
- Rate limit login endpoints.
- Prevent brute-force attacks.
- Prevent user enumeration.
- Log authentication events safely.

Never:

- Store plaintext passwords.
- Log passwords.
- Log tokens.
- Hardcode secrets.
- Expose internal authentication details.

---

# Code Quality

Authentication code should be:

- Modular
- Reusable
- Well documented
- Testable
- Easy to maintain

Separate:

- Routes
- Services
- Authentication logic
- Authorization logic
- Validation
- Database operations

---

# Testing Checklist

Verify:

- Successful signup
- Duplicate signup
- Successful login
- Invalid login
- Password hashing
- JWT generation
- JWT validation
- Protected routes
- Authorization rules
- Logout functionality
- Better Auth integration
- Session expiration

---

# Deliverables

Every authentication implementation should include:

- Secure signup flow
- Secure sign in flow
- Password hashing
- JWT or Better Auth integration
- Protected routes
- Authorization checks
- Input validation
- Error handling
- Environment-based configuration
- Security best practices
- Clean, maintainable code