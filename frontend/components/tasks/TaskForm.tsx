"use client";

import { useId, useState } from "react";
import type { FormEvent } from "react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { ApiError } from "@/lib/api";
import type { TaskFormErrors } from "@/types/task";
import {
  DESCRIPTION_MAX_LENGTH,
  TITLE_MAX_LENGTH,
  validateTaskForm,
} from "@/components/tasks/validate";

export interface TaskFormValues {
  title: string;
  description?: string;
}

export interface TaskFormProps {
  mode: "create" | "edit";
  initialValues?: TaskFormValues;
  onSubmit: (values: TaskFormValues) => Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
}

/**
 * Add/Edit task form (US1, US4). Validates client-side (data-model.md)
 * before ever calling the API, and surfaces success/failure feedback
 * (FR-010, SC-004).
 */
export function TaskForm({
  mode,
  initialValues,
  onSubmit,
  onCancel,
  submitLabel,
}: TaskFormProps) {
  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [description, setDescription] = useState(initialValues?.description ?? "");
  const [errors, setErrors] = useState<TaskFormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<
    { type: "success" | "error"; message: string } | null
  >(null);
  const formId = useId();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback(null);

    const validationErrors = validateTaskForm(title, description);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim() ? description.trim() : undefined,
      });
      setFeedback({
        type: "success",
        message: mode === "create" ? "Task added." : "Task updated.",
      });
      if (mode === "create") {
        setTitle("");
        setDescription("");
      }
    } catch (err) {
      if (err instanceof ApiError && err.kind === "validation") {
        setErrors({
          title: err.fieldErrors?.title,
          description: err.fieldErrors?.description,
        });
        setFeedback({ type: "error", message: err.message });
      } else if (err instanceof ApiError) {
        setFeedback({ type: "error", message: err.message });
      } else {
        setFeedback({
          type: "error",
          message: "Something went wrong. Please try again.",
        });
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-label={mode === "create" ? "Add a new task" : "Edit task"}
      className="flex flex-col gap-4"
      id={formId}
    >
      <Input
        label="Title"
        name="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        error={errors.title}
        hint={`${title.length}/${TITLE_MAX_LENGTH} characters`}
        placeholder="e.g. Buy groceries"
        maxLength={TITLE_MAX_LENGTH + 20}
        required
        autoFocus={mode === "edit"}
      />
      <Textarea
        label="Description (optional)"
        name="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        error={errors.description}
        hint={`${description.length}/${DESCRIPTION_MAX_LENGTH} characters`}
        placeholder="Add more detail…"
        maxLength={DESCRIPTION_MAX_LENGTH + 50}
      />

      {feedback && (
        <Alert variant={feedback.type === "success" ? "success" : "error"}>
          {feedback.message}
        </Alert>
      )}

      <div className="flex items-center justify-end gap-3 pt-1">
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel} disabled={submitting}>
            Cancel
          </Button>
        )}
        <Button type="submit" variant="primary" isLoading={submitting}>
          {submitLabel ?? (mode === "create" ? "Add task" : "Save changes")}
        </Button>
      </div>
    </form>
  );
}
