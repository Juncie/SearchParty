import * as React from "react";

import type {
  ProfileQuestion,
  ProfileQuestionGroup,
} from "@searchparty/data/profile-questions";
import { getProfileQuestionGroupsForFlow } from "@searchparty/data/profile-questions";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

import {
  buildApplicantProfileInputFromAnswers,
  coerceStringArray,
  partitionOnboardingAnswers,
} from "./payload-from-answers";
import { QuestionField } from "./QuestionField";
import {
  isQuestionAnswered,
  isQuestionGroupComplete,
} from "./question-validation";
import { StepHeader } from "./StepHeader";
import { WizardFooter } from "./WizardFooter";
import { WizardProgress } from "./WizardProgress";
import { uploadResumeFromWizardFile } from "@/lib/searchparty-api";

export interface ProfileSetupWizardProps {
  /** When true, eligibility questions were already completed for this user. */
  skipAccount: boolean;
  /** Prefill map (account fields, saved drafts, etc.). */
  initialAnswers: Record<string, unknown>;
  /** Final-step submit handler — receives account + profile slices. */
  onSubmit: (payload: {
    accountAnswers: Record<string, unknown>;
    profileInput: ReturnType<typeof buildApplicantProfileInputFromAnswers>;
  }) => Promise<void>;
  /** Triggered when the user backs out of the wizard before completion. */
  onCancel?: () => void;
}

function defaultForQuestion(question: ProfileQuestion): unknown {
  switch (question.type) {
    case "multiselect":
      return [];
    case "tags":
      return [];
    case "checkbox":
      return false;
    case "file":
      return null;
    default:
      return "";
  }
}

function mergeInitialAnswers(
  groups: readonly ProfileQuestionGroup[],
  seed: Record<string, unknown>,
): Record<string, unknown> {
  const next: Record<string, unknown> = { ...seed };
  for (const group of groups) {
    for (const question of group.questions) {
      const fieldKey = question.field;
      const value = next[fieldKey];

      if (value === undefined || value === null) {
        next[fieldKey] = defaultForQuestion(question);
        continue;
      }

      if (
        question.type === "multiselect" &&
        typeof value === "string" &&
        value.trim() === ""
      ) {
        next[fieldKey] = [];
        continue;
      }

      if (question.type === "multiselect" && !Array.isArray(value)) {
        next[fieldKey] = [];
      }
    }
  }
  return next;
}

function formatAnswerReview(
  question: ProfileQuestion,
  raw: unknown,
): string {
  if (
    raw === undefined ||
    raw === null ||
    raw === "" ||
    (typeof raw === "string" && raw.trim().length === 0)
  ) {
    return "Not yet";
  }

  switch (question.type) {
    case "multiselect":
      return Array.isArray(raw)
        ? (raw as string[]).join(" · ")
        : String(raw);
    case "tags":
      return coerceStringArray(raw).join(" · ");
    case "radio":
    case "select":
    case "text":
    case "tel":
    case "url":
    case "textarea":
      return String(raw);
    case "checkbox":
      return typeof raw === "boolean"
        ? raw
          ? "Yes"
          : "No"
        : String(raw);
    case "file":
      if (
        typeof raw === "object" &&
        raw !== null &&
        "resumeId" in raw &&
        typeof (raw as { resumeId?: unknown }).resumeId === "string" &&
        (raw as { uploadStatus?: string }).uploadStatus === "ready" &&
        typeof (raw as { fileName?: unknown }).fileName === "string"
      ) {
        const stored = raw as {
          resumeId: string;
          uploadStatus: "ready";
          fileName: string;
        };
        return `Stored · ${stored.fileName}`;
      }
      return typeof raw === "object" &&
        raw !== null &&
        "fileName" in raw &&
        typeof (raw as { fileName?: string }).fileName === "string"
        ? (raw as { fileName: string }).fileName
        : "Attached";
    default:
      return String(raw);
  }
}

function isEntireWizardComplete(
  groups: readonly ProfileQuestionGroup[],
  answerMap: Record<string, unknown>,
): boolean {
  return groups.every((group) =>
    isQuestionGroupComplete(group, answerMap),
  );
}

/**
 * Multi-step onboarding shell that persists structured + JSON payloads for downstream AI tooling.
 */
