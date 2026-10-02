/**
 * Dialog — Accessible modal dialog built on Radix UI Dialog primitive.
 *
 * Improves over the existing Modal.jsx with:
 *   - Automatic focus trapping (Tab cycles within dialog)
 *   - Screen-reader announcements via aria-labelledby / aria-describedby
 *   - Body scroll-lock handled by Radix (no manual overflow manipulation)
 *   - Escape-to-close handled by Radix
 *   - Correct ARIA roles (dialog, alertdialog)
 *
 * Styled using Gatherly's existing surface tokens, not shadcn defaults.
 *
 * Usage:
 *   <Dialog open={isOpen} onOpenChange={setIsOpen}>
 *     <DialogContent title="My Dialog">
 *       <p>Content here</p>
 *     </DialogContent>
 *   </Dialog>
 *
 *   Or with a trigger:
 *   <Dialog>
 *     <DialogTrigger asChild><Button>Open</Button></DialogTrigger>
 *     <DialogContent title="My Dialog">...</DialogContent>
 *   </Dialog>
 */
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '../../utils/cn.js';

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogPortal = DialogPrimitive.Portal;
export const DialogClose = DialogPrimitive.Close;

export function DialogOverlay({ className, ...props }) {
  return (
    <DialogPrimitive.Overlay
      className={cn(
        'fixed inset-0 z-50 bg-black/60 backdrop-blur-sm',
        // Animate in/out
        'data-[state=open]:animate-in data-[state=closed]:animate-out',
        'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        className
      )}
      {...props}
    />
  );
}

/**
 * DialogContent — The dialog panel.
 *
 * Props:
 *   title       — string shown as the dialog's heading (used for aria-labelledby)
 *   description — optional accessible description text (screen-reader only if hidden)
 *   size        — 'sm' | 'md' | 'lg' | 'xl' (default: 'md')
 *   children    — dialog body
 *   className   — extra classes for the panel
 */
export function DialogContent({ className, title, description, size = 'md', children, ...props }) {
  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl',
  };

  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        className={cn(
          // Positioning
          'fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2',
          // Shape & surface
          'w-full rounded-2xl',
          'bg-white dark:bg-surface-900',
          'border border-surface-200 dark:border-surface-700',
          'shadow-2xl',
          // Animate in/out
          'data-[state=open]:animate-in data-[state=closed]:animate-out',
          'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
          'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
          'data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]',
          'data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]',
          // Sizing
          sizes[size],
          'p-0',
          className
        )}
        {...props}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-surface-200 dark:border-surface-700">
            <DialogPrimitive.Title className="text-lg font-semibold text-surface-900 dark:text-surface-100">
              {title}
            </DialogPrimitive.Title>
            <DialogPrimitive.Close
              className={cn(
                'rounded-lg p-1.5 transition-colors',
                'text-surface-400 hover:text-surface-700 dark:hover:text-surface-200',
                'hover:bg-surface-100 dark:hover:bg-surface-800',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500'
              )}
              aria-label="Close dialog"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </DialogPrimitive.Close>
          </div>
        )}

        {/* Optional accessible description (rendered but can be visually hidden) */}
        {description && (
          <DialogPrimitive.Description className="sr-only">
            {description}
          </DialogPrimitive.Description>
        )}

        {/* Body */}
        <div className="px-6 py-4">{children}</div>
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}

export function DialogHeader({ className, ...props }) {
  return (
    <div className={cn('flex flex-col gap-1.5 text-center sm:text-left', className)} {...props} />
  );
}

export function DialogFooter({ className, ...props }) {
  return (
    <div
      className={cn(
        'flex flex-col-reverse gap-2 px-6 pb-4 sm:flex-row sm:justify-end',
        className
      )}
      {...props}
    />
  );
}

export function DialogTitle({ className, ...props }) {
  return (
    <DialogPrimitive.Title
      className={cn('text-lg font-semibold text-surface-900 dark:text-surface-100', className)}
      {...props}
    />
  );
}

export function DialogDescription({ className, ...props }) {
  return (
    <DialogPrimitive.Description
      className={cn('text-sm text-surface-500 dark:text-surface-400', className)}
      {...props}
    />
  );
}
