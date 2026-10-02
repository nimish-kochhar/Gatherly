/**
 * DropdownMenu — Accessible dropdown built on Radix UI DropdownMenu primitive.
 *
 * Wraps Radix with Gatherly's surface/primary token classes.
 * Provides full keyboard navigation (Arrow keys, Enter, Escape, Tab),
 * correct ARIA roles, and focus management automatically.
 *
 * Re-exports all Radix sub-components under simpler names so callers
 * don't need to import from @radix-ui directly.
 *
 * Usage:
 *   <DropdownMenu>
 *     <DropdownMenuTrigger asChild>
 *       <button>Open</button>
 *     </DropdownMenuTrigger>
 *     <DropdownMenuContent>
 *       <DropdownMenuItem onSelect={() => {}}>Item</DropdownMenuItem>
 *       <DropdownMenuSeparator />
 *     </DropdownMenuContent>
 *   </DropdownMenu>
 */
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { cn } from '../../utils/cn.js';

export const DropdownMenu = DropdownMenuPrimitive.Root;
export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
export const DropdownMenuPortal = DropdownMenuPrimitive.Portal;
export const DropdownMenuGroup = DropdownMenuPrimitive.Group;
export const DropdownMenuSub = DropdownMenuPrimitive.Sub;
export const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

export function DropdownMenuContent({ className, sideOffset = 6, ...props }) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        sideOffset={sideOffset}
        className={cn(
          // Positioning & shape
          'z-50 min-w-[14rem] overflow-hidden rounded-xl',
          // Gatherly surface tokens
          'bg-white dark:bg-surface-850 border border-surface-200 dark:border-surface-700',
          // Elevation
          'shadow-xl',
          // Animate in/out using Radix data attributes
          'data-[state=open]:animate-in data-[state=closed]:animate-out',
          'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
          'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
          'data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2',
          'data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2',
          className
        )}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  );
}

export function DropdownMenuItem({ className, inset, ...props }) {
  return (
    <DropdownMenuPrimitive.Item
      className={cn(
        'relative flex cursor-pointer select-none items-center gap-3',
        'rounded-md px-3 py-2 text-sm outline-none transition-colors',
        // Default text colour — Gatherly surface tokens
        'text-surface-700 dark:text-surface-300',
        // Hover/focus highlight
        'focus:bg-surface-100 dark:focus:bg-surface-800',
        'focus:text-surface-900 dark:focus:text-surface-100',
        // Disabled state
        'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        inset && 'pl-8',
        className
      )}
      {...props}
    />
  );
}

export function DropdownMenuLabel({ className, inset, ...props }) {
  return (
    <DropdownMenuPrimitive.Label
      className={cn(
        'px-3 py-2 text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider',
        inset && 'pl-8',
        className
      )}
      {...props}
    />
  );
}

export function DropdownMenuSeparator({ className, ...props }) {
  return (
    <DropdownMenuPrimitive.Separator
      className={cn('my-1 h-px bg-surface-200 dark:bg-surface-700', className)}
      {...props}
    />
  );
}

export function DropdownMenuShortcut({ className, ...props }) {
  return (
    <span
      className={cn('ml-auto text-xs tracking-widest text-surface-400', className)}
      {...props}
    />
  );
}
