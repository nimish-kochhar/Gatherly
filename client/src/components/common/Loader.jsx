/**
 * Loader — Shows loading state via a spinner or skeleton placeholders.
 *
 * Usage:
 *   <Loader />                         → Centered spinning circle
 *   <Loader variant="skeleton" />      → Single skeleton bar
 *   <Loader variant="skeleton" lines={3} /> → Multiple skeleton bars
 *   <Loader variant="card" />          → Card-shaped skeleton placeholder
 *
 * Props:
 *   variant — "spinner" | "skeleton" | "card" (default: "spinner")
 *   size    — "sm" | "md" | "lg" (spinner size, default: "md")
 *   lines   — number of skeleton lines to show (default: 1)
 *   className — extra classes
 */
export default function Loader({
  variant = 'spinner',
  size = 'md',
  lines = 1,
  className = '',
}) {
  // --- Spinner variant ---
  if (variant === 'spinner') {
    const spinnerSizes = {
      sm: 'h-5 w-5',
      md: 'h-8 w-8',
      lg: 'h-12 w-12',
    };

    return (
      <div className={`flex items-center justify-center py-8 ${className}`}>
        <svg
          className={`animate-spin-slow text-primary-500 ${spinnerSizes[size]}`}
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            className="opacity-20"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="3"
          />
          <path
            className="opacity-80"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      </div>
    );
  }

  // --- Card skeleton variant (mimics a PostCard loading state) ---
  if (variant === 'card') {
    return (
      <div className={`card p-4 space-y-3 animate-fade-in ${className}`}>
        {/* Header: avatar + username */}
        <div className="flex items-center gap-3">
          <div className="skeleton h-8 w-8 rounded-full" />
          <div className="skeleton h-3 w-24 rounded" />
          <div className="skeleton h-3 w-16 rounded ml-auto" />
        </div>
        {/* Title */}
        <div className="skeleton h-4 w-3/4 rounded" />
        {/* Body lines */}
        <div className="space-y-2">
          <div className="skeleton h-3 w-full rounded" />
          <div className="skeleton h-3 w-5/6 rounded" />
        </div>
        {/* Action bar */}
        <div className="flex gap-4 pt-1">
          <div className="skeleton h-6 w-16 rounded" />
          <div className="skeleton h-6 w-16 rounded" />
          <div className="skeleton h-6 w-16 rounded" />
        </div>
      </div>
    );
  }

  // --- Skeleton lines variant ---
  return (
    <div className={`space-y-2.5 animate-fade-in ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="skeleton h-3 rounded"
          style={{ width: `${100 - i * 15}%` }}
        />
      ))}
    </div>
  );
}
