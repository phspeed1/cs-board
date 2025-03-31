"use client";

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default: "bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] hover:bg-[var(--primary-hover)]",
        outline: "bg-[var(--btn-secondary-bg)] text-[var(--btn-secondary-text)] border border-[var(--btn-secondary-border)] hover:bg-[var(--primary)] hover:text-white",
        bordered: "bg-[var(--btn-primary-bg)] text-gray-500 border border-[var(--primary)] hover:bg-[var(--primary-hover)]",
        secondary: "bg-[var(--secondary)] text-white hover:bg-[var(--secondary-hover)]",
        destructive: "bg-[var(--destructive)] text-white hover:bg-[var(--destructive)]/90",
        ghost: "hover:bg-[var(--background)] hover:text-[var(--foreground)]",
        link: "text-[var(--primary)] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3 text-xs",
        lg: "h-11 px-8 text-base",
        icon: "h-10 w-10",
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
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants } 