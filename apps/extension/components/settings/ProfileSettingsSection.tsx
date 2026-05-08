import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SettingBlockCard } from "@/components/settings/SettingBlockCard";
import { SettingsSectionCard } from "@/components/settings/SettingsSectionCard";
import type { AuthSession } from "@/lib/searchparty-api";

interface ProfileSettingsSectionProps {
  session: AuthSession | null;
  name: string;
  status: "idle" | "saving" | "checking" | "signing-out";
  onNameChange: (value: string) => void;
  onSaveName: () => void;
  onCheckConnection: () => void;
  onSignOut: () => void;
}

export function ProfileSettingsSection({
  session,
  name,
  status,
  onNameChange,
  onSaveName,
  onCheckConnection,
  onSignOut,
}: ProfileSettingsSectionProps) {
  return (
    <SettingsSectionCard title="Profile">
      <SettingBlockCard
        title="Personal information"
        description={`Signed in as ${session?.user.email ?? "loading..."}.`}
      >
        <Input
          value={name}
          onChange={(event) => onNameChange(event.target.value)}
          placeholder="Your name"
        />
        <div className="panel-actions">
          <Button
            type="button"
            onClick={onSaveName}
            disabled={status !== "idle"}
          >
            {status === "saving" ? "Saving..." : "Save name"}
          </Button>
          <Button
            variant="outline"
            type="button"
            onClick={onSignOut}
            disabled={status !== "idle"}
          >
            {status === "signing-out"
              ? "Signing out..."
              : "Sign out"}
          </Button>
        </div>
      </SettingBlockCard>

      <SettingBlockCard
        title="SearchParty web app"
        description="Verify the extension can reach the local web app."
      >
        <Button
          variant="outline"
          type="button"
          onClick={onCheckConnection}
          disabled={status !== "idle"}
        >
          {status === "checking" ? "Checking..." : "Check connection"}
        </Button>
      </SettingBlockCard>
    </SettingsSectionCard>
  );
}
