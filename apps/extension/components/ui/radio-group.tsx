import * as React from "react";

import { cn } from "@/lib/utils";

interface RadioGroupProps {
  /** Shared `name` for native radio clustering. */
  name: string;
  /** Accessible name for the group (not shown visually). */
  groupLabel: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly string[];
  className?: string;
  disabled?: boolean;
}

/**
 * Single-choice tile list using native radios — keyboard friendly, dense for the extension panel.
 */
function RadioGroupCard({
  name,
  groupLabel,
  value,
  onChange,
  options,
  className,
  disabled,
}: RadioGroupProps) {
  const groupId = React.useId();
  return (
    <div
      role="radiogroup"
      aria-labelledby={`${groupId}-legend`}
      className={cn("grid gap-2", className)}
    >
      <span id={`${groupId}-legend`} className="sr-only">
        {groupLabel}
      </span>
      {options.map((opt) => {
        const optId = `${groupId}-${opt.replace(/\s+/g, "-").toLowerCase()}`;
        return (
          <label
            key={opt}
            htmlFor={optId}
            className={cn(
              "flex cursor-pointer items-start gap-2.5 rounded-[10px] border border-border bg-card px-3 py-2.5 ring-1 ring-foreground/5 transition-colors hover:bg-accent has-disabled:cursor-not-allowed has-disabled:opacity-50 has-checked:border-primary has-checked:ring-primary/20"
            )}
          >
            <span className="grid size-9 shrink-0 place-content-center rounded-md border border-input bg-background has-data-[state=checked]:border-primary has-data-[state=checked]:bg-primary/10 dark:bg-input/20">
              <input
                id={optId}
                type="radio"
                name={name}
                value={opt}
                checked={value === opt}
                disabled={disabled}
                data-slot="radio"
                data-state={
                  value === opt ? "checked" : "unchecked"
                }
                onChange={() => {
                  onChange(opt);
                }}
                className="size-3.5 cursor-pointer accent-primary"
              />
            </span>
            <span className="flex-1 text-xs leading-relaxed text-foreground">
              {opt}
            </span>
          </label>
        );
      })}
    </div>
  );
}

export { RadioGroupCard };
