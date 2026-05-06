import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  RouterProvider,
} from "@tanstack/react-router";
import { useState } from "react";

import { DashboardPage } from "@/components/screens/DashboardPage";
import { LoginPage } from "@/components/screens/LoginPage";

export type ExtensionSurface = "popup" | "sidepanel";

interface AppRouterProps {
  surface: ExtensionSurface;
}

export function AppRouter({ surface }: AppRouterProps) {
  const [router] = useState(() => createExtensionRouter(surface));

  return <RouterProvider router={router} />;
}

function createExtensionRouter(surface: ExtensionSurface) {
  const rootRoute = createRootRoute({
    component: Outlet,
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

  const routeTree = rootRoute.addChildren([
    indexRoute,
    loginRoute,
    dashboardRoute,
  ]);

  return createRouter({
    routeTree,
    history: createMemoryHistory({
      initialEntries: ["/login"],
    }),
  });
}
