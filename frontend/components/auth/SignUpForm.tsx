"use client";

import { useId, useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { authClient } from "@/lib/auth-client";
import {
  nameOrFallback,
  validateSignUpForm,
  type SignUpFormErrors,
} from "@/components/auth/validate";

/**
 * Sign-up form (US1). Validates client-side before calling
 * `authClient.signUp.email` (contracts/auth-endpoints.md), and surfaces
 * duplicate-email (US1 Scenario 3) and validation (US1 Scenario 4) errors
 * from the response.
 */
export function SignUpForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<SignUpFormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const formId = useId();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    const validationErrors = validateSignUpForm(email, password);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await authClient.signUp.email({
        email: email.trim(),
        password,
        name: nameOrFallback(name, email),
      });

      if (error) {
        setFormError(error.message ?? "Could not create your account. Please try again.");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setFormError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-label="Create an account"
      className="flex flex-col gap-4"
      id={formId}
    >
      <Input
        label="Name (optional)"
        name="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="e.g. Alex Rivera"
        autoComplete="name"
      />
      <Input
        label="Email"
        name="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
        placeholder="you@example.com"
        autoComplete="email"
        required
      />
      <Input
        label="Password"
        name="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
        hint="At least 8 characters."
        autoComplete="new-password"
        required
      />

      {formError && <Alert variant="error">{formError}</Alert>}

      <Button type="submit" variant="primary" isLoading={submitting} className="mt-1">
        Create account
      </Button>
    </form>
  );
}
