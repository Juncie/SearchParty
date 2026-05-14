/**
 * Lightweight step eyebrow plus title/description for onboarding screens.
 */

interface StepHeaderProps {
  /** 1-based index for labeling. */
  stepNumber: number
  /** Total countable steps including this review milestone. */
  stepCount: number
  title: string
  description?: string
}

export function StepHeader({
  stepNumber,
  stepCount,
  title,
  description,
}: StepHeaderProps) {
  return (
    <header className="grid gap-2">
      <p className="island-kicker">
        Step {stepNumber} of {stepCount}
      </p>
      <div className="grid gap-1">
        <h1 className="font-heading text-xl font-semibold tracking-tight text-foreground normal-case">
          {title}
        </h1>
        {description ? (
          <p className="max-w-xl text-muted-foreground text-xs/relaxed">
            {description}
          </p>
        ) : null}
      </div>
    </header>
  )
}