export function ProfileSetupWizard({
  skipAccount,
  initialAnswers,
  onSubmit,
  onCancel,
}: ProfileSetupWizardProps) {
  const groups = React.useMemo(
    () =>
      getProfileQuestionGroupsForFlow({
        skipAccountSections: skipAccount,
      }),
    [skipAccount],
  );

  const [answers, setAnswers] = React.useState(() =>
    mergeInitialAnswers(groups, initialAnswers),
  );

  const [stepIndex, setStepIndex] = React.useState(0);
  const [showValidation, setShowValidation] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(
    null,
  );
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const reviewStepIndex = groups.length;
  const totalProgressSteps = groups.length + 1;
  const isReviewStep = stepIndex === reviewStepIndex;

  const currentGroup = !isReviewStep ? groups[stepIndex] : null;

  const finalizeProfile = React.useCallback(async () => {
    if (!isEntireWizardComplete(groups, answers)) {
      setSubmitError("Finish each step before submitting.");
      return;
    }

    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const { account } = partitionOnboardingAnswers(answers);
      const profileInput =
        buildApplicantProfileInputFromAnswers(answers);

      await onSubmit({
        accountAnswers: account,
        profileInput,
      });
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Something went wrong.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [answers, groups, onSubmit]);

  const handlePrimaryNavigation = React.useCallback(() => {
    if (!isReviewStep && currentGroup) {
      const complete = isQuestionGroupComplete(
        currentGroup,
        answers,
      );

      setShowValidation(true);

      if (!complete) return;

      setShowValidation(false);
      setSubmitError(null);
      setStepIndex((prev) =>
        prev < reviewStepIndex ? prev + 1 : prev,
      );
      return;
    }

    void finalizeProfile();
  }, [
    answers,
    currentGroup,
    finalizeProfile,
    isReviewStep,
    reviewStepIndex,
  ]);

  const questionInvalid = React.useCallback(
    (question: ProfileQuestion) => {
      if (!currentGroup || !showValidation) {
        return false;
      }

      return !isQuestionAnswered(
        question,
        answers[question.field],
      );
    },
    [answers, currentGroup, showValidation],
  );

  const handleBack = React.useCallback(() => {
    setShowValidation(false);
    setSubmitError(null);

    if (stepIndex === 0) {
      onCancel?.();
      return;
    }

    setStepIndex((previous) =>
      previous > 0 ? previous - 1 : previous,
    );
  }, [onCancel, stepIndex]);

  const handleSkipOptional = React.useCallback(() => {
    if (!currentGroup) return;

    setShowValidation(false);

    setStepIndex((prev) =>
      prev < reviewStepIndex ? prev + 1 : prev,
    );
  }, [currentGroup, reviewStepIndex]);

  const shouldShowSkipControl = React.useMemo(() => {
    if (!currentGroup) return false;

    return currentGroup.questions.every(
      (question) => !question.required,
    );
  }, [currentGroup]);

  const stepTitle = isReviewStep
    ? "Review & create"
    : (currentGroup?.title ?? "Profile setup");

  const stepDescription = isReviewStep
    ? "Confirm the highlights below, then spin up your profile."
    : currentGroup?.description;

  return (
    <div className="grid gap-5">
      {submitError ? (
        <div
          role="alert"
          className="rounded-lg border border-destructive/50 bg-destructive/15 px-3 py-2 text-destructive text-xs normal-case tracking-normal leading-relaxed font-normal"
        >
          {submitError}
        </div>
      ) : null}
      <Card className="w-full border-border shadow-lg">
        <CardHeader className="grid gap-3 border-border border-b [.border-b]:pb-6">
          <WizardProgress
            stepIndex={stepIndex}
            totalSteps={totalProgressSteps}
          />
          <StepHeader
            stepNumber={Math.min(stepIndex + 1, totalProgressSteps)}
            stepCount={totalProgressSteps}
            title={stepTitle}
            description={stepDescription}
          />
        </CardHeader>
        <CardContent className="grid gap-6 pt-6">
          {!isReviewStep && currentGroup ? (
            <>
              <div
                aria-hidden
                role="presentation"
                className="sr-only"
              >
                {`Grouped prompts · ${stepTitle}`}
              </div>
              {currentGroup.questions.map((question) => {
                const fieldValue = answers[question.field];
                const invalid = questionInvalid(question);

                const errorText =
                  invalid && question.required
                    ? "This prompt needs an answer."
                    : undefined;

                return (
                  <QuestionField
                    key={`${currentGroup.id}-${question.field}`}
                    question={question}
                    value={fieldValue}
                    invalid={
                      invalid && question.required
                        ? true
                        : false
                    }
                    errorText={errorText}
                    fileCommit={
                      question.field === "resumeUpload"
                        ? uploadResumeFromWizardFile
                        : undefined
                    }
                    onChange={(nextValue: unknown) => {
                      setAnswers((previous) => ({
                        ...previous,
                        [question.field]: nextValue,
                      }));
                      setSubmitError(null);
                    }}
                  />
                );
              })}
            </>
          ) : (
            <div className="grid gap-5">
              {groups.map((group) => (
                <section key={group.id} className="grid gap-2">
                  <h2 className="text-sm font-medium text-foreground">
                    {group.title}
                  </h2>
                  <ul className="grid gap-2 text-muted-foreground text-xs leading-relaxed">
                    {group.questions.map((question) => (
                      <li key={question.field}>
                        <span className="text-card-foreground/90">
                          {question.question}
                        </span>
                        <span>
                          {` — ${formatAnswerReview(question, answers[question.field])}`}
                        </span>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex-col gap-6 border-border border-t pt-7">
          <WizardFooter
            canGoBack={stepIndex > 0 || Boolean(onCancel)}
            isBusy={isSubmitting}
            onBack={() => {
              handleBack();
            }}
            onPrimary={() => {
              handlePrimaryNavigation();
            }}
            primaryLabel={
              isReviewStep ? "Create profile" : "Continue"
            }
            onSecondary={
              shouldShowSkipControl ? handleSkipOptional : undefined
            }
            secondaryLabel={
              shouldShowSkipControl ? "Skip for now" : undefined
            }
          />
        </CardFooter>
      </Card>
    </div>
  );
}
