interface StepHeaderProps {
  /** 1-based index for labeling. */
  stepNumber: number;
  /** Total countable steps including the review milestone. */
  stepCount: number;
  title: string;
  description?: string;
}

/**
 * Compact eyebrow + headline + helper line for each wizard step.
 */
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
        <h1 className="text-lg font-semibold tracking-tight text-foreground">
          {title}
        </h1>
        {description && (
          <p className="max-w-xl text-muted-foreground text-xs/relaxed">
            {description}
          </p>
        )}
      </div>
    </header>
  );
}
