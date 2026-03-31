import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { communityService } from '../services/community.service.js';
import { AuthContext } from '../context/AuthContext.jsx';

/**
 * CommunityCard — Card for displaying a community in grid/list views (Explore, Popular).
 *
 * Props:
 *   community: { id, name, slug, description, memberCount, postCount }
 *   rank: (optional) number to show ranking in Popular page
 *
 * Shows:
 *   - Community initial icon (colored circle)
 *   - Name (g/slug), description, member + post counts
 *   - "Join" / "Joined" button with real API integration
 *   - Entire card links to /c/:slug
 */
export default function CommunityCard({ community, rank }) {
  const auth = useContext(AuthContext);
  const [joined, setJoined] = useState(community.isMember || false);
  const [joinLoading, setJoinLoading] = useState(false);
  const [memberCount, setMemberCount] = useState(community.memberCount || 0);

  const colors = [
    'from-primary-500 to-primary-700',
    'from-accent-500 to-accent-700',
    'from-success-500 to-success-700',
    'from-danger-500 to-danger-700',
    'from-purple-500 to-purple-700',
    'from-pink-500 to-pink-700',
  ];
  const colorClass = colors[(community.id || 0) % colors.length];

  function formatCount(num) {
    if (!num) return '0';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  }

  async function handleJoin(e) {
    e.preventDefault();
    e.stopPropagation();
    if (!auth?.isAuthenticated || joinLoading) return;

    setJoinLoading(true);
    try {
      if (joined) {
        await communityService.leave(community.id);
        setJoined(false);
        setMemberCount((prev) => Math.max(0, prev - 1));
      } else {
        await communityService.join(community.id);
        setJoined(true);
        setMemberCount((prev) => prev + 1);
      }
    } catch (err) {
      console.error('Join/leave failed:', err);
    } finally {
      setJoinLoading(false);
    }
  }

  return (
    <Link
      to={`/c/${community.slug}`}
      className="card block p-4 hover:border-primary-500/30 no-underline group relative"
    >
      {/* Rank badge */}
      {rank != null && (
        <span className="absolute top-3 right-3 text-2xl font-bold text-surface-200 dark:text-surface-700">
          #{rank}
        </span>
      )}

      <div className="flex items-start gap-3">
        {/* Community icon */}
        <div className={`shrink-0 h-12 w-12 rounded-xl bg-gradient-to-br ${colorClass} flex items-center justify-center shadow-lg`}>
          <span className="text-white font-bold text-lg">
            {community.name[0].toUpperCase()}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-surface-900 dark:text-surface-100 group-hover:text-primary-500 transition-colors">
            g/{community.name}
          </h3>
          <p className="text-xs text-surface-500 dark:text-surface-400 mt-0.5 line-clamp-2 leading-relaxed">
            {community.description}
          </p>

          {/* Stats */}
          <div className="flex items-center gap-4 mt-2.5">
            <span className="text-xs text-surface-500">
              <span className="font-semibold text-surface-700 dark:text-surface-300">{formatCount(memberCount)}</span> members
            </span>
            <span className="text-xs text-surface-500">
              <span className="font-semibold text-surface-700 dark:text-surface-300">{formatCount(community.postCount)}</span> posts
            </span>
          </div>
        </div>
      </div>

      {/* Join button */}
      <button
        onClick={handleJoin}
        disabled={joinLoading}
        className={`mt-3 w-full py-1.5 px-3 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50 ${
          joined
            ? 'bg-surface-200 dark:bg-surface-700 text-surface-600 dark:text-surface-300 hover:bg-surface-300 dark:hover:bg-surface-600'
            : 'bg-primary-600 hover:bg-primary-500 text-white'
        }`}
      >
        {joinLoading ? '...' : joined ? '✓ Joined' : 'Join Community'}
      </button>
    </Link>
  );
}
