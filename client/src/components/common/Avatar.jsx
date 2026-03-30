/**
 * Avatar — Displays a user's profile picture or their initials as fallback.
 *
 * Props:
 *   src      — image URL (optional, falls back to initials)
 *   alt      — alt text for the image
 *   name     — user's name, used to generate initials when no image
 *   size     — "xs" | "sm" | "md" | "lg" | "xl" (default: "md")
 *   status   — "online" | "offline" | null (shows a status dot)
 *   className — extra classes
 */
export default function Avatar({
  src,
  alt = '',
  name = '',
  size = 'md',
  status = null,
  className = '',
}) {
  // --- Size mappings (pixel dimensions + text size for initials) ---
  const sizes = {
    xs: 'h-6 w-6 text-2xs',
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
    xl: 'h-16 w-16 text-lg',
  };

  // --- Status dot sizes (scales with avatar) ---
  const statusSizes = {
    xs: 'h-1.5 w-1.5',
    sm: 'h-2 w-2',
    md: 'h-2.5 w-2.5',
    lg: 'h-3 w-3',
    xl: 'h-3.5 w-3.5',
  };

  // --- Generate initials from name (e.g. "John Doe" → "JD") ---
  const initials = name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  // --- Pick a consistent background color based on the name ---
  const bgColors = [
    'bg-primary-600',
    'bg-accent-600',
    'bg-success-600',
    'bg-purple-600',
    'bg-pink-600',
    'bg-teal-600',
    'bg-indigo-600',
  ];
  const colorIndex = name
    .split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const bgColor = bgColors[colorIndex % bgColors.length];

  return (
    <div className={`relative inline-flex shrink-0 ${className}`}>
      {src ? (
        // --- Image avatar ---
        <img
          src={src}
          alt={alt || name}
          className={`
            ${sizes[size]}
            rounded-full object-cover
            ring-2 ring-surface-800
          `}
        />
      ) : (
        // --- Initials fallback ---
        <div
          className={`
            ${sizes[size]} ${bgColor}
            rounded-full
            flex items-center justify-center
            font-semibold text-white
            ring-2 ring-surface-800
          `}
        >
          {initials || '?'}
        </div>
      )}

      {/* --- Online/offline status dot --- */}
      {status && (
        <span
          className={`
            absolute bottom-0 right-0
            ${statusSizes[size]}
            rounded-full
            ring-2 ring-surface-900
            ${status === 'online' ? 'bg-success-500' : 'bg-surface-500'}
          `}
        />
      )}
    </div>
  );
}
