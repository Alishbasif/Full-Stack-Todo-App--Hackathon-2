export const MIN_PASSWORD_LENGTH = 8; // must match lib/auth.ts's minPasswordLength (FR-003)

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface SignUpFormErrors {
  email?: string;
  password?: string;
}

/**
 * Client-side validation mirroring data-model.md's validation rules
 * (FR-003, FR-004, US1 Scenario 4). Enforced before any API call so
 * feedback is instant for the common validation-failure case.
 */
export function validateSignUpForm(email: string, password: string): SignUpFormErrors {
  const errors: SignUpFormErrors = {};
  const trimmedEmail = email.trim();

  if (trimmedEmail.length === 0) {
    errors.email = "Email is required.";
  } else if (!EMAIL_PATTERN.test(trimmedEmail)) {
    errors.email = "Enter a valid email address.";
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    errors.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  }

  return errors;
}

export interface SignInFormErrors {
  email?: string;
  password?: string;
}

export function validateSignInForm(email: string, password: string): SignInFormErrors {
  const errors: SignInFormErrors = {};
  const trimmedEmail = email.trim();

  if (trimmedEmail.length === 0) {
    errors.email = "Email is required.";
  } else if (!EMAIL_PATTERN.test(trimmedEmail)) {
    errors.email = "Enter a valid email address.";
  }

  if (password.length === 0) {
    errors.password = "Password is required.";
  }

  return errors;
}

/**
 * A signed-up account requires a non-empty `name` on Better Auth's own
 * sign-up endpoint (confirmed from the installed better-auth source — see
 * specs/Database&Auth/contracts/auth-endpoints.md). The UI's name field
 * stays optional for the user (FR-001, spec.md Assumptions); when left
 * blank, a fallback is synthesized from the email's local-part so the
 * request always satisfies Better Auth's requirement without asking the
 * user to type anything.
 */
export function nameOrFallback(name: string, email: string): string {
  const trimmed = name.trim();
  if (trimmed.length > 0) return trimmed;
  return email.trim().split("@")[0] || "New user";
}
