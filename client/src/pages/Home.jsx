import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PostCard from '../components/PostCard.jsx';
import { postService } from '../services/post.service.js';
import { MOCK_COMMUNITIES, formatCount } from '../data/mockData.js';

/**
 * Home — The main feed page at /home.
 *
 * Fetches posts from the backend API. Falls back to an empty state
 * if the backend isn't available or returns no posts.
 *
 * The right sidebar widget still uses MOCK_COMMUNITIES until
 * a communities API endpoint is built.
 */
export default function Home() {
  const [sortBy, setSortBy] = useState('hot');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, [sortBy]);

  async function fetchPosts() {
    setLoading(true);
    setError(null);
    try {
      const { data } = await postService.list({ sort: sortBy, limit: 20, offset: 0 });
      // Normalize backend response to match PostCard expected shape
      const normalized = (data.posts || []).map((p) => ({
        id: p.id,
        title: p.title,
        content: p.body || '',
        author: p.author || { id: 0, username: 'unknown' },
        community: p.community || { id: 0, name: 'General', slug: 'general' },
        upvotes: p.upvotes || 0,
        downvotes: p.downvotes || 0,
        commentCount: p.commentCount || 0,
        createdAt: p.createdAt,
        image: null,
      }));
      setPosts(normalized);
    } catch (err) {
      console.error('Failed to fetch posts:', err);
      setError('Could not load posts. The server may be unavailable.');
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }

  const sortTabs = [
    { key: 'hot', label: 'Hot', icon: '🔥' },
    { key: 'new', label: 'New', icon: '✨' },
    { key: 'top', label: 'Top', icon: '📈' },
  ];

  return (
    <div className="flex gap-6">
      {/* ── Main feed column ── */}
      <div className="flex-1 min-w-0">
        {/* Sort tabs */}
        <div className="card flex items-center gap-1 p-2 mb-4">
          {sortTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSortBy(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                sortBy === tab.key
                  ? 'bg-primary-600/15 text-primary-500'
                  : 'text-surface-500 hover:bg-gray-100 dark:hover:bg-surface-800 hover:text-surface-800 dark:hover:text-surface-200'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Create post prompt */}
        <Link
          to="/create"
          className="card flex items-center gap-3 p-3 mb-4 no-underline hover:border-primary-500/50"
        >
          <div className="h-9 w-9 rounded-full bg-gray-200 dark:bg-surface-700 flex items-center justify-center text-surface-400">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div className="flex-1 px-4 py-2 rounded-full bg-gray-100 dark:bg-surface-800 text-sm text-surface-500 border border-gray-200 dark:border-surface-700">
            What&apos;s on your mind?
          </div>
          <button
            onClick={(e) => e.preventDefault()}
            className="p-2 rounded-lg text-surface-400 hover:text-primary-500 hover:bg-gray-100 dark:hover:bg-surface-800 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
            </svg>
          </button>
        </Link>

        {/* Post feed */}
        <div className="space-y-3">
          {loading && (
            <div className="card p-8 text-center">
              <div className="inline-block w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mb-3" />
              <p className="text-sm text-surface-500">Loading posts...</p>
            </div>
          )}

          {error && !loading && (
            <div className="card p-6 text-center">
              <p className="text-sm text-surface-500 mb-3">{error}</p>
              <button
                onClick={fetchPosts}
                className="text-sm text-primary-500 hover:text-primary-400 font-medium"
              >
                Try again
              </button>
            </div>
          )}

          {!loading && !error && posts.length === 0 && (
            <div className="card p-8 text-center">
              <p className="text-lg mb-1">🌱</p>
              <p className="text-sm font-medium text-surface-700 dark:text-surface-300">No posts yet</p>
              <p className="text-xs text-surface-500 mt-1">Be the first to share something!</p>
            </div>
          )}

          {!loading && posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>

      {/* ── Right sidebar widget (xl+ only) ── */}
      <div className="hidden xl:block w-72 shrink-0">
        <div className="card p-4 sticky top-20">
          <h3 className="text-sm font-semibold text-surface-800 dark:text-surface-200 mb-3">
            🔥 Trending Communities
          </h3>
          <div className="space-y-2.5">
            {MOCK_COMMUNITIES.slice(0, 5).map((c, i) => (
              <Link
                key={c.id}
                to={`/c/${c.slug}`}
                className="flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-gray-100 dark:hover:bg-surface-800 transition-colors no-underline group"
              >
                <span className="text-sm font-semibold text-surface-500 w-5">{i + 1}</span>
                <span className="h-8 w-8 rounded-full bg-gray-200 dark:bg-surface-700 flex items-center justify-center text-xs font-bold text-surface-600 dark:text-surface-300 shrink-0">
                  {c.name[0]}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-surface-800 dark:text-surface-200 group-hover:text-primary-500 transition-colors truncate">
                    g/{c.name}
                  </p>
                  <p className="text-xs text-surface-500">
                    {formatCount(c.memberCount)} members
                  </p>
                </div>
              </Link>
            ))}
          </div>

          <Link
            to="/explore"
            className="block mt-3 pt-3 border-t border-gray-200 dark:border-surface-700 text-xs text-primary-500 hover:text-primary-400 no-underline font-medium text-center"
          >
            View all communities →
          </Link>
        </div>
      </div>
    </div>
  );
}
