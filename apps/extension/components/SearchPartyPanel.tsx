import { useCallback, useEffect, useState } from "react";

import type { HealthResponse } from "@searchparty/shared";
import type { ExtensionSurface } from "@/components/AppRouter";
import { Button } from "@/components/ui/button";
import { checkSearchPartyHealth } from "@/lib/searchparty-api";

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
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains("dark")
  );
  const isSidePanel = surface === "sidepanel";

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
    void refreshHealth();
  }, [refreshHealth]);

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
          <p className="error-message">{health.message}</p>
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

      <section className="next-card">
        <p className="island-kicker">Phase Boundary</p>
        <p>
          Foundation wiring is active. Profile management,
          autofill, ATS adapters, and AI generation remain
          intentionally out of scope.
        </p>
      </section>
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
