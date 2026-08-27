import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "tap-feedback focus-app inline-flex items-center justify-center whitespace-nowrap rounded-control text-sm font-bold transition-colors duration-fast ease-app disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-apex-blue text-white shadow-action hover:bg-blue-700",
        secondary: "bg-apex-navy text-white shadow-sm hover:bg-slate-900",
        outline: "border border-border bg-apex-surface text-apex-ink shadow-sm hover:bg-apex-soft",
        ghost: "text-apex-muted hover:bg-apex-soft hover:text-apex-ink",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90"
      },
      size: {
        default: "h-12 px-5 py-2",
        sm: "h-9 rounded-xl px-3",
        lg: "h-12 rounded-control px-6 text-base",
        icon: "h-11 w-11"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
