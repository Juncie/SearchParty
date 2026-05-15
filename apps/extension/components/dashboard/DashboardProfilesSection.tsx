import type { ApplicantProfile } from "@searchparty/shared";
import { DashboardProfileRow } from "@/components/dashboard/DashboardProfileRow";
import { Skeleton } from "@/components/ui/skeleton";
import type { AuthSession } from "@/lib/searchparty-api";
import type { ScannedAutofillFieldPayload } from "@searchparty/shared";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";

interface DashboardProfilesSectionProps {
  profiles: ApplicantProfile[];
  session: AuthSession | null;
  activeProfileId: string | null;
  scanFields: ScannedAutofillFieldPayload[];
  /** First ready resume from the web app, when available for file autofill. */
  defaultResume: {
    id: string;
    label: string;
    mimeType: string;
  } | null;
  isLoading: boolean;
  error: string | null;
  applyBusy: boolean;
  onEditProfile: (profileId: string) => void;
  onCreateProfile: () => void;
  onApplyProfile: (profile: ApplicantProfile) => void | Promise<void>;
  onSetDefaultProfile: (
    profileId: string,
  ) => void | Promise<void>;
  onDeleteProfile: (profileId: string) => void | Promise<void>;
}

export function DashboardProfilesSection({
  profiles,
  session,
  activeProfileId,
  scanFields,
  defaultResume,
  isLoading,
  error,
  applyBusy,
  onEditProfile,
  onCreateProfile,
  onApplyProfile,
  onSetDefaultProfile,
  onDeleteProfile,
}: DashboardProfilesSectionProps) {
  const [openActionsProfileId, setOpenActionsProfileId] = useState<
    string | null
  >(null);

  useEffect(() => {
    if (
      openActionsProfileId &&
      !profiles.some((p) => p.id === openActionsProfileId)
    ) {
      setOpenActionsProfileId(null);
    }
  }, [profiles, openActionsProfileId]);

  return (
    <section className="status-card">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="island-kicker">Profiles</p>
          <h2>
            {profiles.length === 0
              ? "Create your first profile"
              : `You have ${profiles.length} saved profile${profiles.length === 1 ? "" : "s"}`}
          </h2>
        </div>
        {isLoading ? (
          <Skeleton
            className="h-6 w-[4.5rem] shrink-0 rounded-full"
            aria-hidden
          />
        ) : null}
      </div>

      {error ? (
        <p className="error-message text-destructive">{error}</p>
      ) : null}

      <div className="grid gap-2">
        {profiles.map((profile) => (
          <DashboardProfileRow
            key={profile.id}
            profile={profile}
            session={session}
            isDefault={profile.id === activeProfileId}
            scanFields={scanFields}
            defaultResume={defaultResume}
            actionsMenuOpen={openActionsProfileId === profile.id}
            onActionsMenuOpenChange={(open) => {
              setOpenActionsProfileId(open ? profile.id : null);
            }}
            onEdit={() => void onEditProfile(profile.id)}
            onApply={() => void onApplyProfile(profile)}
            applyBusy={applyBusy}
            onSetDefault={() =>
              void onSetDefaultProfile(profile.id)
            }
            onDelete={() =>
              void onDeleteProfile(profile.id)
            }
          />
        ))}

        <button
          type="button"
          className="flex min-h-[4.5rem] cursor-pointer flex-col gap-1 rounded-lg border border-dashed border-border bg-card/40 p-3 text-left transition hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          onClick={() => void onCreateProfile()}
        >
          <span className="inline-flex size-8 items-center justify-center rounded-lg bg-primary/10">
            <Plus className="size-5 text-primary" />
          </span>
          <span className="text-sm font-semibold">
            Create a new profile
          </span>
          <span className="text-xs/relaxed text-muted-foreground">
            Start from scratch or pick a quick-start role on the next screen.
          </span>
        </button>
      </div>
    </section>
  );
}
