import { forwardRef } from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-lg font-body font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stamp-amber focus-visible:ring-offset-2 focus-visible:ring-offset-ink disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        primary: 'bg-stamp-amber text-ink hover:brightness-110 active:brightness-95 shadow-sm',
        success: 'bg-ledger-green text-paper hover:brightness-110 active:brightness-95',
        ghost: 'bg-transparent text-paper hover:bg-ink-raised',
        outline: 'border border-ink-muted/40 text-paper hover:bg-ink-raised',
        destructive: 'bg-alert-coral text-paper hover:brightness-110',
      },
      size: {
        default: 'h-10 px-4 text-sm',
        sm: 'h-8 px-3 text-sm',
        lg: 'h-12 px-6 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  }
);

const Button = forwardRef(({ className, variant, size, ...props }, ref) => (
  <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
));
Button.displayName = 'Button';

export { Button, buttonVariants };
