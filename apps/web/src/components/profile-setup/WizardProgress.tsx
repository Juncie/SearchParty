import { WizardProgressIndicator } from '#/components/ui/progress'

interface WizardProgressProps {
  /** Zero-based wizard index (covers review unless excluded by caller). */
  stepIndex: number
  /** Total steps counted for the bar denominator. */
  totalSteps: number
}

export function WizardProgress({ stepIndex, totalSteps }: WizardProgressProps) {
  const denominator = Math.max(1, totalSteps - 1)
  const value = Math.min(denominator, Math.max(0, stepIndex))
  const max = denominator

  return (
    <div className="grid gap-1.5" aria-live="polite">
      <span className="sr-only">{`Question progress: step ${stepIndex + 1} of ${totalSteps}`}</span>
      <WizardProgressIndicator value={value} max={max} />
    </div>
  )
}
