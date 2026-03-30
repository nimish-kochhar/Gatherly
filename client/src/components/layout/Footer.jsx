import { Link } from 'react-router-dom';

/**
 * Footer — Simple footer shown at the bottom of the main content area.
 * Contains navigation links and copyright.
 */
export default function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-surface-700/50 mt-8">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Links */}
          <div className="flex items-center gap-4 text-xs text-surface-500">
            <Link to="/home" className="hover:text-surface-300 no-underline">Home</Link>
            <Link to="/explore" className="hover:text-surface-300 no-underline">Explore</Link>
            <Link to="/popular" className="hover:text-surface-300 no-underline">Popular</Link>
          </div>

          {/* Copyright */}
          <p className="text-xs text-surface-600">
            © {new Date().getFullYear()} Gatherly. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
