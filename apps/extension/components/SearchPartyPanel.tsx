import { useCallback, useEffect, useState } from "react";

import type { HealthResponse } from "@searchparty/shared";
import type { ExtensionSurface } from "@/components/AppRouter";
import { ProfileManager } from "@/components/profiles/ProfileManager";
import { Button } from "@/components/ui/button";
import {
  checkSearchPartyHealth,
  getAuthSession,
  signOut,
} from "@/lib/searchparty-api";
import { useNavigate } from "@tanstack/react-router";

interface SearchPartyPanelProps {
  surface: ExtensionSurface;
}

type HealthState =
  | { status: "idle" | "loading" }
  | { status: "connected"; data: HealthResponse }
  | { status: "error"; message: string };

export function SearchPartyPanel({
  surface,
}: SearchPartyPanelProps) {
  const [health, setHealth] = useState<HealthState>({
    status: "idle",
  });
  const [authError, setAuthError] = useState<string | null>(
    null
  );
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains("dark")
  );
  const isSidePanel = surface === "sidepanel";

  const navigate = useNavigate();

  const handleLogout = useCallback(async () => {
    setAuthError(null);
    try {
      await signOut();
      void navigate({ to: "/login" });
    } catch (error) {
      setAuthError(
        error instanceof Error
          ? error.message
          : "Unable to sign out. Please try again."
      );
    }
  }, [navigate]);

  const refreshHealth = useCallback(async () => {
    setHealth({ status: "loading" });

    try {
      setHealth({
        status: "connected",
        data: await checkSearchPartyHealth(),
      });
    } catch (error) {
      setHealth({
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "Unable to reach the SearchParty API",
      });
    }
  }, []);

  const toggleTheme = useCallback(() => {
    const nextIsDark =
      !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle(
      "dark",
      nextIsDark
    );
    setIsDark(nextIsDark);
  }, []);

  useEffect(() => {
    const verifySession = async () => {
      try {
        const currentSession = await getAuthSession();
        if (!currentSession?.session) {
          void navigate({ to: "/login" });
          return;
        }
      } catch {
        void navigate({ to: "/login" });
        return;
      }

      await refreshHealth();
    };

    void verifySession();
  }, [navigate, refreshHealth]);

  return (
    <main
      className={
        isSidePanel ? "shell shell-sidepanel" : "shell"
      }
    >
      <section className="hero-card space-y-4">
        <p>Search Party</p>
        <h1 className="display-title uppercase">
          Apply faster, stay in control.
        </h1>
        <p className="lede">
          The extension is connected to the local
          SearchParty web app and ready for the next product
          phase.
        </p>
        <div className="panel-actions">
          <Button
            className="panel-button"
            variant="outline"
            type="button"
            onClick={toggleTheme}
          >
            Theme: {isDark ? "Dark" : "Light"}
          </Button>
          <Button
            className="panel-button"
            type="button"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      </section>

      <section className="status-card" aria-live="polite">
        <div>
          <p className="island-kicker">Web API</p>
          <h2>{getStatusTitle(health)}</h2>
        </div>
        <StatusBadge health={health} />
        {health.status === "connected" ? (
          <dl className="status-details">
            <div>
              <dt>App</dt>
              <dd>{health.data.app}</dd>
            </div>
            <div>
              <dt>Checked</dt>
              <dd>
                {new Date(
                  health.data.timestamp
                ).toLocaleTimeString()}
              </dd>
            </div>
          </dl>
        ) : null}
        {health.status === "error" ? (
          <p className="error-message text-red-500">
            {health.message}
          </p>
        ) : null}
        {authError ? (
          <p className="error-message text-red-500">
            {authError}
          </p>
        ) : null}
        <Button
          className="panel-button"
          type="button"
          onClick={() => void refreshHealth()}
          disabled={health.status === "loading"}
        >
          {health.status === "loading"
            ? "Checking..."
            : "Check connection"}
        </Button>
      </section>

      <ProfileManager />
    </main>
  );
}

function StatusBadge({ health }: { health: HealthState }) {
  const label =
    health.status === "connected"
      ? "Connected"
      : health.status === "error"
        ? "Needs web app"
        : "Checking";

  return (
    <span className={`status-badge ${health.status}`}>
      {label}
    </span>
  );
}

function getStatusTitle(health: HealthState) {
  if (health.status === "connected")
    return "Connected to SearchParty";
  if (health.status === "error")
    return "Connection unavailable";
  return "Checking local API";
}
