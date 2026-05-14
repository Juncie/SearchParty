import { Button } from "@/components/ui/button";

interface ProfileEditManageActionsProps {
  profileId: string | undefined;
  activeProfileId: string | null;
  statusIdle: boolean;
  onDelete: () => void;
  deleting: boolean;
}

export function ProfileEditManageActions({
  profileId,
  activeProfileId,
  statusIdle,
  onDelete,
  deleting,
}: ProfileEditManageActionsProps) {
  const isDefaultProfile =
    Boolean(profileId) && activeProfileId === profileId;

  return (
    <section className="panel-actions">
      {profileId && (
        <Button
          variant="destructive"
          type="button"
          onClick={() => void onDelete()}
          disabled={!statusIdle}
        >
          {deleting ? "Deleting..." : "Delete"}
        </Button>
      )}
    </section>
  );
}
