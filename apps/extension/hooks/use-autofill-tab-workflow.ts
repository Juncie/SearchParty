import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import type { ApplicantProfile } from "@searchparty/shared";
import {
  buildAutofillPayloadValues,
  valueForAutofillKind,
  type AutofillFieldExecutionResult,
  type ScannedAutofillFieldPayload,
} from "@searchparty/shared";
import { defaultSelectedForTier } from "@/components/autofill/autofill-display";
import {
  applyAutofillToActiveTab,
  scanActiveTab,
} from "@/lib/autofill-active-tab";
import type { AuthSession } from "@/lib/searchparty-api";

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
    });
  }, [session, profile]);

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
    const fills = fields
      .filter(
        (f) =>
          selected[f.spId] && f.fillStatus === "fillable",
      )
      .map((f) => ({
        spId: f.spId,
        value: valueForAutofillKind(payload, f.kind),
      }))
      .filter((f) => f.value.trim().length > 0);
    if (fills.length === 0) {
      setError(
        "Select at least one field with a non-empty value in your profile.",
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
  }, [fields, payload, selected]);

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
    status,
    error,
    notice,
    busy,
  };
}
