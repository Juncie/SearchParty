import type {
  ProfileQuestion,
  ProfileQuestionGroup,
} from "@searchparty/data/profile-questions";

import { coerceStringArray } from "./payload-from-answers";

/**
 * True when {@link ProfileQuestion.required} constraints are satisfied.
 */
export function isQuestionAnswered(
  question: ProfileQuestion,
  raw: unknown,
): boolean {
  if (!question.required) {
    return true;
  }

  switch (question.type) {
    case "multiselect":
      return Array.isArray(raw) && raw.length > 0;
    case "tags":
      return coerceStringArray(raw).length > 0;
    case "radio":
    case "select":
      return typeof raw === "string" && raw.trim().length > 0;
    case "textarea":
    case "text":
    case "tel":
    case "url":
      return typeof raw === "string" && raw.trim().length > 0;
    case "checkbox":
      if (question.options?.length === 2) {
        return typeof raw === "string" && raw.trim().length > 0;
      }
      return typeof raw === "boolean" ? raw === true : false;
    case "file":
      return (
        typeof raw === "object" &&
        raw !== null &&
        "fileName" in raw &&
        typeof (raw as { fileName?: string }).fileName === "string" &&
        ((raw as { fileName?: string }).fileName?.length ?? 0) > 0
      );
    default:
      return false;
  }
}

/**
 * All questions in this step pass validation.
 */
export function isQuestionGroupComplete(
  group: ProfileQuestionGroup,
  answers: Record<string, unknown>,
): boolean {
  return group.questions.every((question) =>
    isQuestionAnswered(question, answers[question.field]),
  );
}
