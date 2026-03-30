import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Avatar } from '../components/common';
import { MOCK_POSTS, MOCK_COMMENTS, timeAgo, formatCount } from '../data/mockData.js';

/**
 * PostPage — Full post view at /post/:id.
 *
 * Shows the complete post content (not truncated like in feeds),
 * vote buttons, and a threaded comment section with replies.
 */
export default function PostPage() {
  const { id } = useParams();
  const post = MOCK_POSTS.find((p) => p.id === Number(id));
  const comments = MOCK_COMMENTS.filter((c) => c.postId === Number(id));

  const [voteState, setVoteState] = useState(null);
  const [commentText, setCommentText] = useState('');

  if (!post) {
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

  const baseScore = post.upvotes - post.downvotes;
  const displayScore =
    voteState === 'up' ? baseScore + 1 : voteState === 'down' ? baseScore - 1 : baseScore;

  return (
    <div className="flex gap-6">
      {/* ── Main content ── */}
      <div className="flex-1 min-w-0">
        {/* Post */}
        <div className="card p-5 mb-4">
          {/* Header */}
          <div className="flex items-center gap-2 mb-3 text-xs">
            <Link
              to={`/c/${post.community.slug}`}
              className="font-semibold text-surface-800 dark:text-surface-200 hover:text-primary-500 no-underline"
            >
              g/{post.community.name}
            </Link>
            <span className="text-surface-400">•</span>
            <Link
              to={`/profile/${post.author.username}`}
              className="flex items-center gap-1.5 text-surface-500 hover:text-primary-500 no-underline"
            >
              <Avatar name={post.author.username} size="xs" />
              <span>{post.author.username}</span>
            </Link>
            <span className="text-surface-400">•</span>
            <span className="text-surface-500">{timeAgo(post.createdAt)}</span>
          </div>

          {/* Title */}
          <h1 className="text-xl font-bold mb-3 leading-snug">{post.title}</h1>

          {/* Full content */}
          <div className="text-sm text-surface-700 dark:text-surface-300 leading-relaxed whitespace-pre-line mb-4">
            {post.content}
          </div>

          {/* Image */}
          {post.image && (
            <div className="mb-4 rounded-lg overflow-hidden bg-surface-100 dark:bg-surface-800">
              <img src={post.image} alt={post.title} className="w-full max-h-[600px] object-cover" />
            </div>
          )}

          {/* Actions bar */}
          <div className="flex items-center gap-1 pt-3 border-t border-gray-200 dark:border-surface-700">
            <div className="flex items-center rounded-full bg-gray-100 dark:bg-surface-800">
              <button
                onClick={() => setVoteState((p) => (p === 'up' ? null : 'up'))}
                className={`p-1.5 rounded-l-full transition-colors ${
                  voteState === 'up' ? 'text-primary-500' : 'text-surface-500 hover:text-primary-500'
                }`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                </svg>
              </button>
              <span className={`text-xs font-semibold min-w-[2rem] text-center ${
                voteState === 'up' ? 'text-primary-500' : voteState === 'down' ? 'text-danger-500' : 'text-surface-600 dark:text-surface-400'
              }`}>
                {formatCount(displayScore)}
              </span>
              <button
                onClick={() => setVoteState((p) => (p === 'down' ? null : 'down'))}
                className={`p-1.5 rounded-r-full transition-colors ${
                  voteState === 'down' ? 'text-danger-500' : 'text-surface-500 hover:text-danger-500'
                }`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-surface-500 text-xs font-medium">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4-.8L3 21l1.8-5.2A7.956 7.956 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              {formatCount(post.commentCount)} comments
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
              disabled={!commentText.trim()}
              className="px-4 py-1.5 rounded-lg text-sm font-semibold bg-primary-600 hover:bg-primary-500 text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Comment
            </button>
          </div>
        </div>

        {/* ── Comments ── */}
        <div className="space-y-3">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <Comment key={comment.id} comment={comment} depth={0} />
            ))
          ) : (
            <div className="card p-8 text-center">
              <p className="text-surface-500 text-sm">No comments yet — be the first to share your thoughts!</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Sidebar ── */}
      <div className="hidden xl:block w-72 shrink-0">
        <div className="card p-4 sticky top-20">
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
        </div>
      </div>
    </div>
  );
}

/**
 * Comment — Recursive threaded comment component.
 * Renders a comment and its replies with indentation.
 */
function Comment({ comment, depth }) {
  const [voteState, setVoteState] = useState(null);
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState('');

  const score = comment.upvotes + (voteState === 'up' ? 1 : voteState === 'down' ? -1 : 0);

  return (
    <div className={`${depth > 0 ? 'ml-6 pl-4 border-l-2 border-gray-200 dark:border-surface-700' : ''}`}>
      <div className="card p-4">
        {/* Author */}
        <div className="flex items-center gap-2 mb-2">
          <Avatar name={comment.author.username} size="xs" />
          <Link
            to={`/profile/${comment.author.username}`}
            className="text-xs font-semibold text-surface-800 dark:text-surface-200 hover:text-primary-500 no-underline"
          >
            {comment.author.username}
          </Link>
          <span className="text-xs text-surface-500">{timeAgo(comment.createdAt)}</span>
        </div>

        {/* Content */}
        <p className="text-sm text-surface-700 dark:text-surface-300 leading-relaxed mb-2">
          {comment.content}
        </p>

        {/* Actions */}
        <div className="flex items-center gap-1 -ml-1">
          <div className="flex items-center">
            <button
              onClick={() => setVoteState((p) => (p === 'up' ? null : 'up'))}
              className={`p-1 transition-colors ${voteState === 'up' ? 'text-primary-500' : 'text-surface-400 hover:text-primary-500'}`}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
              </svg>
            </button>
            <span className={`text-xs font-semibold min-w-[1.5rem] text-center ${
              voteState === 'up' ? 'text-primary-500' : voteState === 'down' ? 'text-danger-500' : 'text-surface-500'
            }`}>
              {score}
            </span>
            <button
              onClick={() => setVoteState((p) => (p === 'down' ? null : 'down'))}
              className={`p-1 transition-colors ${voteState === 'down' ? 'text-danger-500' : 'text-surface-400 hover:text-danger-500'}`}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          <button
            onClick={() => setShowReply(!showReply)}
            className="text-xs text-surface-500 hover:text-primary-500 font-medium px-2 py-1 transition-colors"
          >
            Reply
          </button>
        </div>

        {/* Reply input */}
        {showReply && (
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-surface-700">
            <textarea
              rows={2}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder={`Reply to ${comment.author.username}...`}
              className="w-full px-3 py-2 text-sm rounded-lg resize-none
                bg-white dark:bg-surface-800 border border-gray-300 dark:border-surface-700
                text-surface-900 dark:text-surface-100 placeholder:text-surface-400
                focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500
                transition-all duration-200"
            />
            <div className="flex justify-end gap-2 mt-2">
              <button
                onClick={() => { setShowReply(false); setReplyText(''); }}
                className="px-3 py-1 rounded-lg text-xs text-surface-500 hover:text-surface-700 transition-colors"
              >
                Cancel
              </button>
              <button
                disabled={!replyText.trim()}
                className="px-3 py-1 rounded-lg text-xs font-semibold bg-primary-600 hover:bg-primary-500 text-white transition-colors disabled:opacity-40"
              >
                Reply
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Nested replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-2 space-y-2">
          {comment.replies.map((reply) => (
            <Comment key={reply.id} comment={reply} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
