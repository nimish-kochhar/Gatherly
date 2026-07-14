import CommentItem from './CommentItem.jsx';
import { formatCount } from '../../utils/index.js';

/**
 * CommentList — Renders the full comments section for a post.
 * Includes header with count, loading state, empty state, and comment iteration.
 */
export default function CommentList({ comments, commentsLoading, commentCount, postId, isAuthenticated, onReplyAdded, navigate }) {
  return (
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
                postId={postId}
                isAuthenticated={isAuthenticated}
                onReplyAdded={onReplyAdded}
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
  );
}
