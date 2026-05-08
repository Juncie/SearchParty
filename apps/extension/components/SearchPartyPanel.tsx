import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  RouterProvider,
} from "@tanstack/react-router";
import { useEffect, useState } from "react";

import type { ExtensionSurface } from "@/components/extension-surface";
import { DashboardPage } from "@/components/screens/DashboardPage";
import { LoginPage } from "@/components/screens/LoginPage";
import { ProfileEditPage } from "@/components/screens/ProfileEditPage";
import { SettingsPage } from "@/components/screens/SettingsPage";
import { applyStoredTheme } from "@/lib/extension-preferences";
import { cn } from "@/lib/utils";

interface SearchPartyPanelProps {
  surface: ExtensionSurface;
}

export function SearchPartyPanel({
  surface,
}: SearchPartyPanelProps) {
  const [router] = useState(() =>
    createExtensionRouter(surface)
  );

  useEffect(() => {
    void applyStoredTheme();
  }, []);

  return <RouterProvider router={router} />;
}

function ExtensionShell({ surface }: SearchPartyPanelProps) {
  const isPopup = surface === "popup";

  return (
    <main
      className={cn(
        "shell",
        isPopup
          ? "shell-popup min-h-0 flex-1 flex-col"
          : "shell-sidepanel",
      )}
    >
      <div className="extension-outlet flex min-h-0 w-full min-w-0 max-w-full flex-1 flex-col">
        <Outlet />
      </div>
    </main>
  );
}

function createExtensionRouter(surface: ExtensionSurface) {
  const rootRoute = createRootRoute({
    component: () => <ExtensionShell surface={surface} />,
  });

  const loginRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/login",
    component: () => <LoginPage surface={surface} />,
  });

  const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/",
    component: () => <LoginPage surface={surface} />,
  });

  const dashboardRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/dashboard",
    component: () => <DashboardPage surface={surface} />,
  });

  const newProfileRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/profiles/new",
    component: () => <ProfileEditPage surface={surface} />,
  });

  const editProfileRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/profiles/$profileId",
    component: () => {
      const { profileId } = editProfileRoute.useParams();

      return (
        <ProfileEditPage
          surface={surface}
          profileId={profileId}
        />
      );
    },
  });

  const settingsRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/settings",
    component: () => <SettingsPage surface={surface} />,
  });

  const routeTree = rootRoute.addChildren([
    indexRoute,
    loginRoute,
    dashboardRoute,
    newProfileRoute,
    editProfileRoute,
    settingsRoute,
  ]);

  return createRouter({
    routeTree,
    history: createMemoryHistory({
      initialEntries: ["/login"],
    }),
  });
}
