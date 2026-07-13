import { z } from "zod";

export const generatedDocumentKindSchema = z.enum([
  "cover_letter",
  "open_ended_answer",
]);

export const generateDocumentInputSchema = z.object({
  kind: generatedDocumentKindSchema.default("cover_letter"),
  profileId: z.string().min(1),
  jobPostingId: z.string().min(1),
  /** Confirmed evidence strings the model may use — never invent beyond these. */
  evidence: z
    .array(
      z.object({
        id: z.string(),
        label: z.string(),
        value: z.string().min(1),
      }),
    )
    .min(1),
  question: z.string().trim().optional(),
  tone: z.enum(["professional", "confident", "friendly"]).default("professional"),
});

export type GenerateDocumentInput = z.infer<
  typeof generateDocumentInputSchema
>;

export const generatedDocumentSchema = z.object({
  id: z.string(),
  userId: z.string(),
  profileId: z.string().nullable(),
  jobPostingId: z.string().nullable(),
  kind: generatedDocumentKindSchema,
  content: z.string(),
  status: z.enum(["draft", "confirmed", "rejected"]),
  evidenceJson: z.object({
    factIds: z.array(z.string()),
    notes: z.string().optional(),
  }),
  model: z.string(),
  promptVersion: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  approvedAt: z.string().datetime().nullable(),
});

export type GeneratedDocument = z.infer<typeof generatedDocumentSchema>;

export const approveGeneratedDocumentInputSchema = z.object({
  action: z.enum(["approve", "reject", "edit"]),
  content: z.string().optional(),
});

export const GENERATION_PROMPT_VERSION = "evidence-bound-v1";

/**
 * Validates that generated narrative content does not introduce tokens that
 * look like invented employers/schools outside the supplied evidence set.
 * This is a conservative guard, not a complete NLP solution.
 */
export function assertNoInventedEntities(input: {
  content: string;
  evidenceValues: string[];
  bannedTokens?: string[];
}): { ok: true } | { ok: false; reason: string } {
  const banned = input.bannedTokens ?? [];
  const haystack = input.evidenceValues.join("\n").toLowerCase();
  for (const token of banned) {
    const needle = token.trim().toLowerCase();
    if (!needle) {
      continue;
    }
    if (
      input.content.toLowerCase().includes(needle) &&
      !haystack.includes(needle)
    ) {
      return {
        ok: false,
        reason: `Generated text mentions "${token}" which is not in the supplied evidence.`,
      };
    }
  }
  return { ok: true };
}

/**
 * Deterministic evidence-bound draft used when no model provider is configured.
 * Only concatenates confirmed evidence — never invents personal facts.
 */
export function buildEvidenceBoundDraft(input: {
  kind: "cover_letter" | "open_ended_answer";
  company: string;
  title: string;
  tone: "professional" | "confident" | "friendly";
  evidence: Array<{ label: string; value: string }>;
  question?: string;
}): string {
  const intro =
    input.kind === "cover_letter"
      ? `I am writing to express interest in the ${input.title || "role"} at ${input.company || "your company"}.`
      : `Regarding: ${input.question?.trim() || "your question"}`;

  const bullets = input.evidence
    .map((item) => `- ${item.label}: ${item.value}`)
    .join("\n");

  const closing =
    input.tone === "confident"
      ? "I would welcome the chance to contribute immediately."
      : input.tone === "friendly"
        ? "I would love to discuss how I can help."
        : "Thank you for your consideration.";

  return [intro, "", "Evidence from my confirmed profile:", bullets, "", closing]
    .filter((line) => line !== undefined)
    .join("\n");
}
