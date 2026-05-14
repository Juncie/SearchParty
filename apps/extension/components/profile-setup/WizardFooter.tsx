import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface WizardFooterProps {
  onBack?: () => void;
  /** False on the opening step unless account-only funnel with no precedent. */
  canGoBack?: boolean;
  onPrimary: () => void;
  primaryLabel: string;
  primaryDisabled?: boolean;
  secondaryLabel?: string;
  onSecondary?: () => void;
  isBusy?: boolean;
}

/**
 * Responsive navigation rails for onboarding — keeps taps large and reachable.
 */
export function WizardFooter({
  onBack,
  canGoBack,
  onPrimary,
  primaryLabel,
  primaryDisabled,
  secondaryLabel,
  onSecondary,
  isBusy,
}: WizardFooterProps) {
  return (
    <footer className="flex flex-col gap-4 w-full sm:flex-row sm:justify-between">
    

      {secondaryLabel && onSecondary && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={isBusy}
          onClick={onSecondary}
        >
          {secondaryLabel}
        </Button>
      )}
       
      <Button
        type="button"
        variant="default"
        size="lg"
        disabled={primaryDisabled || isBusy}
        onClick={onPrimary}
        className="gap-2"
        aria-busy={isBusy ?? false}
      >
        {isBusy && (
          <Loader2
            aria-hidden
            className="size-3.5 shrink-0 animate-spin"
          />
        )}
        {primaryLabel}
      </Button>
      <Button
        type="button"
        variant="outline"
        size="lg"
        disabled={!canGoBack || isBusy}
        onClick={onBack}
        className={cn(canGoBack ? "" : "invisible hidden", "w-full")}
      >
        Back
      </Button>
    </footer>
  );
}
