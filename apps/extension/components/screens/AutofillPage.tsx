import { useNavigate } from "@tanstack/react-router";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import type { ApplicantProfile } from "@searchparty/shared";
import { AutofillWorkspace } from "@/components/autofill/AutofillWorkspace";
import type { ExtensionSurface } from "@/components/extension-surface";
import { HeroCard } from "@/components/HeroCard";
import { useAutofillTabWorkflow } from "@/hooks/use-autofill-tab-workflow";
import {
  getAuthSession,
  listApplicantProfiles,
  type AuthSession,
} from "@/lib/searchparty-api";
import { ArrowLeft } from "lucide-react";

interface AutofillPageProps {
  surface: ExtensionSurface;
}

export function AutofillPage({ surface }: AutofillPageProps) {
  const navigate = useNavigate();
  const [session, setSession] = useState<AuthSession | null>(
    null,
  );
  const [profiles, setProfiles] = useState<ApplicantProfile[]>(
    [],
  );
  const [activeProfileId, setActiveProfileId] = useState<
    string | null
  >(null);
  const [pageStatus, setPageStatus] = useState<
    "loading" | "idle"
  >("loading");
  const [pageError, setPageError] = useState<string | null>(
    null,
  );

  const activeProfile = useMemo(
    () =>
      profiles.find((p) => p.id === activeProfileId) ?? null,
    [profiles, activeProfileId],
  );

  const workflow = useAutofillTabWorkflow(
    activeProfile,
    pageStatus === "loading" ? null : session,
    { autoScan: pageStatus === "idle" },
  );

  const load = useCallback(async () => {
    setPageStatus("loading");
    setPageError(null);
    try {
      const current = await getAuthSession();
      if (!current?.session) {
        void navigate({ to: "/login" });
        return;
      }
      const res = await listApplicantProfiles();
      setSession(current);
      setProfiles(res.profiles);
      setActiveProfileId(res.activeProfileId);
    } catch (e) {
      setPageError(
        e instanceof Error
          ? e.message
          : "Unable to load profiles.",
      );
    } finally {
      setPageStatus("idle");
    }
  }, [navigate]);

  useEffect(() => {
    void load();
  }, [load]);

  const busy = pageStatus === "loading" || workflow.busy;

  const workspaceStatus =
    pageStatus === "loading"
      ? "loading"
      : workflow.status === "scanning"
        ? "scanning"
        : workflow.status === "applying"
          ? "applying"
          : "idle";

  return (
    <main className="grid gap-3">
      <HeroCard
        title="Autofill"
        greeting="Application forms"
        description={
          surface === "sidepanel"
            ? "Quickly fill application forms with your default profile."
            : "Use the side panel on a job site for the best autofill workflow."
        }
        action={() => void navigate({ to: "/dashboard" })}
        actionTitle="Dashboard"
        actionIcon={ArrowLeft}
      />

      <AutofillWorkspace
        busy={busy}
        session={session}
        status={workspaceStatus}
        activeProfile={activeProfile}
        fields={workflow.fields}
        payload={workflow.payload}
        selected={workflow.selected}
        applyResults={workflow.applyResults}
        onToggleField={workflow.onToggleField}
        error={pageError ?? workflow.error}
        notice={workflow.notice}
        onScan={() => void workflow.runScan("refresh")}
        onApply={() => void workflow.apply()}
      />
    </main>
  );
}
