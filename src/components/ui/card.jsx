import { cn } from '../../lib/utils';

export function Card({ className, ...props }) {
  return <div className={cn('rounded-2xl bg-paper text-ink shadow-lg', className)} {...props} />;
}

export function CardHeader({ className, ...props }) {
  return <div className={cn('flex flex-col gap-1 p-6', className)} {...props} />;
}

export function CardTitle({ className, ...props }) {
  return <h2 className={cn('font-display text-xl font-semibold tracking-tight', className)} {...props} />;
}

export function CardDescription({ className, ...props }) {
  return <p className={cn('text-sm text-paper-muted', className)} {...props} />;
}

export function CardContent({ className, ...props }) {
  return <div className={cn('p-6 pt-0', className)} {...props} />;
}
