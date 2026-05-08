import { useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";

import type { ApplicantProfile } from "@searchparty/shared";
import type { ExtensionSurface } from "@/components/extension-surface";
import { HeroCard } from "@/components/HeroCard";
import {
  emptyProfileDraft,
  ProfileEditor,
  profileToDraft,
  type ProfileDraft,
} from "@/components/profiles/ProfileEditor";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { profileQuickStarts } from "@/lib/profile-quick-starts";
import {
  createApplicantProfile,
  deleteApplicantProfile,
  getAuthSession,
  listApplicantProfiles,
  setActiveApplicantProfile,
  updateApplicantProfile,
} from "@/lib/searchparty-api";

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
  const [profiles, setProfiles] = useState<ApplicantProfile[]>([]);
  const [activeProfileId, setActiveProfileId] = useState<
    string | null
  >(null);
  const [draft, setDraft] =
    useState<ProfileDraft>(emptyProfileDraft);
  const [status, setStatus] = useState<
    "loading" | "idle" | "saving" | "deleting"
  >("loading");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const selectedProfile = useMemo(
    () => profiles.find((profile) => profile.id === profileId) ?? null,
    [profileId, profiles]
  );

  const loadProfiles = useCallback(async () => {
    setStatus("loading");
    setError(null);

    try {
      const session = await getAuthSession();
      if (!session?.session) {
        void navigate({ to: "/login" });
        return;
      }

      const response = await listApplicantProfiles();
      const nextProfile =
        response.profiles.find((profile) => profile.id === profileId) ??
        null;

      setProfiles(response.profiles);
      setActiveProfileId(response.activeProfileId);

      if (profileId && !nextProfile) {
        setError("Profile not found.");
        setDraft(emptyProfileDraft);
        return;
      }

      setDraft(
        nextProfile ? profileToDraft(nextProfile) : emptyProfileDraft
      );
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

      setDraft(profileToDraft(savedProfile));
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
      const response = await setActiveApplicantProfile(profileId);
      setActiveProfileId(response.activeProfileId);
      setMessage("Active profile selected.");
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

  const applyTemplate = useCallback((template: ProfileDraft) => {
    setDraft(template);
    setMessage(`Loaded ${template.name}. Review and save it.`);
    setError(null);
  }, []);

  return (
    <>
      <HeroCard
        title={isEditing ? "Edit profile" : "Create profile"}
        greeting={
          isEditing
            ? selectedProfile?.name ?? "Profile details"
            : "Build a reusable profile"
        }
        description={
          isSidePanel
            ? "Use the side panel to shape the profile SearchParty will apply with."
            : "Add the essentials now, then refine details as your search evolves."
        }
        action={() => void navigate({ to: "/dashboard" })}
        actionTitle="Dashboard"
      />

      {!isEditing ? (
        <section className="status-card">
          <div>
            <p className="island-kicker">Quick starts</p>
            <h2>Choose a starting point</h2>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {profileQuickStarts.map((quickStart) => (
              <button
                key={quickStart.id}
                type="button"
                className="rounded-xl border border-border bg-card/70 p-3 text-left transition hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                onClick={() =>
                  applyTemplate(quickStart.profile)
                }
              >
                <span className="font-semibold">
                  {quickStart.label}
                </span>
                <span className="mt-1 block text-xs text-muted-foreground">
                  {quickStart.description}
                </span>
              </button>
            ))}
          </div>
        </section>
      ) : null}

      <Card className="bg-card/80">
        <CardHeader>
          <CardTitle>
            {isEditing ? "Profile fields" : "New profile"}
          </CardTitle>
          <CardDescription>
            These details power future autofill, generated answers,
            and tailored documents.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileEditor draft={draft} setDraft={setDraft} />
        </CardContent>
      </Card>

      {error ? (
        <p className="error-message text-destructive">{error}</p>
      ) : null}
      {message ? <p className="panel-muted">{message}</p> : null}

      <section className="panel-actions">
        <Button
          type="button"
          onClick={() => void saveProfile()}
          disabled={status !== "idle"}
        >
          {status === "saving" ? "Saving..." : "Save profile"}
        </Button>
        {profileId ? (
          <Button
            variant="outline"
            type="button"
            onClick={() => void activateProfile()}
            disabled={
              status !== "idle" || activeProfileId === profileId
            }
          >
            {activeProfileId === profileId
              ? "Active profile"
              : "Make active"}
          </Button>
        ) : null}
        {profileId ? (
          <Button
            variant="destructive"
            type="button"
            onClick={() => void deleteProfile()}
            disabled={status !== "idle"}
          >
            {status === "deleting" ? "Deleting..." : "Delete"}
          </Button>
        ) : null}
      </section>
    </>
  );
}
