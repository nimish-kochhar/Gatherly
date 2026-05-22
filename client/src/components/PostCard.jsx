import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Avatar } from './common';
import { timeAgo, formatCount } from '../utils/index.js';
import { postService } from '../services/post.service.js';
import { AuthContext } from '../context/AuthContext.jsx';

/**
 * PostCard — Displays a single post in a feed.
 *
 * Props:
 *   post: {
 *     id, title, content, author, community,
 *     upvotes, downvotes, commentCount, createdAt, image, userVote
 *   }
 *
 * Features:
 *   - Vote buttons (upvote/downvote) with optimistic updates + API persistence
 *   - Community link + author info + relative timestamp
 *   - Truncated content preview with "Read more" link
 *   - Comment count + Share button
 *   - Entire card is clickable to navigate to post detail
 *
 * How voting works:
 *   - voteState is initialized from post.userVote (from server)
 *   - On click, we optimistically update UI then fire API call
 *   - On API failure, we roll back to the previous state
 *   - Unauthenticated users are redirected to the landing page
 */
export default function PostCard({ post }) {
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const [voteState, setVoteState] = useState(post.userVote || null); // null | 'up' | 'down'
  const [upvotes, setUpvotes] = useState(post.upvotes);
  const [downvotes, setDownvotes] = useState(post.downvotes);
  const [isVoting, setIsVoting] = useState(false);

  const displayScore = upvotes - downvotes;

  const handleVote = async (direction, e) => {
    e.preventDefault();       // Prevent the Link from navigating
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate('/');
      return;
    }

    if (isVoting) return; // Debounce

    // Determine the value to send — toggle if same direction
    const newValue = voteState === direction ? null : direction;

    // Save previous state for rollback
    const prevVoteState = voteState;
    const prevUpvotes = upvotes;
    const prevDownvotes = downvotes;

    // Optimistic update
    setVoteState(newValue);
    // Adjust counts based on the transition
    let newUpvotes = post.upvotes;
    let newDownvotes = post.downvotes;
    // We recalculate from the base counts + the new vote
    // Actually, let's just compute from the current server-synced state
    // after the API call. For now, adjust optimistically:
    if (prevVoteState === 'up') newUpvotes = prevUpvotes - 1;
    else if (prevVoteState === 'down') newDownvotes = prevDownvotes - 1;
    else { newUpvotes = prevUpvotes; newDownvotes = prevDownvotes; }

    if (newValue === 'up') newUpvotes += 1;
    else if (newValue === 'down') newDownvotes += 1;

    setUpvotes(newUpvotes);
    setDownvotes(newDownvotes);

    // API call
    setIsVoting(true);
    try {
      const { data } = await postService.vote(post.id, newValue);
      // Sync with server truth
      setUpvotes(data.upvotes);
      setDownvotes(data.downvotes);
      setVoteState(data.userVote);
    } catch (err) {
      console.error('Vote failed:', err);
      // Rollback
      setVoteState(prevVoteState);
      setUpvotes(prevUpvotes);
      setDownvotes(prevDownvotes);
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <Link
      to={`/post/${post.id}`}
      className="card block p-4 hover:border-surface-500 dark:hover:border-surface-500 no-underline group"
    >
      {/* ── Header: community + author + time ── */}
      <div className="flex items-center gap-2 mb-3 text-xs">
        <Link
          to={`/c/${post.community.slug}`}
          onClick={(e) => e.stopPropagation()}
          className="font-semibold text-surface-800 dark:text-surface-200 hover:text-primary-500 no-underline"
        >
          g/{post.community.name}
        </Link>
        <span className="text-surface-400">•</span>
        <Link
          to={`/profile/${post.author.username}`}
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-1.5 text-surface-500 dark:text-surface-400 hover:text-primary-500 no-underline"
        >
          <Avatar name={post.author.username} size="xs" />
          <span>{post.author.username}</span>
        </Link>
        <span className="text-surface-400">•</span>
        <span className="text-surface-500 dark:text-surface-500">{timeAgo(post.createdAt)}</span>
      </div>

      {/* ── Title ── */}
      <h3 className="text-base font-semibold text-surface-900 dark:text-surface-100 mb-2 group-hover:text-primary-500 transition-colors leading-snug">
        {post.title}
      </h3>

      {/* ── Content preview ── */}
      <p className="text-sm text-surface-600 dark:text-surface-400 line-clamp-3 mb-3 leading-relaxed">
        {post.content}
      </p>

      {/* ── Image (if any) ── */}
      {post.image && (
        <div className="mb-3 rounded-lg overflow-hidden bg-surface-100 dark:bg-surface-800">
          <img
            src={post.image}
            alt={post.title}
            className="w-full max-h-96 object-cover"
          />
        </div>
      )}

      {/* ── Footer: votes + comments + share ── */}
      <div className="flex items-center gap-1 -ml-1.5">
        {/* Vote buttons */}
        <div className="flex items-center rounded-full bg-gray-100 dark:bg-surface-800">
          <button
            onClick={(e) => handleVote('up', e)}
            className={`p-1.5 rounded-l-full transition-colors ${
              voteState === 'up'
                ? 'text-primary-500'
                : 'text-surface-500 hover:text-primary-500'
            }`}
            title="Upvote"
          >
            <svg className="w-4 h-4" fill={voteState === 'up' ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
            </svg>
          </button>
          <span className={`text-xs font-semibold min-w-[2rem] text-center ${
            voteState === 'up' ? 'text-primary-500' : voteState === 'down' ? 'text-danger-500' : 'text-surface-600 dark:text-surface-400'
          }`}>
            {formatCount(displayScore)}
          </span>
          <button
            onClick={(e) => handleVote('down', e)}
            className={`p-1.5 rounded-r-full transition-colors ${
              voteState === 'down'
                ? 'text-danger-500'
                : 'text-surface-500 hover:text-danger-500'
            }`}
            title="Downvote"
          >
            <svg className="w-4 h-4" fill={voteState === 'down' ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Comments */}
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-surface-500 hover:bg-gray-100 dark:hover:bg-surface-800 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4-.8L3 21l1.8-5.2A7.956 7.956 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span className="text-xs font-medium">{formatCount(post.commentCount)}</span>
        </button>

        {/* Share */}
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-surface-500 hover:bg-gray-100 dark:hover:bg-surface-800 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          <span className="text-xs font-medium">Share</span>
        </button>
      </div>
    </Link>
  );
}
