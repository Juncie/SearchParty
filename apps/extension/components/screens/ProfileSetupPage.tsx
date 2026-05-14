import { useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";

import type { AccountSetupResponse } from "@searchparty/shared";

import type { ExtensionSurface } from "@/components/extension-surface";
import { HeroCard } from "@/components/HeroCard";
import { ProfileSetupWizard } from "@/components/profile-setup/ProfileSetupWizard";
import { Skeleton } from "@/components/ui/skeleton";
import {
  createApplicantProfile,
  getAccountSetupResponse,
  getAuthSession,
  markAccountOnboardingComplete,
} from "@/lib/searchparty-api";

interface ProfileSetupPageProps {
  surface: ExtensionSurface;
}

/**
 * Multi-step onboarding wizard. Drives both new-account eligibility and new-profile setup,
 * skipping the account section when the user has already completed it once.
 */
export function ProfileSetupPage({
  surface,
}: ProfileSetupPageProps) {
  void surface;
  const navigate = useNavigate();
  const [account, setAccount] =
    useState<AccountSetupResponse | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const bootstrap = async () => {
      try {
        const authSession = await getAuthSession();
        if (cancelled) return;
        if (!authSession?.session) {
          void navigate({ to: "/login" });
          return;
        }

        const accountResponse = await getAccountSetupResponse();
        if (cancelled) return;
        setAccount(accountResponse);
        setStatus("ready");
      } catch (loadError) {
        if (cancelled) return;
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load onboarding details.",
        );
        setStatus("error");
      }
    };

    void bootstrap();

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  const handleSubmit = useCallback(
    async (payload: {
      accountAnswers: Record<string, unknown>;
      profileInput: Parameters<typeof createApplicantProfile>[0];
    }) => {
      if (!account?.accountOnboardingCompletedAt) {
        await markAccountOnboardingComplete({
          answers: payload.accountAnswers,
        });
      }

      const profile = await createApplicantProfile(
        payload.profileInput,
      );

      void navigate({
        to: "/profiles/$profileId",
        params: { profileId: profile.id },
      });
    },
    [account?.accountOnboardingCompletedAt, navigate],
  );

  const isFirstTimeOnboarding =
    status === "ready" &&
    !account?.accountOnboardingCompletedAt;

  return (
    <main className="grid gap-6 pb-24">
      <HeroCard
        title="Set up profile"
        greeting={
          isFirstTimeOnboarding
            ? "Welcome to Search Party"
            : "Tell Search Party who you are"
        }
        description={
          isFirstTimeOnboarding
            ? "A short setup so we can apply on your behalf. You can refine details later."
            : "A few quick steps so the assistant can apply on your behalf."
        }
        action={
          isFirstTimeOnboarding
            ? undefined
            : () => void navigate({ to: "/dashboard" })
        }
        actionIcon={isFirstTimeOnboarding ? undefined : ArrowLeft}
        actionTitle={isFirstTimeOnboarding ? undefined : "Dashboard"}
      />

      {status === "loading" ? (
        <ProfileSetupSkeleton />
      ) : status === "error" ? (
        <p
          role="alert"
          className="rounded-lg border border-destructive/50 bg-destructive/15 px-3 py-2 text-destructive text-xs leading-relaxed"
        >
          {error ?? "Couldn't load onboarding."}
        </p>
      ) : account ? (
        <ProfileSetupWizard
          skipAccount={Boolean(account.accountOnboardingCompletedAt)}
          initialAnswers={{
            ...account.accountOnboardingAnswers,
            firstName: account.firstName,
            lastName: account.lastName,
            phone: account.phone,
          }}
          onSubmit={handleSubmit}
          onCancel={
            isFirstTimeOnboarding
              ? undefined
              : () => void navigate({ to: "/dashboard" })
          }
        />
      ) : null}
    </main>
  );
}

function ProfileSetupSkeleton() {
  return (
    <div className="grid gap-3 rounded-lg border border-border bg-card p-4">
      <Skeleton className="h-2 w-full rounded-full" />
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-14 w-full" />
      <Skeleton className="h-9 w-full rounded-[10px]" />
      <Skeleton className="h-9 w-full rounded-[10px]" />
      <div className="flex justify-between pt-2">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-32" />
      </div>
    </div>
  );
}
