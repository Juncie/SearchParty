import type { useNavigate } from "@tanstack/react-router";

import { getAccountSetupResponse } from "@/lib/searchparty-api";

type NavigateFn = ReturnType<typeof useNavigate>;

/**
 * Routes an authenticated user based on onboarding state — newcomers (and
 * anyone whose `accountOnboardingCompletedAt` is still null) land on the
 * onboarding wizard, everyone else continues to the dashboard.
 *
 * Catches lookup errors so a transient `/api/account` failure cannot lock the
 * user out of the dashboard; in that case we fall back to the normal route.
 */
export async function navigateAfterAuth(navigate: NavigateFn): Promise<void> {
  try {
    const account = await getAccountSetupResponse();
    if (!account.accountOnboardingCompletedAt) {
      void navigate({ to: "/profiles/new" });
      return;
    }
  } catch {
    // Fall through to dashboard on lookup failure.
  }
  void navigate({ to: "/dashboard" });
}
