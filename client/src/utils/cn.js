import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * cn — Merge Tailwind classes safely.
 *
 * Combines clsx (conditional class logic) with tailwind-merge
 * (deduplication of conflicting Tailwind utilities).
 *
 * Use this in every reusable component that accepts a `className` prop,
 * so that callers can override styles without specificity battles.
 *
 * @example
 *   cn('px-4 py-2', isActive && 'bg-primary-600', className)
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
