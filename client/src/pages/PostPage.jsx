import { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Avatar } from '../components/common';
import { postService } from '../services/post.service.js';
import { timeAgo, formatCount } from '../utils/index.js';
import { AuthContext } from '../context/AuthContext.jsx';

/**
 * CommentItem — Renders a single comment with optional nested replies.
 * Supports inline reply form and comment voting.
 */
function CommentItem({ comment, postId, isAuthenticated, onReplyAdded, navigate, depth = 0 }) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);

  // Comment voting state
  const [voteState, setVoteState] = useState(comment.userVote || null);
  const [upvotes, setUpvotes] = useState(comment.upvotes || 0);
  const [downvotes, setDownvotes] = useState(comment.downvotes || 0);
  const [isVoting, setIsVoting] = useState(false);

  async function handleCommentVote(direction) {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }

    if (isVoting) return;

    const newValue = voteState === direction ? null : direction;

    // Save for rollback
    const prevVoteState = voteState;
    const prevUpvotes = upvotes;
    const prevDownvotes = downvotes;

    // Optimistic update
    let nextUpvotes = upvotes;
    let nextDownvotes = downvotes;

    if (prevVoteState === 'up') nextUpvotes -= 1;
    else if (prevVoteState === 'down') nextDownvotes -= 1;

    if (newValue === 'up') nextUpvotes += 1;
    else if (newValue === 'down') nextDownvotes += 1;

    setVoteState(newValue);
    setUpvotes(nextUpvotes);
    setDownvotes(nextDownvotes);

    setIsVoting(true);
    try {
      const { data } = await postService.voteOnComment(postId, comment.id, newValue);
      setUpvotes(data.upvotes);
      setDownvotes(data.downvotes);
      setVoteState(data.userVote);
    } catch (err) {
      console.error('Comment vote failed:', err);
      setVoteState(prevVoteState);
      setUpvotes(prevUpvotes);
      setDownvotes(prevDownvotes);
    } finally {
      setIsVoting(false);
    }
  }

  async function handleReply() {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }
    if (!replyText.trim() || submittingReply) return;

    setSubmittingReply(true);
    try {
      const { data } = await postService.createComment(postId, {
        body: replyText.trim(),
        parentId: comment.id,
      });
      setReplyText('');
      setShowReplyForm(false);
      onReplyAdded(data.comment, comment.id);
    } catch (err) {
      console.error('Failed to post reply:', err);
    } finally {
      setSubmittingReply(false);
    }
  }

  const maxDepth = 4;
  const commentScore = upvotes - downvotes;

  return (
    <div className={`${depth > 0 ? 'ml-5 pl-4 border-l-2 border-gray-200 dark:border-surface-700' : ''}`}>
      <div className="py-3">
        {/* Comment header */}
        <div className="flex items-center gap-2 mb-1.5">
          <Link
            to={`/profile/${comment.author?.username || 'unknown'}`}
            className="flex items-center gap-1.5 no-underline group/author"
          >
            <Avatar name={comment.author?.username || 'unknown'} size="xs" />
            <span className="text-xs font-semibold text-surface-800 dark:text-surface-200 group-hover/author:text-primary-500 transition-colors">
              {comment.author?.username || 'unknown'}
            </span>
          </Link>
          <span className="text-surface-400">·</span>
          <span className="text-xs text-surface-500">{timeAgo(comment.createdAt)}</span>
        </div>

        {/* Comment body */}
        <p className="text-sm text-surface-700 dark:text-surface-300 leading-relaxed whitespace-pre-line mb-2">
          {comment.body}
        </p>

        {/* Comment actions */}
        <div className="flex items-center gap-3">
          {/* Vote pill */}
          <div className="flex items-center rounded-full bg-gray-100 dark:bg-surface-800">
            <button
              onClick={() => handleCommentVote('up')}
              className={`p-1 rounded-l-full transition-colors ${
                voteState === 'up' ? 'text-primary-500' : 'text-surface-500 hover:text-primary-500'
              }`}
            >
              <svg className="w-3.5 h-3.5" fill={voteState === 'up' ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
              </svg>
            </button>
            <span className={`text-xs font-semibold min-w-[1.5rem] text-center ${
              voteState === 'up' ? 'text-primary-500' : voteState === 'down' ? 'text-danger-500' : 'text-surface-600 dark:text-surface-400'
            }`}>
              {formatCount(commentScore)}
            </span>
            <button
              onClick={() => handleCommentVote('down')}
              className={`p-1 rounded-r-full transition-colors ${
                voteState === 'down' ? 'text-danger-500' : 'text-surface-500 hover:text-danger-500'
              }`}
            >
              <svg className="w-3.5 h-3.5" fill={voteState === 'down' ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {/* Reply button */}
          {depth < maxDepth && (
            <button
              onClick={() => {
                if (!isAuthenticated) { navigate('/'); return; }
                setShowReplyForm(!showReplyForm);
              }}
              className="text-xs font-medium text-surface-500 hover:text-primary-500 transition-colors flex items-center gap-1"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
              </svg>
              Reply
            </button>
          )}
        </div>

        {/* Reply form */}
        {showReplyForm && (
          <div className="mt-3">
            <textarea
              rows={2}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder={`Reply to ${comment.author?.username || 'unknown'}...`}
              autoFocus
              className="w-full px-3 py-2 text-sm rounded-lg resize-none
                bg-white dark:bg-surface-800 border border-gray-300 dark:border-surface-700
                text-surface-900 dark:text-surface-100 placeholder:text-surface-400
                focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500
                transition-all duration-200"
            />
            <div className="flex items-center gap-2 mt-2 justify-end">
              <button
                onClick={() => { setShowReplyForm(false); setReplyText(''); }}
                className="px-3 py-1 rounded-md text-xs font-medium text-surface-500 hover:text-surface-700 dark:hover:text-surface-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReply}
                disabled={!replyText.trim() || submittingReply}
                className="px-3 py-1 rounded-md text-xs font-semibold bg-primary-600 hover:bg-primary-500 text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {submittingReply ? 'Posting...' : 'Reply'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Nested replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div>
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              postId={postId}
              isAuthenticated={isAuthenticated}
              onReplyAdded={onReplyAdded}
              navigate={navigate}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * PostPage — Full post view at /post/:id.
 *
 * Fetches real post data from GET /api/posts/:id.
 * Shows the complete post content, vote buttons, and a full comment section.
 * Vote state is persisted to the server and initialized from the API response.
 */
export default function PostPage() {
  const { id } = useParams();
  const { isAuthenticated, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [voteState, setVoteState] = useState(null);
  const [upvotes, setUpvotes] = useState(0);
  const [downvotes, setDownvotes] = useState(0);
  const [isVoting, setIsVoting] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [commentCount, setCommentCount] = useState(0);

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [id]);

  async function fetchPost() {
    setLoading(true);
    setError(null);
    try {
      const { data } = await postService.getById(id);
      setPost(data.post);
      setVoteState(data.post.userVote || null);
      setUpvotes(data.post.upvotes || 0);
      setDownvotes(data.post.downvotes || 0);
      setCommentCount(data.post.commentCount || 0);
    } catch (err) {
      console.error('Failed to fetch post:', err);
      if (err.response?.status === 404) {
        setError('not_found');
      } else {
        setError('Could not load the post. The server may be unavailable.');
      }
    } finally {
      setLoading(false);
    }
  }

  async function fetchComments() {
    setCommentsLoading(true);
    try {
      const { data } = await postService.listComments(id);
      setComments(data.comments || []);
    } catch (err) {
      console.error('Failed to fetch comments:', err);
      setComments([]);
    } finally {
      setCommentsLoading(false);
    }
  }

  async function handleSubmitComment() {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }
    if (!commentText.trim() || submittingComment) return;

    setSubmittingComment(true);
    try {
      const { data } = await postService.createComment(id, {
        body: commentText.trim(),
      });
      // Add the new comment to the top of the list
      setComments((prev) => [data.comment, ...prev]);
      setCommentText('');
      setCommentCount((prev) => prev + 1);
    } catch (err) {
      console.error('Failed to post comment:', err);
    } finally {
      setSubmittingComment(false);
    }
  }

  function handleReplyAdded(newReply, parentId) {
    setComments((prev) =>
      prev.map((c) => {
        if (c.id === parentId) {
          return {
            ...c,
            replies: [...(c.replies || []), newReply],
          };
        }
        // Check nested replies (one level deep)
        if (c.replies && c.replies.length > 0) {
          return {
            ...c,
            replies: c.replies.map((r) =>
              r.id === parentId
                ? { ...r, replies: [...(r.replies || []), newReply] }
                : r
            ),
          };
        }
        return c;
      })
    );
    setCommentCount((prev) => prev + 1);
  }

  async function handleVote(direction) {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }

    if (isVoting) return;

    const newValue = voteState === direction ? null : direction;

    // Save for rollback
    const prevVoteState = voteState;
    const prevUpvotes = upvotes;
    const prevDownvotes = downvotes;

    // Optimistic update
    let nextUpvotes = upvotes;
    let nextDownvotes = downvotes;

    if (prevVoteState === 'up') nextUpvotes -= 1;
    else if (prevVoteState === 'down') nextDownvotes -= 1;

    if (newValue === 'up') nextUpvotes += 1;
    else if (newValue === 'down') nextDownvotes += 1;

    setVoteState(newValue);
    setUpvotes(nextUpvotes);
    setDownvotes(nextDownvotes);

    setIsVoting(true);
    try {
      const { data } = await postService.vote(id, newValue);
      setUpvotes(data.upvotes);
      setDownvotes(data.downvotes);
      setVoteState(data.userVote);
    } catch (err) {
      console.error('Vote failed:', err);
      setVoteState(prevVoteState);
      setUpvotes(prevUpvotes);
      setDownvotes(prevDownvotes);
    } finally {
      setIsVoting(false);
    }
  }

  // ── Loading state ──
  if (loading) {
    return (
      <div className="card p-12 text-center">
        <div className="inline-block w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-sm text-surface-500">Loading post...</p>
      </div>
    );
  }

  // ── Error state: not found ──
  if (error === 'not_found' || (!post && !loading)) {
    return (
      <div className="card p-12 text-center">
        <h2 className="text-xl font-bold mb-2">Post not found</h2>
        <p className="text-secondary text-sm mb-4">This post may have been deleted or doesn&apos;t exist.</p>
        <Link to="/home" className="text-primary-500 hover:text-primary-400 no-underline font-medium text-sm">
          ← Back to Home
        </Link>
      </div>
    );
  }

  // ── Error state: generic ──
  if (error) {
    return (
      <div className="card p-12 text-center">
        <p className="text-sm text-surface-500 mb-3">{error}</p>
        <button
          onClick={fetchPost}
          className="text-sm text-primary-500 hover:text-primary-400 font-medium"
        >
          Try again
        </button>
      </div>
    );
  }

  const displayScore = upvotes - downvotes;

  return (
    <div className="flex gap-6">
      {/* ── Main content ── */}
      <div className="flex-1 min-w-0">
        {/* Post */}
        <div className="card p-5 mb-4">
          {/* Header */}
          <div className="flex items-center gap-2 mb-3 text-xs">
            {post.community && (
              <>
                <Link
                  to={`/c/${post.community.slug}`}
                  className="font-semibold text-surface-800 dark:text-surface-200 hover:text-primary-500 no-underline"
                >
                  g/{post.community.name}
                </Link>
                <span className="text-surface-400">•</span>
              </>
            )}
            <Link
              to={`/profile/${post.author?.username || 'unknown'}`}
              className="flex items-center gap-1.5 text-surface-500 hover:text-primary-500 no-underline"
            >
              <Avatar name={post.author?.username || 'unknown'} size="xs" />
              <span>{post.author?.username || 'unknown'}</span>
            </Link>
            <span className="text-surface-400">•</span>
            <span className="text-surface-500">{timeAgo(post.createdAt)}</span>
          </div>

          {/* Title */}
          <h1 className="text-xl font-bold mb-3 leading-snug">{post.title}</h1>

          {/* Full content */}
          <div className="text-sm text-surface-700 dark:text-surface-300 leading-relaxed whitespace-pre-line mb-4">
            {post.body}
          </div>

          {/* Actions bar */}
          <div className="flex items-center gap-1 pt-3 border-t border-gray-200 dark:border-surface-700">
            <div className="flex items-center rounded-full bg-gray-100 dark:bg-surface-800">
              <button
                onClick={() => handleVote('up')}
                className={`p-1.5 rounded-l-full transition-colors ${
                  voteState === 'up' ? 'text-primary-500' : 'text-surface-500 hover:text-primary-500'
                }`}
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
                onClick={() => handleVote('down')}
                className={`p-1.5 rounded-r-full transition-colors ${
                  voteState === 'down' ? 'text-danger-500' : 'text-surface-500 hover:text-danger-500'
                }`}
              >
                <svg className="w-4 h-4" fill={voteState === 'down' ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-surface-500 text-xs font-medium">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4-.8L3 21l1.8-5.2A7.956 7.956 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              {formatCount(commentCount)} comments
            </span>

            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-surface-500 hover:bg-gray-100 dark:hover:bg-surface-800 transition-colors text-xs font-medium">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Share
            </button>

            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-surface-500 hover:bg-gray-100 dark:hover:bg-surface-800 transition-colors text-xs font-medium">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
              </svg>
              Save
            </button>
          </div>
        </div>

        {/* ── Comment input ── */}
        <div className="card p-4 mb-4">
          {isAuthenticated ? (
            <>
              <div className="flex items-center gap-2 mb-3">
                <Avatar name={user?.username || 'You'} size="xs" />
                <span className="text-xs text-surface-500">
                  Comment as <span className="font-semibold text-surface-700 dark:text-surface-300">{user?.username || 'You'}</span>
                </span>
              </div>
              <textarea
                rows={3}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="What are your thoughts?"
                className="w-full px-4 py-3 text-sm rounded-xl resize-none
                  bg-white dark:bg-surface-800 border border-gray-300 dark:border-surface-700
                  text-surface-900 dark:text-surface-100 placeholder:text-surface-400
                  focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500
                  transition-all duration-200"
              />
              <div className="flex justify-end mt-2">
                <button
                  onClick={handleSubmitComment}
                  disabled={!commentText.trim() || submittingComment}
                  className="px-4 py-1.5 rounded-lg text-sm font-semibold bg-primary-600 hover:bg-primary-500 text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {submittingComment ? 'Posting...' : 'Comment'}
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-3">
              <p className="text-sm text-surface-500 mb-2">Log in to join the discussion</p>
              <Link
                to="/"
                className="inline-block px-4 py-1.5 rounded-lg text-sm font-semibold bg-primary-600 hover:bg-primary-500 text-white transition-colors no-underline"
              >
                Log In / Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* ── Comments section ── */}
        <div className="card">
          {/* Comments header */}
          <div className="px-5 pt-4 pb-3 border-b border-gray-200 dark:border-surface-700">
            <h2 className="text-sm font-semibold text-surface-800 dark:text-surface-200">
              {commentCount > 0 ? `${formatCount(commentCount)} Comment${commentCount !== 1 ? 's' : ''}` : 'Comments'}
            </h2>
          </div>

          {/* Comments list */}
          <div className="px-5 py-2">
            {commentsLoading ? (
              <div className="py-8 text-center">
                <div className="inline-block w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mb-2" />
                <p className="text-xs text-surface-500">Loading comments...</p>
              </div>
            ) : comments.length > 0 ? (
              <div className="divide-y divide-gray-100 dark:divide-surface-800">
                {comments.map((comment) => (
                  <CommentItem
                    key={comment.id}
                    comment={comment}
                    postId={id}
                    isAuthenticated={isAuthenticated}
                    onReplyAdded={handleReplyAdded}
                    navigate={navigate}
                    depth={0}
                  />
                ))}
              </div>
            ) : (
              <div className="py-10 text-center">
                <svg className="w-10 h-10 mx-auto mb-3 text-surface-300 dark:text-surface-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4-.8L3 21l1.8-5.2A7.956 7.956 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p className="text-sm font-medium text-surface-600 dark:text-surface-400 mb-1">No comments yet</p>
                <p className="text-xs text-surface-500">Be the first to share your thoughts!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Sidebar ── */}
      <div className="hidden xl:block w-72 shrink-0">
        <div className="card p-4 sticky top-20">
          {post.community && (
            <>
              <h3 className="text-sm font-semibold text-surface-800 dark:text-surface-200 mb-2">
                About g/{post.community.name}
              </h3>
              <p className="text-xs text-surface-500 leading-relaxed mb-3">
                A community for discussions related to {post.community.name}.
              </p>
              <Link
                to={`/c/${post.community.slug}`}
                className="block w-full py-2 rounded-lg text-center text-xs font-semibold bg-primary-600 hover:bg-primary-500 text-white transition-colors no-underline"
              >
                View Community
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
