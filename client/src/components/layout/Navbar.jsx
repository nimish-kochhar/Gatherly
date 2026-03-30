import { useState, useRef, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Avatar } from '../common';
import { ThemeContext } from '../../context/ThemeContext.jsx';

/**
 * Navbar — Top navigation bar visible on every authenticated page.
 *
 * Contains:
 *   - Logo (links to home)
 *   - Search bar (navigates to /search on submit)
 *   - Action buttons: Create Post, Notifications
 *   - User avatar with dropdown menu (Profile, Settings, Logout)
 */
export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useContext(ThemeContext);

  // --- Close dropdown when clicking outside ---
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <nav className="sticky top-0 z-40 h-14 border-b border-gray-200 dark:border-surface-700/50 bg-white/80 dark:bg-surface-950/80 backdrop-blur-xl">
      <div className="flex items-center justify-between h-full px-4 max-w-[1400px] mx-auto">

        {/* ── Logo ── */}
        <Link to="/home" className="flex items-center gap-2 shrink-0 no-underline">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
            <span className="text-white font-bold text-sm">G</span>
          </div>
          <span className="text-lg font-bold text-surface-900 dark:text-surface-100 hidden sm:block">
            Gatherly
          </span>
        </Link>

        {/* ── Search bar ── */}
        <form onSubmit={handleSearch} className="flex-1 max-w-xl mx-4">
          <div className="relative">
            {/* Search icon */}
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Gatherly..."
              className="w-full pl-10 pr-4 py-2 text-sm rounded-full
                bg-gray-100 dark:bg-surface-800 border border-gray-300 dark:border-surface-700
                text-surface-900 dark:text-surface-100 placeholder:text-surface-500
                focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500
                transition-all duration-200"
            />
          </div>
        </form>

        {/* ── Right actions ── */}
        <div className="flex items-center gap-1">
          {/* Create Post */}
          <Link
            to="/create"
            className="interactive p-2 rounded-lg text-surface-500 dark:text-surface-400 hover:text-surface-800 dark:hover:text-surface-100 no-underline"
            title="Create Post"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </Link>

          {/* Notifications */}
          <Link
            to="/notifications"
            className="interactive p-2 rounded-lg text-surface-500 dark:text-surface-400 hover:text-surface-800 dark:hover:text-surface-100 relative no-underline"
            title="Notifications"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </Link>

          {/* Theme toggle (sun/moon) */}
          <button
            onClick={toggleTheme}
            className="interactive p-2 rounded-lg text-surface-500 dark:text-surface-400 hover:text-surface-800 dark:hover:text-surface-100"
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>

          {/* Chat */}
          <Link
            to="/chat"
            className="interactive p-2 rounded-lg text-surface-400 hover:text-surface-100 no-underline"
            title="Messages"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4-.8L3 21l1.8-5.2A7.956 7.956 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </Link>

          {/* User avatar + dropdown */}
          <div className="relative ml-1" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="interactive rounded-full"
            >
              <Avatar name="Demo User" size="sm" status="online" />
            </button>

            {/* Dropdown menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 py-2 bg-white dark:bg-surface-850 border border-gray-200 dark:border-surface-700 rounded-xl shadow-xl animate-fade-in-down z-50">
                {/* User info */}
                <div className="px-4 py-2 border-b border-gray-200 dark:border-surface-700">
                  <p className="text-sm font-medium">Demo User</p>
                  <p className="text-xs text-secondary">@demouser</p>
                </div>

                <div className="py-1">
                  <Link
                    to="/profile/demouser"
                    className="flex items-center gap-3 px-4 py-2 text-sm text-surface-600 dark:text-surface-300 hover:bg-gray-100 dark:hover:bg-surface-800 hover:text-surface-900 dark:hover:text-surface-100 no-underline"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="flex items-center gap-3 px-4 py-2 text-sm text-surface-600 dark:text-surface-300 hover:bg-gray-100 dark:hover:bg-surface-800 hover:text-surface-900 dark:hover:text-surface-100 no-underline"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Settings
                  </Link>
                </div>

                <div className="border-t border-gray-200 dark:border-surface-700 pt-1">
                  <button
                    className="flex items-center gap-3 w-full px-4 py-2 text-sm text-danger-400 hover:bg-gray-100 dark:hover:bg-surface-800"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Log Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
