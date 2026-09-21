import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Avatar } from '../common';
import { postService } from '../../services/post.service.js';
import { timeAgo, formatCount } from '../../utils/index.js';

/**
 * CommentItem — Renders a single comment with optional nested replies.
 * Supports inline reply form, comment voting, and editing (author only).
 */
export default function CommentItem({ comment, postId, isAuthenticated, currentUser, onReplyAdded, onCommentEdited, navigate, depth = 0 }) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);

  // Comment voting state
  const [voteState, setVoteState] = useState(comment.userVote || null);
  const [upvotes, setUpvotes] = useState(comment.upvotes || 0);
  const [downvotes, setDownvotes] = useState(comment.downvotes || 0);
  const [isVoting, setIsVoting] = useState(false);

  // Edit state
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.body);
  const [submittingEdit, setSubmittingEdit] = useState(false);

  const isAuthor = isAuthenticated && currentUser?.id === comment.author?.id;

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

  async function handleSaveEdit() {
    if (!editText.trim() || submittingEdit) return;

    setSubmittingEdit(true);
    try {
      const { data } = await postService.updateComment(postId, comment.id, {
        body: editText.trim(),
      });
      setIsEditing(false);
      if (onCommentEdited) {
        onCommentEdited(comment.id, data.comment.body);
      }
    } catch (err) {
      console.error('Failed to edit comment:', err);
    } finally {
      setSubmittingEdit(false);
    }
  }

  function handleCancelEdit() {
    setEditText(comment.body);
    setIsEditing(false);
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
          {comment.isEdited && (
            <>
              <span className="text-surface-400">·</span>
              <span className="text-xs text-surface-400 italic">edited</span>
            </>
          )}
        </div>

        {/* Comment body — edit mode or display mode */}
        {isEditing ? (
          <div className="mb-2">
            <textarea
              rows={3}
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              autoFocus
              className="w-full px-3 py-2 text-sm rounded-lg resize-none
                bg-white dark:bg-surface-800 border border-gray-300 dark:border-surface-700
                text-surface-900 dark:text-surface-100 placeholder:text-surface-400
                focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500
                transition-all duration-200"
            />
            <div className="flex items-center gap-2 mt-2 justify-end">
              <button
                onClick={handleCancelEdit}
                className="px-3 py-1 rounded-md text-xs font-medium text-surface-500 hover:text-surface-700 dark:hover:text-surface-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={!editText.trim() || submittingEdit}
                className="px-3 py-1 rounded-md text-xs font-semibold bg-primary-600 hover:bg-primary-500 text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {submittingEdit ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-surface-700 dark:text-surface-300 leading-relaxed whitespace-pre-line mb-2">
            {comment.body}
          </p>
        )}

        {/* Comment actions */}
        {!isEditing && (
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

            {/* Edit button (author only) */}
            {isAuthor && (
              <button
                onClick={() => {
                  setEditText(comment.body);
                  setIsEditing(true);
                }}
                className="text-xs font-medium text-surface-500 hover:text-primary-500 transition-colors flex items-center gap-1"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                </svg>
                Edit
              </button>
            )}
          </div>
        )}

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
              currentUser={currentUser}
              onReplyAdded={onReplyAdded}
              onCommentEdited={onCommentEdited}
              navigate={navigate}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
