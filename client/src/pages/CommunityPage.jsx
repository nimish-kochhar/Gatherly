import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import PostCard from '../components/PostCard.jsx';
import { Button } from '../components/common';
import { MOCK_COMMUNITIES, MOCK_POSTS, formatCount } from '../data/mockData.js';

/**
 * CommunityPage — The individual community page at /c/:slug.
 *
 * Layout:
 *   ┌─────────────────────────────────────┐
 *   │ Banner (gradient) + community info  │
 *   ├───────────────────┬─────────────────┤
 *   │ Sort tabs + posts │ About sidebar   │
 *   └───────────────────┴─────────────────┘
 *
 * Shows filtered posts for this community, community description,
 * member counts, and a "Create Post" button.
 */
export default function CommunityPage() {
  const { slug } = useParams();
  const [sortBy, setSortBy] = useState('hot');
  const [joined, setJoined] = useState(false);

  const community = MOCK_COMMUNITIES.find((c) => c.slug === slug);
  const communityPosts = MOCK_POSTS.filter(
    (p) => p.community.slug === slug
  );

  // Gradient colors for banner based on community
  const bannerColors = [
    'from-primary-600 via-primary-700 to-primary-900',
    'from-accent-500 via-accent-600 to-accent-800',
    'from-success-500 via-success-600 to-success-800',
    'from-danger-500 via-danger-600 to-danger-800',
    'from-purple-500 via-purple-600 to-purple-800',
    'from-pink-500 via-pink-600 to-pink-800',
  ];

  if (!community) {
    return (
      <div className="card p-12 text-center">
        <h2 className="text-xl font-bold mb-2">Community not found</h2>
        <p className="text-secondary text-sm mb-4">
          The community &ldquo;g/{slug}&rdquo; doesn&apos;t exist or has been removed.
        </p>
        <Link to="/explore" className="text-primary-500 hover:text-primary-400 no-underline font-medium text-sm">
          ← Back to Explore
        </Link>
      </div>
    );
  }

  const bannerColor = bannerColors[community.id % bannerColors.length];

  return (
    <div>
      {/* ── Banner ── */}
      <div className={`-mx-6 -mt-6 mb-6 p-6 pb-8 bg-gradient-to-r ${bannerColor} relative overflow-hidden`}>
        {/* Decorative blob */}
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />

        <div className="relative z-10 flex items-end gap-4">
          {/* Community icon */}
          <div className="h-20 w-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/30 shadow-xl">
            <span className="text-white font-bold text-3xl">
              {community.name[0].toUpperCase()}
            </span>
          </div>

          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white">g/{community.name}</h1>
            <div className="flex items-center gap-4 mt-1">
              <span className="text-sm text-white/70">
                <span className="font-semibold text-white">{formatCount(community.memberCount)}</span> members
              </span>
              <span className="text-sm text-white/70">
                <span className="font-semibold text-white">{formatCount(community.postCount)}</span> posts
              </span>
            </div>
          </div>

          {/* Join / Joined button */}
          <Button
            variant={joined ? 'secondary' : 'primary'}
            size="md"
            onClick={() => setJoined(!joined)}
          >
            {joined ? '✓ Joined' : 'Join'}
          </Button>
        </div>
      </div>

      {/* ── Main content + sidebar ── */}
      <div className="flex gap-6">
        {/* Posts column */}
        <div className="flex-1 min-w-0">
          {/* Sort tabs */}
          <div className="card flex items-center gap-1 p-2 mb-4">
            {['hot', 'new', 'top'].map((tab) => (
              <button
                key={tab}
                onClick={() => setSortBy(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 capitalize ${
                  sortBy === tab
                    ? 'bg-primary-600/15 text-primary-500'
                    : 'text-surface-500 hover:bg-gray-100 dark:hover:bg-surface-800 hover:text-surface-800 dark:hover:text-surface-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Create post CTA */}
          <Link
            to="/create"
            className="card flex items-center gap-3 p-3 mb-4 no-underline hover:border-primary-500/50"
          >
            <div className="flex-1 px-4 py-2 rounded-full bg-gray-100 dark:bg-surface-800 text-sm text-surface-500 border border-gray-200 dark:border-surface-700">
              Post in g/{community.name}...
            </div>
          </Link>

          {/* Posts */}
          {communityPosts.length > 0 ? (
            <div className="space-y-3">
              {communityPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="card p-12 text-center">
              <p className="text-surface-500 text-sm mb-2">No posts in this community yet</p>
              <Link to="/create" className="text-primary-500 hover:text-primary-400 no-underline text-sm font-medium">
                Be the first to post →
              </Link>
            </div>
          )}
        </div>

        {/* About sidebar */}
        <div className="hidden xl:block w-72 shrink-0">
          <div className="card p-4 sticky top-20">
            <h3 className="text-sm font-semibold text-surface-800 dark:text-surface-200 mb-2">
              About g/{community.name}
            </h3>
            <p className="text-sm text-surface-500 dark:text-surface-400 leading-relaxed mb-4">
              {community.description}
            </p>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-surface-500">Members</span>
                <span className="font-semibold text-surface-800 dark:text-surface-200">{formatCount(community.memberCount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-surface-500">Posts</span>
                <span className="font-semibold text-surface-800 dark:text-surface-200">{formatCount(community.postCount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-surface-500">Created</span>
                <span className="font-semibold text-surface-800 dark:text-surface-200">
                  {new Date(community.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </span>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-surface-700 pt-3">
              <h4 className="text-xs font-semibold text-surface-500 uppercase mb-2">Rules</h4>
              <ol className="space-y-1.5 text-xs text-surface-600 dark:text-surface-400 list-decimal list-inside">
                <li>Be respectful and constructive</li>
                <li>No spam or self-promotion</li>
                <li>Stay on topic</li>
                <li>Use appropriate content tags</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
