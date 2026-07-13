import type { AutofillFieldKind } from "../autofill/types";
import {
  isAnswerEligibleForAutofill,
  provenanceLabelForSource,
  type AnswerCategory,
  type AnswerSource,
  type ResolvedAnswer,
} from "./types";

type AnswerCandidate = {
  key: string;
  value: string;
  category: AnswerCategory;
  source: AnswerSource;
  approval: "confirmed" | "draft" | "rejected" | "pending";
  label?: string;
};

/**
 * Precedence for deterministic answer resolution:
 * 1. current user edit
 * 2. confirmed profile / account answer
 * 3. approved reusable answer
 * 4. approved generated narrative
 *
 * Draft / pending / rejected values never win.
 */
const SOURCE_PRECEDENCE: ReadonlyArray<AnswerSource> = [
  "user_edit",
  "profile",
  "account",
  "resume",
  "approved_reusable",
  "approved_generated",
];

function sourceRank(source: AnswerSource): number {
  const index = SOURCE_PRECEDENCE.indexOf(source);
  return index === -1 ? Number.MAX_SAFE_INTEGER : index;
}

/**
 * Picks the highest-precedence confirmed candidate for a logical answer key.
 */
export function resolveAnswer(
  candidates: ReadonlyArray<AnswerCandidate>,
): ResolvedAnswer | null {
  const eligible = candidates
    .map((candidate) => ({
      key: candidate.key,
      value: candidate.value.trim(),
      category: candidate.category,
      source: candidate.source,
      approval: candidate.approval,
      label: candidate.label,
    }))
    .filter((candidate) => isAnswerEligibleForAutofill(candidate))
    .sort((a, b) => sourceRank(a.source) - sourceRank(b.source));

  return eligible[0] ?? null;
}

/** Maps autofill kinds onto answer categories for policy and UI. */
export function categoryForAutofillKind(
  kind: AutofillFieldKind,
): AnswerCategory {
  switch (kind) {
    case "coverLetter":
      return "narrative";
    case "desiredSalary":
    case "openToRelocation":
    case "startAvailability":
      return "preference";
    default:
      return "fact";
  }
}

/**
 * Builds confirmed answer candidates from profile and account onboarding JSON.
 */
export function buildOnboardingAnswerCandidates(input: {
  profileOnboardingAnswers?: Readonly<Record<string, unknown>>;
  accountOnboardingAnswers?: Readonly<Record<string, unknown>>;
  userEdits?: Readonly<Record<string, string>>;
  approvedReusable?: ReadonlyArray<{ key: string; value: string }>;
  approvedGenerated?: ReadonlyArray<{ key: string; value: string }>;
  draftGenerated?: ReadonlyArray<{ key: string; value: string }>;
}): ResolvedAnswer[] {
  const results: ResolvedAnswer[] = [];
  const keys = new Set<string>([
    ...Object.keys(input.userEdits ?? {}),
    ...Object.keys(input.profileOnboardingAnswers ?? {}),
    ...Object.keys(input.accountOnboardingAnswers ?? {}),
    ...(input.approvedReusable?.map((item) => item.key) ?? []),
    ...(input.approvedGenerated?.map((item) => item.key) ?? []),
    ...(input.draftGenerated?.map((item) => item.key) ?? []),
  ]);

  for (const key of keys) {
    const candidates: AnswerCandidate[] = [];
    const edit = input.userEdits?.[key];
    if (typeof edit === "string" && edit.trim()) {
      candidates.push({
        key,
        value: edit,
        category: "fact",
        source: "user_edit",
        approval: "confirmed",
      });
    }

    const profileValue = input.profileOnboardingAnswers?.[key];
    if (typeof profileValue === "string" && profileValue.trim()) {
      candidates.push({
        key,
        value: profileValue,
        category: "preference",
        source: "profile",
        approval: "confirmed",
        label: provenanceLabelForSource("profile"),
      });
    }

    const accountValue = input.accountOnboardingAnswers?.[key];
    if (typeof accountValue === "string" && accountValue.trim()) {
      candidates.push({
        key,
        value: accountValue,
        category: "fact",
        source: "account",
        approval: "confirmed",
        label: provenanceLabelForSource("account"),
      });
    }

    for (const reusable of input.approvedReusable ?? []) {
      if (reusable.key === key && reusable.value.trim()) {
        candidates.push({
          key,
          value: reusable.value,
          category: "narrative",
          source: "approved_reusable",
          approval: "confirmed",
          label: provenanceLabelForSource("approved_reusable"),
        });
      }
    }

    for (const generated of input.approvedGenerated ?? []) {
      if (generated.key === key && generated.value.trim()) {
        candidates.push({
          key,
          value: generated.value,
          category: "narrative",
          source: "approved_generated",
          approval: "confirmed",
          label: provenanceLabelForSource("approved_generated"),
        });
      }
    }

    for (const draft of input.draftGenerated ?? []) {
      if (draft.key === key && draft.value.trim()) {
        candidates.push({
          key,
          value: draft.value,
          category: "narrative",
          source: "draft_generated",
          approval: "draft",
          label: provenanceLabelForSource("draft_generated"),
        });
      }
    }

    const resolved = resolveAnswer(candidates);
    if (resolved) {
      results.push(resolved);
    }
  }

  return results;
}

/**
 * Looks up a single resolved onboarding/account answer by field id.
 */
export function resolveOnboardingField(input: {
  field: string;
  profileOnboardingAnswers?: Readonly<Record<string, unknown>>;
  accountOnboardingAnswers?: Readonly<Record<string, unknown>>;
}): ResolvedAnswer | null {
  return (
    buildOnboardingAnswerCandidates({
      profileOnboardingAnswers: input.profileOnboardingAnswers,
      accountOnboardingAnswers: input.accountOnboardingAnswers,
    }).find((answer) => answer.key === input.field) ?? null
  );
}
