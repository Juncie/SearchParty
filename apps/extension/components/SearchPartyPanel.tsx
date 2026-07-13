import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  RouterProvider,
  useRouterState,
} from "@tanstack/react-router";
import { useEffect, useState } from "react";

import type { ExtensionSurface } from "@/components/extension-surface";
import {
  BottomNav,
  EXTENSION_BOTTOM_NAV_SCROLL_PADDING,
  shouldShowExtensionBottomNav,
} from "@/components/navigation/BottomNav";
import { AccountSetupPage } from "@/components/screens/AccountSetupPage";
import { AutofillPage } from "@/components/screens/AutofillPage";
import { DashboardPage } from "@/components/screens/DashboardPage";
import { LoginPage } from "@/components/screens/LoginPage";
import { ProfileEditPage } from "@/components/screens/ProfileEditPage";
import { ProfileSetupPage } from "@/components/screens/ProfileSetupPage";
import { SaveJobPage } from "@/components/screens/SaveJobPage";
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

function ExtensionShell({
  surface,
}: SearchPartyPanelProps) {
  const isPopup = surface === "popup";
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });
  const showBottomNav =
    shouldShowExtensionBottomNav(pathname);

  return (
    <main
      className={cn(
        "shell",
        isPopup
          ? "shell-popup min-h-0 flex-1 flex-col"
          : "shell-sidepanel",
        "flex min-h-0 flex-col gap-0"
      )}
    >
      <div
        className="extension-outlet flex min-h-0 w-full min-w-0 max-w-full flex-1 flex-col overflow-y-auto"
        style={
          showBottomNav
            ? {
                paddingBottom:
                  EXTENSION_BOTTOM_NAV_SCROLL_PADDING,
              }
            : undefined
        }
      >
        <Outlet />
      </div>
      {showBottomNav ? <BottomNav /> : null}
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

  const autofillRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/autofill",
    component: () => <AutofillPage surface={surface} />,
  });

  const saveJobRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/jobs/save",
    component: () => <SaveJobPage surface={surface} />,
  });

  const newProfileRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/profiles/new",
    component: () => <ProfileSetupPage surface={surface} />,
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

  const accountSetupRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/settings/account",
    component: () => <AccountSetupPage surface={surface} />,
  });

  const routeTree = rootRoute.addChildren([
    indexRoute,
    loginRoute,
    dashboardRoute,
    autofillRoute,
    saveJobRoute,
    newProfileRoute,
    editProfileRoute,
    settingsRoute,
    accountSetupRoute,
  ]);

  return createRouter({
    routeTree,
    history: createMemoryHistory({
      initialEntries: ["/login"],
    }),
  });
}
