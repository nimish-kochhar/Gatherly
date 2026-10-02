/**
 * Input — Standardized text input component.
 *
 * Uses Gatherly's existing focus ring, border, and surface tokens.
 * Accepts all native <input> props plus a className override.
 *
 * Why standardize:
 *   Several pages (CreatePost, Settings, Search) define their own inline
 *   input classes inconsistently. This component gives one canonical
 *   Gatherly-styled input.
 *
 * Usage:
 *   <Input type="text" placeholder="Search..." value={q} onChange={...} />
 *   <Input type="email" className="w-full" />
 */
import { cn } from '../../utils/cn.js';

export function Input({ className, type = 'text', ...props }) {
  return (
    <input
      type={type}
      className={cn(
        // Layout
        'w-full',
        // Shape
        'rounded-lg',
        // Padding & typography
        'px-3 py-2 text-sm',
        // Surface — Gatherly tokens
        'bg-surface-100 dark:bg-surface-800',
        'border border-surface-300 dark:border-surface-700',
        'text-surface-900 dark:text-surface-100',
        'placeholder:text-surface-500',
        // Focus
        'focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500',
        // Transition
        'transition-colors duration-150',
        // Disabled
        'disabled:opacity-50 disabled:cursor-not-allowed',
        className
      )}
      {...props}
    />
  );
}
