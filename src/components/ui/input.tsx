import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const inputVariants = cva(
  "flex w-full rounded-md border bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm transition-all duration-200",
  {
    variants: {
      variant: {
        default: "border-input",
        battle: "bg-battle-card border-battle-gold/30 text-white placeholder:text-gray-400 focus-visible:ring-battle-gold focus-visible:border-battle-gold hover-glow",
        "battle-price": "bg-battle-primary border-2 border-battle-gold text-center text-amount font-extrabold text-battle-gold placeholder:text-battle-gold/50 focus-visible:ring-battle-gold focus-visible:glow-gold",
        error: "border-red-500 focus-visible:ring-red-500 bg-red-50 dark:bg-red-950/20",
        success: "border-green-500 focus-visible:ring-green-500 bg-green-50 dark:bg-green-950/20",
      },
      size: {
        default: "h-10",
        sm: "h-8 text-sm",
        lg: "h-12 text-lg",
        xl: "h-16 text-xl",
        massive: "h-20 text-2xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface InputProps
  extends React.ComponentProps<"input">,
    VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, size, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input, inputVariants }
