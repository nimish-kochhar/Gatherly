import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import PostCard from '../components/PostCard.jsx';
import { Button } from '../components/common';
import { communityService } from '../services/community.service.js';
import { postService } from '../services/post.service.js';
import { AuthContext } from '../context/AuthContext.jsx';

/**
 * CommunityPage — The individual community page at /c/:slug.
 *
 * Fetches community data and posts from the backend API.
 * Supports join/leave functionality.
 */
export default function CommunityPage() {
  const { slug } = useParams();
  const auth = useContext(AuthContext);
  const [sortBy, setSortBy] = useState('hot');
  const [community, setCommunity] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [joined, setJoined] = useState(false);
  const [joinLoading, setJoinLoading] = useState(false);

  // Gradient colors for banner based on community id
  const bannerGradients = [
    'linear-gradient(135deg, #6366f1, #4338ca, #312e81)',
    'linear-gradient(135deg, #f59e0b, #d97706, #92400e)',
    'linear-gradient(135deg, #10b981, #059669, #065f46)',
    'linear-gradient(135deg, #ef4444, #dc2626, #991b1b)',
    'linear-gradient(135deg, #8b5cf6, #7c3aed, #5b21b6)',
    'linear-gradient(135deg, #ec4899, #db2777, #9d174d)',
  ];

  useEffect(() => {
    fetchCommunity();
  }, [slug]);

  useEffect(() => {
    if (community) {
      fetchPosts();
    }
  }, [community?.id, sortBy]);

  async function fetchCommunity() {
    setLoading(true);
    setError(null);
    try {
      const { data } = await communityService.getBySlug(slug);
      setCommunity(data);
      setJoined(data.isMember || false);
    } catch (err) {
      console.error('Failed to fetch community:', err);
      setError(err.response?.status === 404 ? 'not_found' : 'error');
      setCommunity(null);
    } finally {
      setLoading(false);
    }
  }

  async function fetchPosts() {
    setPostsLoading(true);
    try {
      const { data } = await postService.list({
        sort: sortBy,
        limit: 20,
        offset: 0,
        communityId: community.id,
      });
      const normalized = (data.posts || []).map((p) => ({
        id: p.id,
        title: p.title,
        content: p.body || '',
        author: p.author || { id: 0, username: 'unknown' },
        community: p.community || { id: community.id, name: community.name, slug: community.slug },
        upvotes: p.upvotes || 0,
        downvotes: p.downvotes || 0,
        commentCount: p.commentCount || 0,
        createdAt: p.createdAt,
        image: null,
      }));
      setPosts(normalized);
    } catch (err) {
      console.error('Failed to fetch community posts:', err);
      setPosts([]);
    } finally {
      setPostsLoading(false);
    }
  }

  async function handleJoinToggle() {
    if (!auth?.isAuthenticated) return;
    setJoinLoading(true);
    try {
      if (joined) {
        await communityService.leave(community.id);
        setJoined(false);
        setCommunity((prev) => ({ ...prev, memberCount: (prev.memberCount || 1) - 1 }));
      } else {
        await communityService.join(community.id);
        setJoined(true);
        setCommunity((prev) => ({ ...prev, memberCount: (prev.memberCount || 0) + 1 }));
      }
    } catch (err) {
      console.error('Join/leave failed:', err);
    } finally {
      setJoinLoading(false);
    }
  }

  function formatCount(num) {
    if (!num) return '0';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  }

  if (loading) {
    return (
      <div className="card p-12 text-center">
        <div className="inline-block w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-sm text-surface-500">Loading community...</p>
      </div>
    );
  }

  if (error === 'not_found' || !community) {
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

  if (error === 'error') {
    return (
      <div className="card p-12 text-center">
        <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
        <p className="text-secondary text-sm mb-4">Could not load this community.</p>
        <button onClick={fetchCommunity} className="text-primary-500 hover:text-primary-400 font-medium text-sm">
          Try again
        </button>
      </div>
    );
  }

  const gradient = bannerGradients[(community.id || 0) % bannerGradients.length];

  return (
    <div>
      {/* ── Banner ── */}
      <div
        className="-mx-6 -mt-6 mb-6 p-6 pb-8 relative overflow-hidden"
        style={{ background: gradient }}
      >
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
          {auth?.isAuthenticated && (
            <Button
              variant={joined ? 'secondary' : 'primary'}
              size="md"
              onClick={handleJoinToggle}
              loading={joinLoading}
            >
              {joined ? '✓ Joined' : 'Join'}
            </Button>
          )}
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
          {postsLoading ? (
            <div className="card p-8 text-center">
              <div className="inline-block w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mb-3" />
              <p className="text-sm text-surface-500">Loading posts...</p>
            </div>
          ) : posts.length > 0 ? (
            <div className="space-y-3">
              {posts.map((post) => (
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
              {community.creator && (
                <div className="flex justify-between text-sm">
                  <span className="text-surface-500">Creator</span>
                  <Link
                    to={`/profile/${community.creator.username}`}
                    className="font-semibold text-primary-500 hover:text-primary-400 no-underline"
                  >
                    {community.creator.username}
                  </Link>
                </div>
              )}
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
