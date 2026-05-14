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
  emptyProfileDraft,
  profileToDraft,
  type ProfileDraft,
} from "@/components/profiles/ProfileEditor";
import { ProfileEditDirtySaveBar } from "@/components/profiles/ProfileEditDirtySaveBar";
import { ProfileEditFeedback } from "@/components/profiles/ProfileEditFeedback";
import { ProfileEditManageActions } from "@/components/profiles/ProfileEditManageActions";
import { ProfileEditorSectionCard } from "@/components/profiles/ProfileEditorSectionCard";
import { ProfileQuickStartsSection } from "@/components/profiles/ProfileQuickStartsSection";
import {
  createApplicantProfile,
  deleteApplicantProfile,
  getAuthSession,
  listApplicantProfiles,
  setActiveApplicantProfile,
  updateApplicantProfile,
  type AuthSession,
} from "@/lib/searchparty-api";
import { ArrowLeft } from "lucide-react";

interface ProfileEditPageProps {
  surface: ExtensionSurface;
  profileId?: string;
}

export function ProfileEditPage({
  surface,
  profileId,
}: ProfileEditPageProps) {
  const navigate = useNavigate();
  const isEditing = Boolean(profileId);
  const isSidePanel = surface === "sidepanel";
  const [profiles, setProfiles] = useState<
    ApplicantProfile[]
  >([]);
  const [activeProfileId, setActiveProfileId] = useState<
    string | null
  >(null);
  const [draft, setDraft] = useState<ProfileDraft>(
    emptyProfileDraft
  );
  const [initialDraft, setInitialDraft] =
    useState<ProfileDraft>(emptyProfileDraft);
  const [status, setStatus] = useState<
    "loading" | "idle" | "saving" | "deleting"
  >("loading");
  const [message, setMessage] = useState<string | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [session, setSession] =
    useState<AuthSession | null>(null);

  const selectedProfile = useMemo(
    () =>
      profiles.find(
        (profile) => profile.id === profileId
      ) ?? null,
    [profileId, profiles]
  );

  const autofillWorkflow = useAutofillTabWorkflow(
    selectedProfile,
    status === "loading" ? null : session,
    {
      autoScan:
        Boolean(isEditing && selectedProfile) &&
        status === "idle",
    }
  );

  const loadProfiles = useCallback(async () => {
    setStatus("loading");
    setError(null);

    try {
      const authSession = await getAuthSession();
      if (!authSession?.session) {
        void navigate({ to: "/login" });
        return;
      }

      const response = await listApplicantProfiles();
      setSession(authSession);
      const nextProfile =
        response.profiles.find(
          (profile) => profile.id === profileId
        ) ?? null;

      setProfiles(response.profiles);
      setActiveProfileId(response.activeProfileId);

      if (profileId && !nextProfile) {
        setError("Profile not found.");
        setDraft(emptyProfileDraft);
        setInitialDraft(emptyProfileDraft);
        return;
      }

      const newDraft = nextProfile
        ? profileToDraft(nextProfile)
        : emptyProfileDraft;
      setDraft(newDraft);
      setInitialDraft(newDraft);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load profile."
      );
    } finally {
      setStatus("idle");
    }
  }, [navigate, profileId]);

  useEffect(() => {
    void loadProfiles();
  }, [loadProfiles]);

  const saveProfile = useCallback(async () => {
    setStatus("saving");
    setError(null);
    setMessage(null);

    try {
      const savedProfile = profileId
        ? await updateApplicantProfile(profileId, draft)
        : await createApplicantProfile(draft);

      if (!profileId) {
        void navigate({
          to: "/profiles/$profileId",
          params: { profileId: savedProfile.id },
        });
      }

      const updatedDraft = profileToDraft(savedProfile);
      setDraft(updatedDraft);
      setInitialDraft(updatedDraft);
      setMessage(
        profileId ? "Profile updated." : "Profile created."
      );
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Unable to save profile."
      );
    } finally {
      setStatus("idle");
    }
  }, [draft, navigate, profileId]);

  const activateProfile = useCallback(async () => {
    if (!profileId) return;
    setStatus("saving");
    setError(null);

    try {
      const response =
        await setActiveApplicantProfile(profileId);
      setProfiles(response.profiles);
      setActiveProfileId(response.activeProfileId);
      setMessage("Default profile updated.");
    } catch (activeError) {
      setError(
        activeError instanceof Error
          ? activeError.message
          : "Unable to select active profile."
      );
    } finally {
      setStatus("idle");
    }
  }, [profileId]);

  const deleteProfile = useCallback(async () => {
    if (!profileId) return;
    const confirmed = window.confirm(
      "Delete this profile? This cannot be undone."
    );
    if (!confirmed) return;

    setStatus("deleting");
    setError(null);

    try {
      await deleteApplicantProfile(profileId);
      void navigate({ to: "/dashboard" });
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Unable to delete profile."
      );
    } finally {
      setStatus("idle");
    }
  }, [navigate, profileId]);

  const applyTemplate = useCallback(
    (template: ProfileDraft) => {
      setDraft(template);
      setMessage(
        `Loaded ${template.name}. Review and save it.`
      );
      setError(null);
    },
    []
  );

  const isDirty = useMemo(() => {
    return (
      JSON.stringify(draft) !== JSON.stringify(initialDraft)
    );
  }, [draft, initialDraft]);

  const statusIdle = status === "idle";

  const autofillBusy =
    status === "loading" || autofillWorkflow.busy;

  const autofillWorkspaceStatus =
    status === "loading"
      ? "loading"
      : autofillWorkflow.status === "scanning"
        ? "scanning"
        : autofillWorkflow.status === "applying"
          ? "applying"
          : "idle";

  return (
    <main className="grid gap-6 pb-24">
      <HeroCard
        title={
          isEditing ? "Edit profile" : "Create profile"
        }
        greeting={
          isEditing
            ? (selectedProfile?.name ?? "Profile details")
            : "Build a reusable profile"
        }
        description={
          isSidePanel
            ? "Use the side panel to shape the profile SearchParty will apply with."
            : "Add the essentials now, then refine details as your search evolves."
        }
        action={() => void navigate({ to: "/dashboard" })}
        actionIcon={ArrowLeft}
        actionTitle="Dashboard"
      />

      {!isEditing ? (
        <ProfileQuickStartsSection
          onSelectTemplate={applyTemplate}
        />
      ) : null}

      {isEditing && selectedProfile ? (
        <AutofillWorkspace
          prominentApply
          busy={autofillBusy}
          session={session}
          status={autofillWorkspaceStatus}
          activeProfile={selectedProfile}
          fields={autofillWorkflow.fields}
          payload={autofillWorkflow.payload}
          selected={autofillWorkflow.selected}
          applyResults={autofillWorkflow.applyResults}
          onToggleField={autofillWorkflow.onToggleField}
          error={autofillWorkflow.error}
          notice={autofillWorkflow.notice}
          onScan={() =>
            void autofillWorkflow.runScan("refresh")
          }
          onApply={() => void autofillWorkflow.apply()}
          onSetDefaultProfile={
            selectedProfile.id !== activeProfileId
              ? () => void activateProfile()
              : undefined
          }
          setDefaultProfileDisabled={!statusIdle}
        />
      ) : null}

      <ProfileEditorSectionCard
        isEditing={isEditing}
        draft={draft}
        setDraft={setDraft}
      />

      <ProfileEditFeedback
        error={error}
        message={message}
      />

      <ProfileEditManageActions
        profileId={profileId}
        activeProfileId={activeProfileId}
        statusIdle={statusIdle}
        onDelete={deleteProfile}
        deleting={status === "deleting"}
      />

      <ProfileEditDirtySaveBar
        visible={isDirty}
        isSaving={status === "saving"}
        onSave={saveProfile}
      />
    </main>
  );
}
