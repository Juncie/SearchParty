import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import type { ApplicantProfile } from "@searchparty/shared";
import {
  buildAutofillPayloadValues,
  formatResumeAttachmentLabel,
  type AutofillFieldExecutionResult,
  type ScannedAutofillFieldPayload,
} from "@searchparty/shared";
import { defaultSelectedForTier } from "@/components/autofill/autofill-display";
import { buildExtensionAutofillFills } from "@/lib/build-extension-autofill-fills";
import {
  applyAutofillToActiveTab,
  scanActiveTab,
} from "@/lib/autofill-active-tab";
import {
  getAccountSetupResponse,
  listUploadedResumes,
  type AuthSession,
} from "@/lib/searchparty-api";

type WorkflowStatus = "idle" | "scanning" | "applying";

export function useAutofillTabWorkflow(
  profile: ApplicantProfile | null,
  session: AuthSession | null,
  options?: { autoScan?: boolean },
) {
  const [fields, setFields] = useState<
    ScannedAutofillFieldPayload[]
  >([]);
  const [selected, setSelected] = useState<
    Record<string, boolean>
  >({});
  const [status, setStatus] =
    useState<WorkflowStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [applyResults, setApplyResults] = useState<
    Record<string, AutofillFieldExecutionResult>
  >({});
  const [defaultResume, setDefaultResume] = useState<{
    id: string;
    label: string;
    mimeType: string;
  } | null>(null);
  const [accountOnboardingAnswers, setAccountOnboardingAnswers] =
    useState<Record<string, unknown>>({});

  const payload = useMemo(() => {
    if (!session?.user || !profile) {
      return null;
    }
    return buildAutofillPayloadValues({
      user: {
        name: session.user.name,
        email: session.user.email,
      },
      profile,
      accountOnboardingAnswers,
      resumeAttachment: defaultResume
        ? { label: defaultResume.label }
        : undefined,
    });
  }, [session, profile, defaultResume, accountOnboardingAnswers]);

  useEffect(() => {
    if (!session?.user) {
      setDefaultResume(null);
      setAccountOnboardingAnswers({});
      return;
    }
    let cancelled = false;
    void (async () => {
      try {
        const [{ resumes }, account] = await Promise.all([
          listUploadedResumes(),
          getAccountSetupResponse(),
        ]);
        if (cancelled) {
          return;
        }
        const first = resumes.find((r) => r.uploadStatus === "ready");
        setDefaultResume(
          first
            ? {
              id: first.id,
              label: formatResumeAttachmentLabel({
                mimeType: first.mimeType,
              }),
              mimeType: first.mimeType,
            }
            : null,
        );
        setAccountOnboardingAnswers(
          account.accountOnboardingAnswers ?? {},
        );
      } catch {
        if (!cancelled) {
          setDefaultResume(null);
          setAccountOnboardingAnswers({});
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [session?.user?.id]);

  const runScan = useCallback(
    async (mode: "cached" | "refresh") => {
      setNotice(null);
      setError(null);
      setApplyResults({});
      setStatus("scanning");
      const res = await scanActiveTab(mode);
      if (!res.ok) {
        setError(res.error);
        setFields([]);
        setSelected({});
        setStatus("idle");
        return;
      }
      setFields(res.fields);
      setSelected(
        Object.fromEntries(
          res.fields.map((f) => [
            f.spId,
            f.fillStatus === "fillable" &&
            defaultSelectedForTier(f.tier),
          ]),
        ),
      );
      setNotice(
        res.fields.length === 0
          ? "No matching fields on this page. Try an application form with standard labels."
          : `Found ${res.fields.length} field${res.fields.length === 1 ? "" : "s"}.`,
      );
      setStatus("idle");
    },
    [],
  );

  const userId = session?.user?.id;

  useEffect(() => {
    if (!options?.autoScan || !userId || !profile?.id) {
      return;
    }
    void runScan("cached");
  }, [options?.autoScan, profile?.id, userId, runScan]);

  const apply = useCallback(async () => {
    if (!payload) {
      return;
    }
    setNotice(null);
    setError(null);
    setApplyResults({});
    setStatus("applying");
    let fills;
    try {
      fills = await buildExtensionAutofillFills({
        fields,
        selected,
        payload,
        defaultResume,
      });
    } catch (fetchError) {
      setError(
        fetchError instanceof Error
          ? fetchError.message
          : "Could not load your resume for file autofill.",
      );
      setStatus("idle");
      return;
    }
    if (fills.length === 0) {
      setError(
        "Select at least one field with a value in your profile (or a ready resume for file upload fields).",
      );
      setStatus("idle");
      return;
    }
    const res = await applyAutofillToActiveTab(fills);
    if (!res.ok) {
      setError(res.error);
      setStatus("idle");
      return;
    }
    setApplyResults(
      Object.fromEntries(
        res.results.map((result) => [result.spId, result]),
      ),
    );
    const failedCount = res.results.filter(
      (result) => !result.ok,
    ).length;
    setNotice(
      failedCount > 0
        ? `Applied ${res.appliedSpIds.length} field${res.appliedSpIds.length === 1 ? "" : "s"}; ${failedCount} need review.`
        : `Applied ${res.appliedSpIds.length} field${res.appliedSpIds.length === 1 ? "" : "s"}.`,
    );
    setStatus("idle");
  }, [fields, payload, selected, defaultResume]);

  const onToggleField = useCallback(
    (spId: string, checked: boolean) => {
      setSelected((current) => ({
        ...current,
        [spId]: checked,
      }));
    },
    [],
  );

  const busy = status !== "idle";

  return {
    fields,
    selected,
    onToggleField,
    runScan,
    apply,
    applyResults,
    payload,
    defaultResume,
    status,
    error,
    notice,
    busy,
  };
}
