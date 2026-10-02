import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowUp, ArrowDown, MessageCircle, Share2 } from 'lucide-react';
import { Avatar } from '../common';
import { Tooltip } from '../ui/tooltip.jsx';
import { timeAgo, formatCount } from '../../utils/index.js';
import { postService } from '../../services/post.service.js';
import { AuthContext } from '../../context/AuthContext.jsx';

/**
 * PostCard — Displays a single post in a feed.
 *
 * Props:
 *   post: {
 *     id, title, content, author, community,
 *     upvotes, downvotes, commentCount, createdAt, image, userVote
 *   }
 *
 * ## Semantic HTML / Accessibility
 *
 *   The card uses an <article> wrapper. The post title is a real <Link>
 *   (an <a> tag) that covers the entire card via a CSS pseudo-element
 *   (::after stretched to position:absolute, inset-0). This is the
 *   "block link" / "stretchy link" pattern — it makes the whole card
 *   keyboard-navigable and clickable without nesting interactive elements.
 *
 *   Vote/comment/share buttons use `position: relative; z-index: 1` to
 *   sit above the stretched link overlay, so they receive their own
 *   independent click events.
 *
 *   This eliminates the <button> inside <a> anti-pattern from the old
 *   PostCard and removes all e.stopPropagation() workarounds.
 *
 * ## Optimistic Voting
 *
 *   Preserved exactly from the original implementation.
 *   API contract is unchanged.
 */
export default function PostCard({ post }) {
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const [voteState, setVoteState] = useState(post.userVote || null); // null | 'up' | 'down'
  const [upvotes, setUpvotes] = useState(post.upvotes);
  const [downvotes, setDownvotes] = useState(post.downvotes);
  const [isVoting, setIsVoting] = useState(false);

  const displayScore = upvotes - downvotes;

  const handleVote = async (direction) => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }
    if (isVoting) return;

    const newValue = voteState === direction ? null : direction;

    // Save previous state for rollback
    const prevVoteState = voteState;
    const prevUpvotes = upvotes;
    const prevDownvotes = downvotes;

    // Optimistic update
    setVoteState(newValue);
    let newUpvotes = prevUpvotes;
    let newDownvotes = prevDownvotes;

    if (prevVoteState === 'up') newUpvotes -= 1;
    else if (prevVoteState === 'down') newDownvotes -= 1;

    if (newValue === 'up') newUpvotes += 1;
    else if (newValue === 'down') newDownvotes += 1;

    setUpvotes(newUpvotes);
    setDownvotes(newDownvotes);

    setIsVoting(true);
    try {
      const { data } = await postService.vote(post.id, newValue);
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

  const handleShare = async () => {
    const url = `${window.location.origin}/post/${post.id}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: post.title, url });
      } else {
        await navigator.clipboard.writeText(url);
      }
    } catch {
      // User cancelled share or clipboard failed — silently ignore
    }
  };

  return (
    /*
     * <article> is the correct semantic element for a self-contained
     * piece of content (a post). It is also the root for the block-link pattern.
     */
    <article className="card p-4 hover:border-surface-500 dark:hover:border-surface-500 relative group">

      {/* ── Header: community + author + time ── */}
      <div className="flex items-center gap-2 mb-3 text-xs relative z-[1]">
        <Link
          to={`/c/${post.community.slug}`}
          className="font-semibold text-surface-800 dark:text-surface-200 hover:text-primary-500 no-underline"
        >
          g/{post.community.name}
        </Link>
        <span className="text-surface-400">•</span>
        <Link
          to={`/profile/${post.author.username}`}
          className="flex items-center gap-1.5 text-surface-500 dark:text-surface-400 hover:text-primary-500 no-underline"
        >
          <Avatar name={post.author.username} size="xs" />
          <span>{post.author.username}</span>
        </Link>
        <span className="text-surface-400">•</span>
        <span className="text-surface-500 dark:text-surface-500">{timeAgo(post.createdAt)}</span>
      </div>

      {/* ── Title — this link is stretched to cover the whole card ── */}
      <h3 className="text-base font-semibold text-surface-900 dark:text-surface-100 mb-2 group-hover:text-primary-500 transition-colors leading-snug">
        <Link
          to={`/post/${post.id}`}
          className="no-underline text-inherit hover:text-primary-500
            after:absolute after:inset-0 after:rounded-xl after:content-['']"
        >
          {post.title}
        </Link>
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

      {/* ── Footer: votes + comments + share ──
           All interactive elements use z-[1] to sit above the stretched title link. ── */}
      <div className="flex items-center gap-1 -ml-1.5 relative z-[1]">

        {/* Vote buttons */}
        <div
          className="flex items-center rounded-full bg-surface-100 dark:bg-surface-800"
          role="group"
          aria-label="Vote on this post"
        >
          <Tooltip content="Upvote" side="top">
            <button
              onClick={() => handleVote('up')}
              disabled={isVoting}
              aria-label={`Upvote post. Current score: ${displayScore}`}
              aria-pressed={voteState === 'up'}
              className={`p-1.5 rounded-l-full transition-colors disabled:opacity-50 ${
                voteState === 'up'
                  ? 'text-primary-500'
                  : 'text-surface-500 hover:text-primary-500'
              }`}
            >
              <ArrowUp className="w-4 h-4" aria-hidden="true" />
            </button>
          </Tooltip>

          <span
            className={`text-xs font-semibold min-w-[2rem] text-center ${
              voteState === 'up'
                ? 'text-primary-500'
                : voteState === 'down'
                  ? 'text-danger-500'
                  : 'text-surface-600 dark:text-surface-400'
            }`}
            aria-live="polite"
            aria-atomic="true"
          >
            {formatCount(displayScore)}
          </span>

          <Tooltip content="Downvote" side="top">
            <button
              onClick={() => handleVote('down')}
              disabled={isVoting}
              aria-label={`Downvote post. Current score: ${displayScore}`}
              aria-pressed={voteState === 'down'}
              className={`p-1.5 rounded-r-full transition-colors disabled:opacity-50 ${
                voteState === 'down'
                  ? 'text-danger-500'
                  : 'text-surface-500 hover:text-danger-500'
              }`}
            >
              <ArrowDown className="w-4 h-4" aria-hidden="true" />
            </button>
          </Tooltip>
        </div>

        {/* Comments — navigates to the post's comment section */}
        <Tooltip content="View comments" side="top">
          <Link
            to={`/post/${post.id}#comments`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-surface-500
              hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors no-underline"
            aria-label={`${formatCount(post.commentCount)} comments`}
          >
            <MessageCircle className="w-4 h-4" aria-hidden="true" />
            <span className="text-xs font-medium">{formatCount(post.commentCount)}</span>
          </Link>
        </Tooltip>

        {/* Share */}
        <Tooltip content="Share post" side="top">
          <button
            onClick={handleShare}
            aria-label="Share this post"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-surface-500
              hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
          >
            <Share2 className="w-4 h-4" aria-hidden="true" />
            <span className="text-xs font-medium">Share</span>
          </button>
        </Tooltip>
      </div>
    </article>
  );
}
