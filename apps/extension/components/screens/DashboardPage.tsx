import { useNavigate } from "@tanstack/react-router";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import type { ApplicantProfile } from "@searchparty/shared";
import type { ExtensionSurface } from "@/components/extension-surface";
import { HeroCard } from "@/components/HeroCard";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  getAuthSession,
  listApplicantProfiles,
  setActiveApplicantProfile,
  type AuthSession,
} from "@/lib/searchparty-api";
import { cn } from "@/lib/utils";
import { Plus, Settings } from "lucide-react";

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
    "loading"
  );
  const [error, setError] = useState<string | null>(null);

  const displayName = useMemo(() => {
    if (session?.user.name?.trim())
      return session.user.name.trim();
    if (session?.user.email)
      return session.user.email.split("@")[0];
    return "there";
  }, [session]);

  const loadDashboard = useCallback(async () => {
    setStatus("loading");
    setError(null);

    try {
      const currentSession = await getAuthSession();
      if (!currentSession?.session) {
        void navigate({ to: "/login" });
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

  const handleSetActive = useCallback(
    async (profileId: string) => {
      try {
        const response =
          await setActiveApplicantProfile(profileId);
        setProfiles(response.profiles);
        setActiveProfileId(response.activeProfileId);
      } catch (activeError) {
        setError(
          activeError instanceof Error
            ? activeError.message
            : "Unable to select active profile."
        );
      }
    },
    []
  );

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

      <section className="status-card">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="island-kicker">Profiles</p>
            <h2>Your profiles</h2>
            <p className="panel-muted">
              {profiles.length === 0
                ? "Create your first reusable profile to speed up applications."
                : `${profiles.length} saved profile${profiles.length === 1 ? "" : "s"}`}
            </p>
          </div>
          {status === "loading" ? (
            <span className="status-badge">Loading</span>
          ) : null}
        </div>

        {error ? (
          <p className="error-message text-destructive">
            {error}
          </p>
        ) : null}

        <div className="grid gap-3 @sm:grid-cols-2">
          {profiles.map((profile) => (
            <ProfileCard
              key={profile.id}
              profile={profile}
              isActive={profile.id === activeProfileId}
              onEdit={() =>
                void navigate({
                  to: "/profiles/$profileId",
                  params: { profileId: profile.id },
                })
              }
              onActivate={() =>
                void handleSetActive(profile.id)
              }
            />
          ))}

          <button
            type="button"
            className="min-h-36 space-y-2 rounded-lg border border-dashed border-border bg-card/40 p-4 text-left transition hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            onClick={() =>
              void navigate({ to: "/profiles/new" })
            }
          >
            <span className="inline-flex items-center justify-center rounded-lg bg-primary/10 p-2">
              <Plus className="size-6 text-primary" />
            </span>
            <span className="block text-sm font-semibold">
              Create a new profile
            </span>
            <span className="mt-2 block text-xs/relaxed text-muted-foreground">
              Start from scratch or pick a quick-start role
              on the next screen.
            </span>
          </button>
        </div>
      </section>
    </main>
  );
}

function ProfileCard({
  profile,
  isActive,
  onEdit,
  onActivate,
}: {
  profile: ApplicantProfile;
  isActive: boolean;
  onEdit: () => void;
  onActivate: () => void;
}) {
  return (
    <Card
      className={cn(
        "bg-card/80",
        isActive && "ring-2 ring-primary/70 shadow-xl"
      )}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardTitle>{profile.name}</CardTitle>
            <CardDescription>
              {profile.targetRole}
            </CardDescription>
          </div>
          {isActive ? (
            <span className="status-badge connected">
              Active
            </span>
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="grid gap-3">
        <p className="line-clamp-3 text-xs/relaxed text-muted-foreground">
          {profile.summary || "No summary added yet."}
        </p>
        <dl className="status-details">
          <div>
            <dt>Skills</dt>
            <dd>{profile.skills.length}</dd>
          </div>
          <div>
            <dt>Experience</dt>
            <dd>{profile.workExperiences.length}</dd>
          </div>
        </dl>
        <div className="panel-actions">
          <Button size="sm" type="button" onClick={onEdit}>
            Edit
          </Button>
          <Button
            size="sm"
            variant="outline"
            type="button"
            onClick={onActivate}
            disabled={isActive}
          >
            {isActive ? "Selected" : "Set active"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
