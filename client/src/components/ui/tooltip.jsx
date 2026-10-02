/**
 * Tooltip — Accessible tooltip built on Radix UI Tooltip primitive.
 *
 * Provides keyboard and hover-triggered tooltips with correct ARIA roles.
 * Required for all icon-only interactive elements (buttons without visible text).
 *
 * The TooltipProvider must wrap the app (or a subtree) once.
 * It is added to App.jsx.
 *
 * Usage:
 *   <Tooltip content="Create Post">
 *     <button aria-label="Create Post"><PlusIcon /></button>
 *   </Tooltip>
 *
 *   Or with full composition:
 *   <TooltipProvider>
 *     <Tooltip>
 *       <TooltipTrigger asChild><button>...</button></TooltipTrigger>
 *       <TooltipContent>Tooltip text</TooltipContent>
 *     </Tooltip>
 *   </TooltipProvider>
 */
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { cn } from '../../utils/cn.js';

export const TooltipProvider = TooltipPrimitive.Provider;
export const TooltipRoot = TooltipPrimitive.Root;
export const TooltipTrigger = TooltipPrimitive.Trigger;

export function TooltipContent({ className, sideOffset = 6, ...props }) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        sideOffset={sideOffset}
        className={cn(
          // Shape & surface — Gatherly dark surface tokens
          'z-50 overflow-hidden rounded-lg',
          'bg-surface-800 dark:bg-surface-700',
          'border border-surface-700 dark:border-surface-600',
          'px-3 py-1.5',
          // Typography
          'text-xs font-medium text-surface-100',
          // Shadow
          'shadow-lg',
          // Animate
          'data-[state=delayed-open]:data-[side=top]:animate-in',
          'data-[state=delayed-open]:data-[side=bottom]:animate-in',
          'data-[state=delayed-open]:data-[side=left]:animate-in',
          'data-[state=delayed-open]:data-[side=right]:animate-in',
          'data-[state=delayed-open]:fade-in-0 data-[state=delayed-open]:zoom-in-95',
          className
        )}
        {...props}
      />
    </TooltipPrimitive.Portal>
  );
}

/**
 * Tooltip — Convenience wrapper for the common single-tooltip case.
 *
 * Props:
 *   content    — tooltip text or JSX
 *   side       — 'top' | 'bottom' | 'left' | 'right' (default: 'bottom')
 *   delayDuration — ms before tooltip appears (default: 400)
 *   children   — the trigger element (must be a single focusable element)
 */
export function Tooltip({ children, content, side = 'bottom', delayDuration = 400 }) {
  return (
    <TooltipRoot delayDuration={delayDuration}>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side={side}>{content}</TooltipContent>
    </TooltipRoot>
  );
}
