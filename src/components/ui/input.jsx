import { forwardRef } from 'react';
import { cn } from '../../lib/utils';

const Input = forwardRef(({ className, type, ...props }, ref) => (
  <input
    type={type}
    ref={ref}
    className={cn(
      'flex h-10 w-full rounded-lg border border-paper-muted/25 bg-paper px-3 py-2 text-sm text-ink placeholder:text-paper-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stamp-amber disabled:opacity-50',
      className
    )}
    {...props}
  />
));
Input.displayName = 'Input';

export { Input };
