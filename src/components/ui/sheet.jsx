import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

export function Sheet({ open, onOpenChange, children }) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      {children}
    </Dialog.Root>
  );
}

export function SheetContent({ className, children, title, description }) {
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-40 bg-ink/70 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in data-[state=closed]:animate-out data-[state=closed]:fade-out" />
      <Dialog.Content
        className={cn(
          'fixed inset-y-0 right-0 z-50 flex h-full w-full max-w-md flex-col bg-paper text-ink shadow-2xl',
          'data-[state=open]:animate-in data-[state=open]:slide-in-from-right data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right',
          className
        )}
      >
        <div className="flex items-start justify-between border-b border-paper-muted/15 p-6">
          <div>
            <Dialog.Title className="font-display text-lg font-semibold">{title}</Dialog.Title>
            {description && <Dialog.Description className="text-sm text-paper-muted">{description}</Dialog.Description>}
          </div>
          <Dialog.Close className="rounded-md p-1 text-paper-muted hover:bg-paper-dim hover:text-ink">
            <X className="h-5 w-5" />
          </Dialog.Close>
        </div>
        <div className="flex-1 overflow-y-auto p-6">{children}</div>
      </Dialog.Content>
    </Dialog.Portal>
  );
}
