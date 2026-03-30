/**
 * Button — Reusable button component with multiple variants and sizes.
 *
 * Props:
 *   variant  — "primary" | "secondary" | "ghost" | "danger" (default: "primary")
 *   size     — "sm" | "md" | "lg" (default: "md")
 *   loading  — boolean, shows spinner and disables the button
 *   disabled — boolean
 *   fullWidth — boolean, makes button take full container width
 *   children — button label / content
 *   ...rest  — any native <button> props (onClick, type, etc.)
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  className = '',
  ...props
}) {
  // --- Variant styles (background, text, borders) ---
  const variants = {
    primary:
      'bg-primary-600 text-white hover:bg-primary-500 active:bg-primary-700 focus-visible:ring-primary-500',
    secondary:
      'bg-surface-700 text-surface-100 hover:bg-surface-600 active:bg-surface-800 border border-surface-600 focus-visible:ring-surface-400',
    ghost:
      'bg-transparent text-surface-300 hover:bg-surface-800 hover:text-surface-100 active:bg-surface-700',
    danger:
      'bg-danger-600 text-white hover:bg-danger-500 active:bg-danger-600 focus-visible:ring-danger-500',
  };

  // --- Size styles (padding, font size) ---
  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-2.5 text-base',
  };

  const isDisabled = disabled || loading;

  return (
    <button
      className={`
        inline-flex items-center justify-center gap-2
        font-medium rounded-lg
        transition-all duration-150
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-900
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `.trim()}
      disabled={isDisabled}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      )}
      {children}
    </button>
  );
}
