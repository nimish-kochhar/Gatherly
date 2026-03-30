import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';

/**
 * Sidebar — Left navigation panel visible on authenticated pages.
 *
 * Contains:
 *   - Main nav links (Home, Explore, Popular) using NavLink for active highlighting
 *   - "Your Communities" section with collapsible community list
 *   - Create Community button
 *
 * NavLink vs Link:
 *   Link just navigates. NavLink automatically knows if its route is active
 *   and applies a special class — we use this to highlight the current page.
 */

// Mock communities (replaced with real data when API is ready)
const MOCK_COMMUNITIES = [
  { id: 1, name: 'reactjs', slug: 'reactjs' },
  { id: 2, name: 'javascript', slug: 'javascript' },
  { id: 3, name: 'webdev', slug: 'webdev' },
  { id: 4, name: 'design', slug: 'design' },
  { id: 5, name: 'gaming', slug: 'gaming' },
];

export default function Sidebar() {
  const [communitiesExpanded, setCommunitiesExpanded] = useState(true);

  // Helper: style function for NavLink (active vs inactive)
  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 no-underline ${
      isActive
        ? 'bg-primary-600/15 text-primary-500 dark:text-primary-400'
        : 'text-surface-600 dark:text-surface-400 hover:bg-gray-100 dark:hover:bg-surface-800 hover:text-surface-900 dark:hover:text-surface-200'
    }`;

  return (
    <aside className="w-64 shrink-0 h-[calc(100vh-3.5rem)] sticky top-14 overflow-y-auto scrollbar-thin border-r border-gray-200 dark:border-surface-700/50 bg-gray-50 dark:bg-surface-950/50">
      <div className="p-3 space-y-6">

        {/* ── Main Navigation ── */}
        <nav className="space-y-1">
          <NavLink to="/home" className={navLinkClass}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Home
          </NavLink>

          <NavLink to="/explore" className={navLinkClass}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Explore
          </NavLink>

          <NavLink to="/popular" className={navLinkClass}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            Popular
          </NavLink>
        </nav>

        {/* ── Divider ── */}
        <div className="divider" />

        {/* ── Your Communities ── */}
        <div>
          <div className="flex items-center justify-between px-3 mb-2">
            <h3 className="text-xs font-semibold text-surface-500 uppercase tracking-wider">
              Your Communities
            </h3>
            <button
              onClick={() => setCommunitiesExpanded((prev) => !prev)}
              className="text-surface-500 hover:text-surface-200 transition-colors"
              title={communitiesExpanded ? 'Collapse communities' : 'Expand communities'}
            >
              {communitiesExpanded ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              )}
            </button>
          </div>

          {communitiesExpanded && (
            <nav className="space-y-0.5">
              {MOCK_COMMUNITIES.map((community) => (
                <NavLink
                  key={community.id}
                  to={`/c/${community.slug}`}
                  className={navLinkClass}
                >
                  {/* Community icon (colored circle with first letter) */}
                  <span className="h-6 w-6 rounded-full bg-gray-200 dark:bg-surface-700 flex items-center justify-center text-xs font-bold text-surface-600 dark:text-surface-300">
                    {community.name[0].toUpperCase()}
                  </span>
                  <span className="truncate">g/{community.name}</span>
                </NavLink>
              ))}
            </nav>
          )}
        </div>

        {/* ── Divider ── */}
        <div className="divider" />

        {/* ── Create Community CTA ── */}
        <Link
          to="/create-community"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-surface-600 dark:text-surface-400 hover:bg-gray-100 dark:hover:bg-surface-800 hover:text-surface-900 dark:hover:text-surface-200 transition-all duration-150 no-underline"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Create Community
        </Link>
      </div>
    </aside>
  );
}
