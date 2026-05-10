import type { ExtensionSurface } from "@/components/extension-surface";
import { SettingBlockCard } from "@/components/settings/SettingBlockCard";
import { SettingsSectionCard } from "@/components/settings/SettingsSectionCard";
import type {
  ExtensionOpenBehavior,
  ExtensionThemePreference,
} from "@/lib/extension-preferences";

interface AppearanceSettingsSectionProps {
  surface: ExtensionSurface;
  theme: ExtensionThemePreference;
  openBehavior: ExtensionOpenBehavior;
  onThemeChange: (theme: ExtensionThemePreference) => void;
  onOpenBehaviorChange: (
    openBehavior: ExtensionOpenBehavior
  ) => void;
}

export function AppearanceSettingsSection({
  surface,
  theme,
  openBehavior,
  onThemeChange,
  onOpenBehaviorChange,
}: AppearanceSettingsSectionProps) {
  return (
    <SettingsSectionCard title="Appearance">
      <SettingBlockCard title="Theme">
        <select
          className="flex h-9 w-full rounded-[10px] border border-input bg-input/10 px-3.5 py-2 text-sm focus-visible:border-primary/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring/40"
          value={theme}
          onChange={(event) =>
            onThemeChange(
              event.target.value as ExtensionThemePreference
            )
          }
        >
          <option value="system">System</option>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </SettingBlockCard>

      <SettingBlockCard
        title="Open behavior"
        description={`Current: ${surface[0].toUpperCase() + surface.slice(1)}. This controls what happens when you click the toolbar icon.`}
      >
        <select
          className="flex h-9 w-full rounded-[10px] border border-input bg-input/10 px-3.5 py-2 text-sm focus-visible:border-primary/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring/40"
          value={openBehavior}
          onChange={(event) =>
            onOpenBehaviorChange(
              event.target.value as ExtensionOpenBehavior
            )
          }
        >
          <option value="sidepanel">Open side panel</option>
          <option value="popup">Open popup</option>
        </select>
      </SettingBlockCard>
    </SettingsSectionCard>
  );
}
