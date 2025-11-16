import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        // Battle System Variants
        "battle-gold": "bg-gradient-gold text-black font-bold hover-lift press-scale hover-glow-gold shadow-lg",
        "battle-blue": "bg-gradient-blue text-white font-bold hover-lift press-scale hover-glow-blue shadow-lg",
        "battle-red": "bg-gradient-red text-white font-bold hover-lift press-scale hover-glow-red shadow-lg",
        "battle-win": "bg-gradient-gold text-black font-extrabold hover-lift press-scale hover-glow-gold shadow-xl border-2 border-yellow-400",
        "battle-lose": "bg-gradient-red text-white font-extrabold hover-lift press-scale hover-glow-red shadow-xl border-2 border-red-400",
        "battle-premium": "bg-battle-card border-2 border-battle-gold text-battle-gold font-bold hover-lift press-scale hover-glow-gold glass-morphism-dark",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
        // Battle System Sizes
        "battle-xl": "h-16 px-12 py-4 text-lg font-bold rounded-xl",
        "battle-massive": "h-20 px-16 py-6 text-xl font-extrabold rounded-2xl",
        "battle-split": "h-32 w-full text-2xl font-black rounded-2xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
