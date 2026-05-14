import { Loader2 } from 'lucide-react'

import { Button } from '#/components/ui/button'
import { cn } from '#/lib/utils.ts'

interface WizardFooterProps {
  onBack?: () => void
  /** False on the opening step unless account-only funnel with no precedent. */
  canGoBack?: boolean
  onPrimary: () => void
  primaryLabel: string
  primaryDisabled?: boolean
  secondaryLabel?: string
  onSecondary?: () => void
  isBusy?: boolean
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
    <footer className="@container/footer flex flex-col gap-2 border-t border-border pt-4 sm:flex-row sm:justify-between">
      <div className="flex gap-2 sm:justify-start">
        <Button
          type="button"
          variant="outline"
          disabled={!canGoBack || isBusy}
          onClick={onBack}
          className={cn(canGoBack ? '' : 'invisible')}
        >
          Back
        </Button>
      </div>
      <div className="flex gap-2 sm:justify-end">
        {secondaryLabel && onSecondary ? (
          <Button
            type="button"
            variant="ghost"
            disabled={isBusy}
            onClick={onSecondary}
          >
            {secondaryLabel}
          </Button>
        ) : null}
        <Button
          type="button"
          variant="default"
          disabled={primaryDisabled || isBusy}
          onClick={onPrimary}
          className="min-h-10 min-w-24 gap-2"
          aria-busy={isBusy ?? false}
        >
          {isBusy ? (
            <Loader2 aria-hidden className="size-3.5 shrink-0 animate-spin" />
          ) : null}
          {primaryLabel}
        </Button>
      </div>
    </footer>
  )
}
