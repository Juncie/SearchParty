import { z } from "zod";

/** Product categories for profile and application answers. */
export const answerCategorySchema = z.enum([
  "fact",
  "preference",
  "narrative",
]);

export type AnswerCategory = z.infer<typeof answerCategorySchema>;

/** Where a resolved answer originated. */
export const answerSourceSchema = z.enum([
  "user_edit",
  "profile",
  "account",
  "resume",
  "approved_reusable",
  "approved_generated",
  "draft_generated",
]);

export type AnswerSource = z.infer<typeof answerSourceSchema>;

/** Approval state for answers that may enter autofill. */
export const approvalStatusSchema = z.enum([
  "confirmed",
  "draft",
  "rejected",
  "pending",
]);

export type ApprovalStatus = z.infer<typeof approvalStatusSchema>;

/** One resolved answer ready for UI provenance and autofill policy. */
export const resolvedAnswerSchema = z.object({
  key: z.string().min(1),
  value: z.string(),
  category: answerCategorySchema,
  source: answerSourceSchema,
  approval: approvalStatusSchema,
  label: z.string().optional(),
});

export type ResolvedAnswer = z.infer<typeof resolvedAnswerSchema>;

/** Human-readable provenance labels for extension previews. */
export function provenanceLabelForSource(source: AnswerSource): string {
  switch (source) {
    case "user_edit":
      return "From your edit";
    case "profile":
      return "From your profile";
    case "account":
      return "From your account";
    case "resume":
      return "From your résumé";
    case "approved_reusable":
      return "From a saved answer";
    case "approved_generated":
      return "Approved AI draft";
    case "draft_generated":
      return "AI draft — review required";
  }
}

/**
 * Whether a resolved answer may be selected for autofill.
 * Draft and pending values never enter the fill payload.
 */
export function isAnswerEligibleForAutofill(
  answer: ResolvedAnswer | null | undefined,
): boolean {
  if (!answer) {
    return false;
  }
  if (answer.value.trim().length === 0) {
    return false;
  }
  return answer.approval === "confirmed";
}
