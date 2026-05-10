import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, PenLine, Settings } from "lucide-react";

import { cn } from "@/lib/utils";

const tabBase =
  "flex min-h-9 cursor-pointer flex-1 flex-col items-center justify-center gap-0.5 rounded-[10px] px-2 py-1.5 text-xs font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring/40";

/** Matches fixed bar height + padding used by `ExtensionShell` scroll outlet. */
export const EXTENSION_BOTTOM_NAV_SCROLL_PADDING =
  "calc(3.75rem + env(safe-area-inset-bottom, 0px))";

export function BottomNav() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  const dashboardActive = pathname === "/dashboard";
  const autofillActive = pathname === "/autofill";
  const settingsActive =
    pathname === "/settings" ||
    pathname.startsWith("/settings/");

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-50 flex w-full max-w-none border-t border-border bg-card/95 backdrop-blur-[4px] pt-1 pb-[max(0.25rem,env(safe-area-inset-bottom,0px))] ring-1 ring-foreground/10"
    >
      <div className="flex w-full min-w-0 gap-1 px-2 pb-1 sm:px-3">
        <Link
          to="/dashboard"
          aria-current={dashboardActive ? "page" : undefined}
          className={cn(
            tabBase,
            dashboardActive
              ? "bg-accent text-accent-foreground shadow-[inset_0_1px_0_var(--inset-glint)]"
              : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
          )}
        >
          <LayoutDashboard
            aria-hidden
            className="size-4 shrink-0"
            strokeWidth={2}
          />
          <span className="leading-none">Dashboard</span>
        </Link>

        <Link
          to="/autofill"
          aria-current={autofillActive ? "page" : undefined}
          className={cn(
            tabBase,
            autofillActive
              ? "bg-accent text-accent-foreground shadow-[inset_0_1px_0_var(--inset-glint)]"
              : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
          )}
        >
          <PenLine
            aria-hidden
            className="size-4 shrink-0"
            strokeWidth={2}
          />
          <span className="leading-none">Autofill</span>
        </Link>

        <Link
          to="/settings"
          aria-current={settingsActive ? "page" : undefined}
          className={cn(
            tabBase,
            settingsActive
              ? "bg-accent text-accent-foreground shadow-[inset_0_1px_0_var(--inset-glint)]"
              : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
          )}
        >
          <Settings
            aria-hidden
            className="size-4 shrink-0"
            strokeWidth={2}
          />
          <span className="leading-none">Settings</span>
        </Link>
      </div>
    </nav>
  );
}
