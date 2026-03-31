import { useState, useMemo, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import PostCard from '../components/PostCard.jsx';
import CommunityCard from '../components/CommunityCard.jsx';
import { Avatar } from '../components/common';
import { communityService } from '../services/community.service.js';
import { MOCK_POSTS } from '../data/mockData.js';

/**
 * Search — Full search page at /search.
 *
 * Features:
 *   - Large search input (auto-focuses)
 *   - Tabs to filter by result type: All / Posts / Communities / Users
 *   - Live client-side filtering on mock data
 *   - Results count
 *   - Empty states for no query and no results
 *
 * The query is stored in the URL via ?q= so it's shareable.
 * When the API exists, replace the local filter with a fetch call.
 */
export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [activeTab, setActiveTab] = useState('all');
  const [communityResults, setCommunityResults] = useState([]);

  const setQuery = (q) => {
    setSearchParams(q ? { q } : {});
  };

  // ── Search results ──
  const q = query.toLowerCase();

  const postResults = useMemo(
    () =>
      q
        ? MOCK_POSTS.filter(
            (p) =>
              p.title.toLowerCase().includes(q) ||
              p.content.toLowerCase().includes(q) ||
              p.author.username.toLowerCase().includes(q)
          )
        : [],
    [q]
  );

  // Fetch communities from API with debounce
  const fetchCommunities = useCallback(async (searchTerm) => {
    if (!searchTerm) {
      setCommunityResults([]);
      return;
    }
    try {
      const { data } = await communityService.list({ search: searchTerm, limit: 10 });
      setCommunityResults(data.communities || []);
    } catch (err) {
      console.error('Community search failed:', err);
      setCommunityResults([]);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => fetchCommunities(query), 300);
    return () => clearTimeout(timer);
  }, [query, fetchCommunities]);

  // Mock user results
  const mockUsers = [
    { id: 10, username: 'sarahdev', bio: 'React enthusiast & open-source contributor' },
    { id: 11, username: 'coderebel', bio: 'Full-stack developer, JS lover' },
    { id: 12, username: 'pixelperfect', bio: 'UI/UX designer creating beautiful interfaces' },
  ];
  const userResults = useMemo(
    () => (q ? mockUsers.filter((u) => u.username.toLowerCase().includes(q)) : []),
    [q]
  );

  const totalCount = postResults.length + communityResults.length + userResults.length;

  const tabs = [
    { key: 'all', label: 'All', count: totalCount },
    { key: 'posts', label: 'Posts', count: postResults.length },
    { key: 'communities', label: 'Communities', count: communityResults.length },
    { key: 'users', label: 'Users', count: userResults.length },
  ];

  return (
    <div className="max-w-3xl mx-auto">
      {/* ── Search input ── */}
      <div className="relative mb-6">
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400"
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
        <input
          autoFocus
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search posts, communities, and users..."
          className="w-full pl-12 pr-4 py-3.5 text-base rounded-2xl
            bg-white dark:bg-surface-800 border border-gray-300 dark:border-surface-700
            text-surface-900 dark:text-surface-100 placeholder:text-surface-400
            focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20
            transition-all duration-200 shadow-sm"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-surface-400 hover:text-surface-600 hover:bg-gray-100 dark:hover:bg-surface-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* ── No query state ── */}
      {!query && (
        <div className="card p-12 text-center">
          <div className="text-4xl mb-3">🔍</div>
          <h2 className="text-lg font-semibold mb-1">Search Gatherly</h2>
          <p className="text-sm text-surface-500">
            Find posts, communities, and people across the platform
          </p>
        </div>
      )}

      {/* ── Results ── */}
      {query && (
        <>
          {/* Tabs */}
          <div className="card flex items-center gap-1 p-2 mb-4">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                  activeTab === tab.key
                    ? 'bg-primary-600/15 text-primary-500'
                    : 'text-surface-500 hover:bg-gray-100 dark:hover:bg-surface-800'
                }`}
              >
                {tab.label}
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  activeTab === tab.key
                    ? 'bg-primary-500/20 text-primary-500'
                    : 'bg-gray-200 dark:bg-surface-700 text-surface-500'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Results count */}
          <p className="text-xs text-surface-500 mb-3 px-1">
            {totalCount} result{totalCount !== 1 ? 's' : ''} for &ldquo;{query}&rdquo;
          </p>

          {/* No results */}
          {totalCount === 0 && (
            <div className="card p-12 text-center">
              <div className="text-4xl mb-3">😕</div>
              <h3 className="text-base font-semibold mb-1">No results found</h3>
              <p className="text-sm text-surface-500">
                Try different keywords or check your spelling
              </p>
            </div>
          )}

          {/* Post results */}
          {(activeTab === 'all' || activeTab === 'posts') && postResults.length > 0 && (
            <div className="mb-6">
              {activeTab === 'all' && (
                <h3 className="text-xs font-semibold uppercase text-surface-500 mb-2 px-1">Posts</h3>
              )}
              <div className="space-y-3">
                {postResults.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </div>
          )}

          {/* Community results */}
          {(activeTab === 'all' || activeTab === 'communities') && communityResults.length > 0 && (
            <div className="mb-6">
              {activeTab === 'all' && (
                <h3 className="text-xs font-semibold uppercase text-surface-500 mb-2 px-1">Communities</h3>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {communityResults.map((c) => (
                  <CommunityCard key={c.id} community={c} />
                ))}
              </div>
            </div>
          )}

          {/* User results */}
          {(activeTab === 'all' || activeTab === 'users') && userResults.length > 0 && (
            <div className="mb-6">
              {activeTab === 'all' && (
                <h3 className="text-xs font-semibold uppercase text-surface-500 mb-2 px-1">Users</h3>
              )}
              <div className="space-y-2">
                {userResults.map((user) => (
                  <Link
                    key={user.id}
                    to={`/profile/${user.username}`}
                    className="card flex items-center gap-3 p-3 hover:border-primary-500/30 no-underline"
                  >
                    <Avatar name={user.username} size="md" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-surface-900 dark:text-surface-100">
                        {user.username}
                      </p>
                      {user.bio && (
                        <p className="text-xs text-surface-500 truncate">{user.bio}</p>
                      )}
                    </div>
                    <span className="text-xs text-primary-500 font-medium">View Profile</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
