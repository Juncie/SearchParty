import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SettingBlockCard } from "@/components/settings/SettingBlockCard";
import { SettingsSectionCard } from "@/components/settings/SettingsSectionCard";

interface DangerZoneSectionProps {
  deleteConfirmation: string;
  status: "idle" | "deleting";
  onDeleteConfirmationChange: (value: string) => void;
  onDeleteAccount: () => void;
}

export function DangerZoneSection({
  deleteConfirmation,
  status,
  onDeleteConfirmationChange,
  onDeleteAccount,
}: DangerZoneSectionProps) {
  return (
    <SettingsSectionCard title="Danger zone">
      <SettingBlockCard
        title="Delete account"
        description="This permanently removes your account and saved profiles."
      >
        <Input
          value={deleteConfirmation}
          onChange={(event) =>
            onDeleteConfirmationChange(event.target.value)
          }
          placeholder="Type DELETE to confirm"
        />
        <Button
          variant="destructive"
          type="button"
          onClick={onDeleteAccount}
          disabled={status !== "idle"}
        >
          {status === "deleting" ? "Deleting..." : "Delete account"}
        </Button>
      </SettingBlockCard>
    </SettingsSectionCard>
  );
}
