import { Button } from "@/components/ui/button";

interface ProfileEditManageActionsProps {
  profileId: string | undefined;
  activeProfileId: string | null;
  statusIdle: boolean;
  onActivate: () => void;
  onDelete: () => void;
  deleting: boolean;
}

export function ProfileEditManageActions({
  profileId,
  activeProfileId,
  statusIdle,
  onActivate,
  onDelete,
  deleting,
}: ProfileEditManageActionsProps) {
  const isDefaultProfile =
    Boolean(profileId) && activeProfileId === profileId;

  return (
    <section className="panel-actions">
      {profileId ? (
        <Button
          variant="outline"
          type="button"
          className="cursor-pointer"
          onClick={() => void onActivate()}
          disabled={!statusIdle || isDefaultProfile}
        >
          {isDefaultProfile
            ? "This is your default profile"
            : "Set as default profile"}
        </Button>
      ) : null}
      {profileId ? (
        <Button
          variant="destructive"
          type="button"
          onClick={() => void onDelete()}
          disabled={!statusIdle}
        >
          {deleting ? "Deleting..." : "Delete"}
        </Button>
      ) : null}
    </section>
  );
}
