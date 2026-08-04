import type { TaskFormErrors } from "@/types/task";

export const TITLE_MAX_LENGTH = 200;
export const DESCRIPTION_MAX_LENGTH = 1000;

/**
 * Client-side validation mirroring data-model.md's validation rules
 * (FR-003, US1 Scenario 3, US4 Scenario 3). Enforced before any API call so
 * feedback is instant (SC-004) for the common validation-failure case.
 */
export function validateTaskForm(title: string, description: string): TaskFormErrors {
  const errors: TaskFormErrors = {};
  const trimmedTitle = title.trim();

  if (trimmedTitle.length === 0) {
    errors.title = "Title is required.";
  } else if (trimmedTitle.length > TITLE_MAX_LENGTH) {
    errors.title = `Title must be ${TITLE_MAX_LENGTH} characters or fewer.`;
  }

  if (description.length > DESCRIPTION_MAX_LENGTH) {
    errors.description = `Description must be ${DESCRIPTION_MAX_LENGTH} characters or fewer.`;
  }

  return errors;
}
