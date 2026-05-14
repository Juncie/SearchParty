import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { SettingBlockCard } from "@/components/settings/SettingBlockCard";
import { SettingsSectionCard } from "@/components/settings/SettingsSectionCard";
import type { AuthSession } from "@/lib/searchparty-api";

interface ProfileSettingsSectionProps {
  session: AuthSession | null;
  name: string;
  status: "idle" | "saving" | "checking" | "signing-out";
  onNameChange: (value: string) => void;
  onSaveName: () => void;
  onSignOut: () => void;
  onEditAccount: () => void;
}

export function ProfileSettingsSection({
  session,
  name,
  status,
  onNameChange,
  onSaveName,
  onSignOut,
  onEditAccount,
}: ProfileSettingsSectionProps) {
  return (
    <SettingBlockCard
      title="Global account"
      description="Edit your core details and custom URLs."
      className="col-span-full"
    >
      <Button
        variant="outline"
        type="button"
        onClick={onEditAccount}
        disabled={status !== "idle"}
      >
        Edit Account Details
      </Button>
      <Button
        variant="secondary"
        type="button"
        onClick={onSignOut}
        disabled={status !== "idle"}
      >
        Logout
      </Button>
    </SettingBlockCard>
  );
}
