import { useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";

import { HeroCard } from "@/components/HeroCard";
import { AppearanceSettingsSection } from "@/components/settings/AppearanceSettingsSection";
import { DangerZoneSection } from "@/components/settings/DangerZoneSection";
import { ProfileSettingsSection } from "@/components/settings/ProfileSettingsSection";
import type { ExtensionSurface } from "@/components/extension-surface";
import {
  getExtensionPreferences,
  setOpenBehaviorPreference,
  setThemePreference,
  type ExtensionOpenBehavior,
  type ExtensionThemePreference,
} from "@/lib/extension-preferences";
import {
  checkSearchPartyHealth,
  deleteCurrentUserAccount,
  getAuthSession,
  signOut,
  updateCurrentUser,
  type AuthSession,
} from "@/lib/searchparty-api";
import { ArrowLeft } from "lucide-react";

interface SettingsPageProps {
  surface: ExtensionSurface;
}

export function SettingsPage({ surface }: SettingsPageProps) {
  const navigate = useNavigate();
  const [session, setSession] = useState<AuthSession | null>(
    null
  );
  const [name, setName] = useState("");
  const [theme, setTheme] =
    useState<ExtensionThemePreference>("system");
  const [openBehavior, setOpenBehavior] =
    useState<ExtensionOpenBehavior>("sidepanel");
  const [deleteConfirmation, setDeleteConfirmation] =
    useState("");
  const [status, setStatus] = useState<
    | "loading"
    | "idle"
    | "saving"
    | "deleting"
    | "checking"
    | "signing-out"
  >("loading");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadSettings = useCallback(async () => {
    setStatus("loading");
    setError(null);

    try {
      const currentSession = await getAuthSession();
      if (!currentSession?.session) {
        void navigate({ to: "/login" });
        return;
      }

      const preferences = await getExtensionPreferences();
      setSession(currentSession);
      setName(currentSession.user.name);
      setTheme(preferences.theme);
      setOpenBehavior(preferences.openBehavior);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load settings."
      );
    } finally {
      setStatus("idle");
    }
  }, [navigate]);

  useEffect(() => {
    void loadSettings();
  }, [loadSettings]);

  const saveName = useCallback(async () => {
    setStatus("saving");
    setError(null);
    setMessage(null);

    try {
      const response = await updateCurrentUser({ name });
      setSession((current) =>
        current
          ? {
              ...current,
              user: {
                ...current.user,
                name: response.user.name,
              },
            }
          : current
      );
      setName(response.user.name);
      setMessage("Name updated.");
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Unable to update your name."
      );
    } finally {
      setStatus("idle");
    }
  }, [name]);

  const handleThemeChange = useCallback(
    async (nextTheme: ExtensionThemePreference) => {
      setTheme(nextTheme);
      await setThemePreference(nextTheme);
      setMessage("Theme preference saved.");
    },
    []
  );

  const handleOpenBehaviorChange = useCallback(
    async (nextBehavior: ExtensionOpenBehavior) => {
      setOpenBehavior(nextBehavior);
      await setOpenBehaviorPreference(nextBehavior);
      setMessage("Extension layout preference saved.");
    },
    []
  );

  const checkConnection = useCallback(async () => {
    setStatus("checking");
    setError(null);
    setMessage(null);

    try {
      const health = await checkSearchPartyHealth();
      setMessage(
        `Connected to ${health.app} at ${new Date(
          health.timestamp
        ).toLocaleTimeString()}.`
      );
    } catch (healthError) {
      setError(
        healthError instanceof Error
          ? healthError.message
          : "Unable to check connection."
      );
    } finally {
      setStatus("idle");
    }
  }, []);

  const deleteAccount = useCallback(async () => {
    if (deleteConfirmation !== "DELETE") {
      setError('Type "DELETE" to confirm account deletion.');
      return;
    }

    setStatus("deleting");
    setError(null);
    setMessage(null);

    try {
      await deleteCurrentUserAccount();
      try {
        await signOut();
      } catch {
        // Account deletion already invalidates the cascaded session.
      }
      void navigate({ to: "/login" });
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Unable to delete account."
      );
    } finally {
      setStatus("idle");
    }
  }, [deleteConfirmation, navigate]);

  const handleSignOut = useCallback(async () => {
    setStatus("signing-out");
    setError(null);
    setMessage(null);

    try {
      await signOut();
      void navigate({ to: "/login" });
    } catch (logoutError) {
      setError(
        logoutError instanceof Error
          ? logoutError.message
          : "Unable to sign out."
      );
      setStatus("idle");
    }
  }, [navigate]);

  return (
    <div className="grid items-start gap-3 @sm:grid-cols-2 @lg:grid-cols-6">
      <div className="col-span-full">
        <HeroCard
          title="Settings"
          greeting="Your workspace"
          description="Manage your extension experience, account details, and local connection."
          action={() => void navigate({ to: "/dashboard" })}
          actionTitle="Dashboard"
          actionIcon={ArrowLeft}
        />
      </div>

      <ProfileSettingsSection
        session={session}
        name={name}
        status={
          status === "saving" ||
          status === "checking" ||
          status === "signing-out"
            ? status
            : "idle"
        }
        onNameChange={setName}
        onSaveName={() => void saveName()}
        onCheckConnection={() => void checkConnection()}
        onSignOut={() => void handleSignOut()}
      />

      <AppearanceSettingsSection
        surface={surface}
        theme={theme}
        openBehavior={openBehavior}
        onThemeChange={(nextTheme) =>
          void handleThemeChange(nextTheme)
        }
        onOpenBehaviorChange={(nextBehavior) =>
          void handleOpenBehaviorChange(nextBehavior)
        }
      />

      <DangerZoneSection
        deleteConfirmation={deleteConfirmation}
        status={status === "deleting" ? "deleting" : "idle"}
        onDeleteConfirmationChange={setDeleteConfirmation}
        onDeleteAccount={() => void deleteAccount()}
      />

      {error || message ? (
        <div className="@sm:col-span-2 @lg:col-span-6 space-y-2">
          {error ? (
            <p className="error-message text-destructive">{error}</p>
          ) : null}
          {message ? <p className="panel-muted">{message}</p> : null}
        </div>
      ) : null}
    </div>
  );
}
