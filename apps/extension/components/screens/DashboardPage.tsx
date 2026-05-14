import { useNavigate } from "@tanstack/react-router";
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
} from "@searchparty/shared";
import { DashboardAutofillSection } from "@/components/dashboard/DashboardAutofillSection";
import { DashboardProfilesSection } from "@/components/dashboard/DashboardProfilesSection";
import type { ExtensionSurface } from "@/components/extension-surface";
import {
  quickApplyFields,
  scanSummaryLine,
} from "@/components/autofill/autofill-display";
import { HeroCard } from "@/components/HeroCard";
import { useActiveTabAutofillScan } from "@/hooks/use-active-tab-autofill-scan";
import { applyAutofillToActiveTab } from "@/lib/autofill-active-tab";
import {
  deleteApplicantProfile,
  getAccountSetupResponse,
  getAuthSession,
  listApplicantProfiles,
  setActiveApplicantProfile,
  type AuthSession,
} from "@/lib/searchparty-api";
import { Settings } from "lucide-react";

interface DashboardPageProps {
  surface: ExtensionSurface;
}

export function DashboardPage({
  surface,
}: DashboardPageProps) {
  const navigate = useNavigate();
  const [session, setSession] =
    useState<AuthSession | null>(null);
  const [profiles, setProfiles] = useState<
    ApplicantProfile[]
  >([]);
  const [activeProfileId, setActiveProfileId] = useState<
    string | null
  >(null);
  const [status, setStatus] = useState<"loading" | "idle">(
    "loading",
  );
  const [error, setError] = useState<string | null>(null);
  const [quickApplyBusy, setQuickApplyBusy] =
    useState(false);
  const [quickNotice, setQuickNotice] = useState<
    string | null
  >(null);
  const [quickError, setQuickError] = useState<string | null>(
    null,
  );

  const {
    fields: scanFields,
    scanError,
    scanBusy,
    refreshScan,
  } = useActiveTabAutofillScan();

  const displayName = useMemo(() => {
    if (session?.user.name?.trim())
      return session.user.name.trim();
    if (session?.user.email)
      return session.user.email.split("@")[0];
    return "there";
  }, [session]);

  const defaultProfile = useMemo(
    () =>
      profiles.find((p) => p.id === activeProfileId) ??
      null,
    [profiles, activeProfileId],
  );

  const loadDashboard = useCallback(async () => {
    setStatus("loading");
    setError(null);

    try {
      const currentSession = await getAuthSession();
      if (!currentSession?.session) {
        void navigate({ to: "/login" });
        return;
      }

      // Gate the dashboard on first-time onboarding so users who arrive here
      // without completing the wizard get bounced back into it.
      const account = await getAccountSetupResponse();
      if (!account.accountOnboardingCompletedAt) {
        void navigate({ to: "/profiles/new" });
        return;
      }

      const profileResponse = await listApplicantProfiles();
      setSession(currentSession);
      setProfiles(profileResponse.profiles);
      setActiveProfileId(profileResponse.activeProfileId);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load your dashboard."
      );
    } finally {
      setStatus("idle");
    }
  }, [navigate]);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  const handleQuickApply = useCallback(async () => {
    setQuickNotice(null);
    setQuickError(null);
    if (!session?.user || !defaultProfile) {
      setQuickError("Choose a default profile first.");
      return;
    }
    setQuickApplyBusy(true);
    try {
      const latestFields = await refreshScan("cached");
      const payload = buildAutofillPayloadValues({
        user: {
          name: session.user.name,
          email: session.user.email,
        },
        profile: defaultProfile,
      });
      const fills = quickApplyFields(latestFields)
        .map((f) => ({
          spId: f.spId,
          value: valueForAutofillKind(payload, f.kind),
        }))
        .filter((f) => f.value.trim().length > 0);
      if (fills.length === 0) {
        setQuickError(
          "No high-confidence matches with values from your default profile. Try Preview matches.",
        );
        return;
      }
      const res = await applyAutofillToActiveTab(fills);
      if (!res.ok) {
        setQuickError(res.error);
        return;
      }
      setQuickNotice(
        `Filled ${fills.length} field${fills.length === 1 ? "" : "s"} on this page.`,
      );
    } finally {
      setQuickApplyBusy(false);
    }
  }, [defaultProfile, refreshScan, session]);

  const handleApplyProfile = useCallback(
    async (profile: ApplicantProfile) => {
      setQuickNotice(null);
      setQuickError(null);
      if (!session?.user) {
        setQuickError("Sign in to apply autofill.");
        return;
      }
      setQuickApplyBusy(true);
      try {
        const latestFields = await refreshScan("cached");
        const payload = buildAutofillPayloadValues({
          user: {
            name: session.user.name,
            email: session.user.email,
          },
          profile,
        });
        const fills = quickApplyFields(latestFields)
          .map((f) => ({
            spId: f.spId,
            value: valueForAutofillKind(payload, f.kind),
          }))
          .filter((f) => f.value.trim().length > 0);
        if (fills.length === 0) {
          setQuickError(
            "Nothing to apply for quick matches on this page with that profile.",
          );
          return;
        }
        const res = await applyAutofillToActiveTab(fills);
        if (!res.ok) {
          setQuickError(res.error);
          return;
        }
        setQuickNotice(
          `Filled ${fills.length} field${fills.length === 1 ? "" : "s"} with ${profile.name}.`,
        );
      } finally {
        setQuickApplyBusy(false);
      }
    },
    [refreshScan, session],
  );

  const handleSetDefaultProfile = useCallback(
    async (profileId: string) => {
      setQuickError(null);
      try {
        const res =
          await setActiveApplicantProfile(profileId);
        setActiveProfileId(res.activeProfileId);
        setQuickNotice("Default profile updated.");
      } catch (e) {
        setQuickError(
          e instanceof Error
            ? e.message
            : "Could not update default profile.",
        );
      }
    },
    [],
  );

  const handleDeleteProfile = useCallback(
    async (profileId: string) => {
      const confirmed = window.confirm(
        "Delete this profile? This cannot be undone."
      );
      if (!confirmed) return;
      setQuickError(null);
      try {
        await deleteApplicantProfile(profileId);
        await loadDashboard();
        setQuickNotice("Profile deleted.");
      } catch (e) {
        setQuickError(
          e instanceof Error
            ? e.message
            : "Could not delete profile.",
        );
      }
    },
    [loadDashboard],
  );

  const defaultPayload =
    session?.user && defaultProfile
      && buildAutofillPayloadValues({
          user: {
            name: session.user.name,
            email: session.user.email,
          },
          profile: defaultProfile,
        })
     

  const hasQuickTargets =
    Boolean(defaultPayload) &&
    quickApplyFields(scanFields).some(
      (f) =>
        valueForAutofillKind(defaultPayload!, f.kind).trim()
          .length > 0,
    );

  const blockError = scanError ?? quickError;
  const blockNotice = quickNotice;

  return (
    <main className="grid gap-3">
      <HeroCard
        title="Dashboard"
        greeting={`Hi, ${displayName}`}
        description={
          surface === "sidepanel"
            ? "Choose the profile you want SearchParty to use while you apply."
            : "Manage your job-search profiles and jump back into the right workflow."
        }
        action={() => void navigate({ to: "/settings" })}
        actionTitle="Settings"
        actionIcon={Settings}
      />

      <DashboardAutofillSection
        scanSummary={scanSummaryLine(scanFields)}
        scanBusy={scanBusy}
        quickApplyBusy={quickApplyBusy}
        fieldsDetected={scanFields.length > 0}
        hasQuickTargets={hasQuickTargets}
        hasDefaultProfile={Boolean(defaultProfile)}
        notice={blockNotice}
        error={blockError}
        onQuickApply={() => void handleQuickApply()}
        onPreviewMatches={() =>
          void navigate({ to: "/autofill" })
        }
      />

      <DashboardProfilesSection
        profiles={profiles}
        session={session}
        activeProfileId={activeProfileId}
        scanFields={scanFields}
        isLoading={status === "loading"}
        error={error}
        applyBusy={quickApplyBusy}
        onEditProfile={(profileId) =>
          void navigate({
            to: "/profiles/$profileId",
            params: { profileId },
          })
        }
        onCreateProfile={() =>
          void navigate({ to: "/profiles/new" })
        }
        onApplyProfile={handleApplyProfile}
        onSetDefaultProfile={handleSetDefaultProfile}
        onDeleteProfile={handleDeleteProfile}
      />
    </main>
  );
}
