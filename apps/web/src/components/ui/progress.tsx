import * as React from 'react'

import { cn } from '#/lib/utils.ts'

interface ProgressRingProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number
  max?: number
}

/**
 * Thin determinate progress bar for multi-step flows.
 */
function WizardProgressIndicator({
  value,
  max = 100,
  className,
  ...props
}: ProgressRingProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100))
  const safePct = Number.isFinite(pct) ? pct : 0

  return (
    <div
      {...props}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      className={cn('h-1.5 w-full overflow-hidden rounded-full bg-muted', className)}
    >
      <div
        className="h-full rounded-full bg-primary transition-[width] duration-200 ease-out"
        style={{
          width: `${safePct}%`,
        }}
      />
    </div>
  )
}

export { WizardProgressIndicator }
