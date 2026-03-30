import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Avatar } from '../components/common';
import PostCard from '../components/PostCard.jsx';
import { MOCK_USER, MOCK_POSTS, MOCK_COMMUNITIES, formatCount, timeAgo } from '../data/mockData.js';

/**
 * Profile — User profile page at /profile/:username.
 *
 * Layout:
 *   ┌─────────────────────────────────────────┐
 *   │ Profile header (avatar, bio, stats)     │
 *   ├───────────────────┬─────────────────────┤
 *   │ Tab content       │ Sidebar (commun.)   │
 *   │ (Posts/Comments)   │                    │
 *   └───────────────────┴─────────────────────┘
 *
 * Shows the user's posts, comment history, and community memberships.
 * Currently uses MOCK_USER data for any username.
 */
export default function Profile() {
  const { username } = useParams();
  const [activeTab, setActiveTab] = useState('posts');

  // Mock: use MOCK_USER for any profile
  const user = { ...MOCK_USER, username: username || MOCK_USER.username };
  const userPosts = MOCK_POSTS.filter((p) => p.author.username === username);

  const stats = [
    { label: 'Posts', value: userPosts.length || 12 },
    { label: 'Comments', value: 89 },
    { label: 'Karma', value: 2450 },
  ];

  const joinedDate = new Date(user.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div>
      {/* ── Profile Header ── */}
      <div className="card p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-start gap-5">
          <Avatar name={user.username} size="xl" />

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-xl font-bold">{user.username}</h1>
                <p className="text-sm text-surface-500 mt-0.5">
                  Joined {joinedDate}
                </p>
              </div>

              {/* Edit profile button (only for own profile) */}
              {user.username === MOCK_USER.username && (
                <Link
                  to="/settings"
                  className="px-4 py-1.5 rounded-lg border border-gray-300 dark:border-surface-600 text-sm font-medium text-surface-700 dark:text-surface-300 hover:bg-gray-100 dark:hover:bg-surface-800 transition-colors no-underline"
                >
                  Edit Profile
                </Link>
              )}
            </div>

            {/* Bio */}
            {user.bio && (
              <p className="text-sm text-surface-600 dark:text-surface-400 mt-3 leading-relaxed max-w-2xl">
                {user.bio}
              </p>
            )}

            {/* Stats */}
            <div className="flex items-center gap-6 mt-4">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-lg font-bold text-surface-900 dark:text-surface-100">
                    {formatCount(stat.value)}
                  </p>
                  <p className="text-xs text-surface-500">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Karma badge */}
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500/15 to-amber-600/15 border border-amber-500/20">
              <span className="text-amber-500 text-sm">⭐</span>
              <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                {formatCount(2450)} karma
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main content + sidebar ── */}
      <div className="flex gap-6">
        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Tabs */}
          <div className="card flex items-center gap-1 p-2 mb-4">
            {[
              { key: 'posts', label: 'Posts' },
              { key: 'comments', label: 'Comments' },
              { key: 'saved', label: 'Saved' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                  activeTab === tab.key
                    ? 'bg-primary-600/15 text-primary-500'
                    : 'text-surface-500 hover:bg-gray-100 dark:hover:bg-surface-800 hover:text-surface-800 dark:hover:text-surface-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          {activeTab === 'posts' && (
            <div className="space-y-3">
              {userPosts.length > 0 ? (
                userPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))
              ) : (
                // Show some posts when no exact match
                MOCK_POSTS.slice(0, 3).map((post) => (
                  <PostCard key={post.id} post={{ ...post, author: { ...post.author, username: user.username } }} />
                ))
              )}
            </div>
          )}

          {activeTab === 'comments' && (
            <div className="space-y-3">
              {/* Mock comment history */}
              {[
                { post: 'Optimizing React renders with useMemo', comment: 'Great tip! I use this pattern in production and it really helps.', community: 'reactjs', time: '2h ago' },
                { post: 'Best VS Code extensions for 2026', comment: 'Missing Prettier and ESLint from this list — they are essential!', community: 'webdev', time: '5h ago' },
                { post: 'How to structure a monorepo', comment: 'We switched to Turborepo last year and never looked back.', community: 'javascript', time: '1d ago' },
              ].map((item, i) => (
                <div key={i} className="card p-4">
                  <div className="flex items-center gap-2 text-xs text-surface-500 mb-2">
                    <span className="font-medium text-surface-700 dark:text-surface-300">g/{item.community}</span>
                    <span>•</span>
                    <span>{item.time}</span>
                  </div>
                  <p className="text-xs text-surface-500 mb-1">
                    Commented on: <span className="text-surface-800 dark:text-surface-200 font-medium">{item.post}</span>
                  </p>
                  <p className="text-sm text-surface-700 dark:text-surface-300 leading-relaxed">
                    {item.comment}
                  </p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'saved' && (
            <div className="card p-12 text-center">
              <p className="text-surface-500 text-sm">No saved posts yet</p>
              <p className="text-xs text-surface-400 mt-1">Posts you save will appear here</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="hidden xl:block w-72 shrink-0">
          <div className="card p-4 sticky top-20">
            <h3 className="text-sm font-semibold text-surface-800 dark:text-surface-200 mb-3">
              Communities
            </h3>
            <div className="space-y-2">
              {MOCK_COMMUNITIES.slice(0, 4).map((c) => (
                <Link
                  key={c.id}
                  to={`/c/${c.slug}`}
                  className="flex items-center gap-2.5 p-2 -mx-2 rounded-lg hover:bg-gray-100 dark:hover:bg-surface-800 transition-colors no-underline"
                >
                  <span className="h-7 w-7 rounded-full bg-gray-200 dark:bg-surface-700 flex items-center justify-center text-xs font-bold text-surface-600 dark:text-surface-300">
                    {c.name[0]}
                  </span>
                  <span className="text-sm text-surface-700 dark:text-surface-300 hover:text-primary-500 transition-colors">
                    g/{c.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
