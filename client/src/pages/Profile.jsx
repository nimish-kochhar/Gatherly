import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Avatar } from '../components/common';
import PostCard from '../components/PostCard.jsx';
import useAuth from '../hooks/useAuth.js';
import { communityService } from '../services/community.service.js';
import { postService } from '../services/post.service.js';
import { formatCount } from '../utils/index.js';

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
 * Fetches real post data from the API.
 */
export default function Profile() {
  const { username } = useParams();
  const [activeTab, setActiveTab] = useState('posts');
  const { user: currentUser } = useAuth();
  const [profileCommunities, setProfileCommunities] = useState([]);
  const [userPosts, setUserPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);

  // Use the route param as the profile username
  const profileUsername = username || currentUser?.username || 'unknown';
  const user = {
    username: profileUsername,
    bio: currentUser?.username === profileUsername ? (currentUser?.bio || '') : '',
    createdAt: currentUser?.username === profileUsername ? (currentUser?.createdAt || new Date().toISOString()) : new Date().toISOString(),
    karma: currentUser?.username === profileUsername ? (currentUser?.karma || 0) : 0,
  };

  useEffect(() => {
    fetchCommunities();
  }, []);

  useEffect(() => {
    fetchUserPosts();
  }, [profileUsername]);

  async function fetchCommunities() {
    try {
      const { data } = await communityService.list({ limit: 4, offset: 0 });
      setProfileCommunities(data.communities || []);
    } catch (err) {
      console.error('Failed to fetch communities:', err);
      setProfileCommunities([]);
    }
  }

  async function fetchUserPosts() {
    setPostsLoading(true);
    try {
      const { data } = await postService.list({ limit: 20, offset: 0 });
      // Filter by author username on the client side
      const filtered = (data.posts || [])
        .filter((p) => p.author?.username === profileUsername)
        .map((p) => ({
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
      setUserPosts(filtered);
    } catch (err) {
      console.error('Failed to fetch user posts:', err);
      setUserPosts([]);
    } finally {
      setPostsLoading(false);
    }
  }

  const stats = [
    { label: 'Posts', value: userPosts.length },
    { label: 'Comments', value: 0 },
    { label: 'Karma', value: user.karma },
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
              {currentUser && user.username === currentUser.username && (
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
                {formatCount(user.karma)} karma
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
              {postsLoading ? (
                <div className="card p-8 text-center">
                  <div className="inline-block w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mb-3" />
                  <p className="text-sm text-surface-500">Loading posts...</p>
                </div>
              ) : userPosts.length > 0 ? (
                userPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))
              ) : (
                <div className="card p-8 text-center">
                  <p className="text-sm text-surface-500">No posts yet</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'comments' && (
            <div className="card p-12 text-center">
              <p className="text-surface-500 text-sm">No comment history available yet</p>
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
              {profileCommunities.length > 0 ? profileCommunities.map((c) => (
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
              )) : (
                <p className="text-xs text-surface-500">No communities yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
