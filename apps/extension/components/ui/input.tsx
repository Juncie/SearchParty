import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const inputVariants = cva(
  "flex w-full rounded-[10px] border border-input bg-input/10 px-3.5 py-2 text-sm ring-offset-background transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring/40 focus-visible:border-primary/50 focus-visible:bg-background/50 hover:bg-input/20 hover:border-input/80 disabled:cursor-not-allowed disabled:opacity-50 md:text-xs/relaxed dark:bg-input/20 dark:hover:bg-input/30",
  {
    variants: {
      inputSize: {
        default: "h-9",
        sm: "h-8 px-3 text-xs",
        lg: "h-10 px-4 text-base",
        xl: "h-12 px-5 text-lg",
      },
    },
    defaultVariants: {
      inputSize: "default",
    },
  }
)

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, inputSize, type, ...props }, ref) => {
    return (
      <input
        type={type}
        data-slot="input"
        className={cn(inputVariants({ inputSize, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
