import * as React from "react";

import { cn } from "@/lib/utils";

export type TextareaProps =
  React.ComponentProps<"textarea">;

/**
 * Multiline text input aligned with the shared Input sizing and focus treatment.
 */
const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  TextareaProps
>(({ className, rows = 4, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      data-slot="textarea"
      rows={rows}
      className={cn(
        "min-h-17 w-full resize-y rounded-[10px] border border-input bg-input/10 px-3.5 py-2 text-sm ring-offset-background transition-all duration-200 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring/40 focus-visible:border-primary/50 focus-visible:bg-background/50 hover:bg-input/20 hover:border-input/80 disabled:cursor-not-allowed disabled:opacity-50 md:text-xs/relaxed dark:bg-input/20 dark:hover:bg-input/30",
        className
      )}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
