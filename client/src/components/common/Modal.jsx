import { useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';

/**
 * Modal — An overlay dialog box rendered via React Portal.
 *
 * How Portals work:
 *   React normally renders components inside their parent DOM element.
 *   A Portal renders the component at a completely different place in the DOM
 *   (in this case, directly on document.body). This ensures the modal always
 *   appears on top of everything else, regardless of parent z-index or overflow.
 *
 * Props:
 *   isOpen    — boolean, controls visibility
 *   onClose   — function called when the modal should close
 *   title     — optional header text
 *   size      — "sm" | "md" | "lg" | "xl" (default: "md")
 *   children  — modal body content
 *   className — extra classes for the content area
 */
export default function Modal({
  isOpen,
  onClose,
  title,
  size = 'md',
  children,
  className = '',
}) {
  // --- Close on Escape key ---
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Prevent body scrolling while modal is open
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  // --- Don't render anything if closed ---
  if (!isOpen) return null;

  // --- Width based on size ---
  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl',
  };

  // --- Render via Portal ---
  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop (semi-transparent overlay) — click to close */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal content box */}
      <div
        className={`
          relative w-full ${sizes[size]}
          bg-surface-900 border border-surface-700
          rounded-2xl shadow-2xl
          animate-scale-in
          ${className}
        `}
      >
        {/* Header (optional) */}
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-surface-700">
            <h2 className="text-lg font-semibold">{title}</h2>
            <button
              onClick={onClose}
              className="interactive p-1.5 rounded-lg text-surface-400 hover:text-surface-200"
              aria-label="Close modal"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Body */}
        <div className="px-6 py-4">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
