import { ButtonHTMLAttributes, forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { clsx } from "clsx";

const buttonVariants = cva(
  "flex cursor-pointer items-center justify-center overflow-hidden rounded-lg font-bold leading-normal tracking-[0.015em] transition-colors",
  {
    variants: {
      variant: {
        default: "bg-[var(--brand-orange)] text-[var(--brand-purple)] hover:brightness-110",
        secondary: "bg-[var(--brand-purple)] text-white hover:brightness-110",
        outline: "border border-[var(--brand-orange)] bg-transparent text-[var(--brand-orange)] hover:bg-[color-mix(in_srgb,var(--brand-orange)_12%,transparent)]",
        ghost: "bg-transparent hover:bg-gray-100 dark:hover:bg-[#192633] text-gray-700 dark:text-white",
      },
      size: {
        default: "h-10 px-4 text-sm",
        sm: "h-8 px-3 text-xs",
        lg: "h-12 px-5 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={clsx(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };



