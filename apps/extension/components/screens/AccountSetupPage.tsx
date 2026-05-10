import { useNavigate } from "@tanstack/react-router";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { AccountSetup } from "@searchparty/shared";
import { AccountCustomUrlsCard } from "@/components/account-setup/AccountCustomUrlsCard";
import { AccountPersonalInfoCard } from "@/components/account-setup/AccountPersonalInfoCard";
import { AccountSetupDirtySaveBar } from "@/components/account-setup/AccountSetupDirtySaveBar";
import { AccountSetupFeedback } from "@/components/account-setup/AccountSetupFeedback";
import type { ExtensionSurface } from "@/components/extension-surface";
import { HeroCard } from "@/components/HeroCard";
import {
  getAccountSetup,
  updateAccountSetup,
} from "@/lib/searchparty-api";

interface AccountSetupPageProps {
  surface: ExtensionSurface;
}

export function AccountSetupPage({
  surface,
}: AccountSetupPageProps) {
  void surface;
  const navigate = useNavigate();
  const [initialSetup, setInitialSetup] =
    useState<AccountSetup | null>(null);
  const [setup, setSetup] = useState<AccountSetup>({
    firstName: "",
    lastName: "",
    phone: "",
    addressStreet: "",
    addressState: "",
    addressCity: "",
    addressZip: "",
    addressUnit: "",
    urls: [],
  });
  const [status, setStatus] = useState<
    "loading" | "idle" | "saving"
  >("loading");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(
    null
  );

  useEffect(() => {
    setStatus("loading");
    getAccountSetup()
      .then((data) => {
        setSetup(data);
        setInitialSetup(data);
        setStatus("idle");
      })
      .catch((err) => {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load account setup."
        );
        setStatus("idle");
      });
  }, []);

  const isDirty = useMemo(() => {
    if (!initialSetup) return false;
    return (
      JSON.stringify(setup) !== JSON.stringify(initialSetup)
    );
  }, [setup, initialSetup]);

  const saveSetup = useCallback(async () => {
    setStatus("saving");
    setError(null);
    setMessage(null);

    try {
      const updated = await updateAccountSetup(setup);
      setSetup(updated);
      setInitialSetup(updated);
      setMessage("Account details saved successfully.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to save account setup."
      );
    } finally {
      setStatus("idle");
    }
  }, [setup]);

  return (
    <main className="grid gap-6 pb-24">
      <HeroCard
        title="Account details"
        greeting="Global profile"
        description="Set your foundational details here. These will be available for autofill across all your profiles."
        action={() => void navigate({ to: "/settings" })}
        actionTitle="Settings"
      />

      <AccountPersonalInfoCard
        setup={setup}
        onSetupChange={setSetup}
      />

      <AccountCustomUrlsCard
        setup={setup}
        onSetupChange={setSetup}
      />

      <AccountSetupFeedback
        error={error}
        message={message}
      />

      <AccountSetupDirtySaveBar
        visible={isDirty}
        isSaving={status === "saving"}
        onSave={saveSetup}
      />
    </main>
  );
}
