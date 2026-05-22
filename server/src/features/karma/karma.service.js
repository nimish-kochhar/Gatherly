/**
 * Karma Service
 *
 * Manages user karma — the reputation score earned from community votes
 * on a user's posts and comments.
 *
 * Karma belongs to the AUTHOR of the content, not the voter.
 * When someone upvotes your post, YOUR karma increases.
 *
 * Negative karma is allowed (no floor).
 */

import User from '../user/user.model.js';
import Vote from '../post/vote.model.js';
import Post from '../post/post.model.js';
import Comment from '../post/comment.model.js';
import sequelize from '../../config/db.js';

/**
 * Karma point values per action.
 *
 * Asymmetric by design — upvotes reward ~5× more than downvotes punish,
 * so users aren't discouraged from participating.
 */
export const KARMA = {
  POST_UPVOTE: 10,
  POST_DOWNVOTE: -2,
  COMMENT_UPVOTE: 4,
  COMMENT_DOWNVOTE: -1,
  POST_CREATED: 2,
  COMMENT_CREATED: 1,
};

/**
 * Apply an incremental karma delta to a user.
 *
 * Uses an atomic SQL increment to avoid race conditions when
 * multiple votes arrive concurrently.
 *
 * @param {number} userId - The user whose karma should change
 * @param {number} delta  - The karma change (+/-)
 */
export async function adjustKarma(userId, delta) {
  if (!userId || delta === 0) return;
  await User.increment('karma', { by: delta, where: { id: userId } });
}

/**
 * Calculate the karma delta when a post vote transition occurs.
 *
 * @param {'up'|'down'|null} oldValue - Previous vote value (null if none)
 * @param {'up'|'down'|null} newValue - New vote value (null if removed)
 * @returns {number} The karma delta to apply to the post author
 */
export function calcPostVoteDelta(oldValue, newValue) {
  let delta = 0;

  // Reverse old vote effect
  if (oldValue === 'up') delta -= KARMA.POST_UPVOTE;
  else if (oldValue === 'down') delta -= KARMA.POST_DOWNVOTE; // subtracting a negative = adding

  // Apply new vote effect
  if (newValue === 'up') delta += KARMA.POST_UPVOTE;
  else if (newValue === 'down') delta += KARMA.POST_DOWNVOTE;

  return delta;
}

/**
 * Calculate the karma delta when a comment vote transition occurs.
 *
 * @param {'up'|'down'|null} oldValue
 * @param {'up'|'down'|null} newValue
 * @returns {number}
 */
export function calcCommentVoteDelta(oldValue, newValue) {
  let delta = 0;

  if (oldValue === 'up') delta -= KARMA.COMMENT_UPVOTE;
  else if (oldValue === 'down') delta -= KARMA.COMMENT_DOWNVOTE;

  if (newValue === 'up') delta += KARMA.COMMENT_UPVOTE;
  else if (newValue === 'down') delta += KARMA.COMMENT_DOWNVOTE;

  return delta;
}

/**
 * Full recalculation of a user's karma from scratch.
 *
 * Sums every vote on the user's posts and comments, plus creation bonuses,
 * and sets the karma column to the computed value.
 *
 * Use as a safety-net / consistency check — the normal path is incremental.
 *
 * @param {number} userId
 * @returns {Promise<number>} The recalculated karma value
 */
export async function recalculateKarma(userId) {
  // Get all post IDs belonging to this user
  const userPosts = await Post.findAll({
    where: { userId },
    attributes: ['id'],
    raw: true,
  });
  const postIds = userPosts.map((p) => p.id);

  // Count votes on user's posts
  let postUpvotes = 0;
  let postDownvotes = 0;
  if (postIds.length > 0) {
    postUpvotes = await Vote.count({
      where: { votableType: 'post', votableId: postIds, value: 'up' },
    });
    postDownvotes = await Vote.count({
      where: { votableType: 'post', votableId: postIds, value: 'down' },
    });
  }

  // Count creation bonuses
  const postCount = postIds.length;
  const commentCount = await Comment.count({ where: { userId } });

  // Calculate total karma
  const karma =
    (postUpvotes * KARMA.POST_UPVOTE) +
    (postDownvotes * KARMA.POST_DOWNVOTE) +
    (postCount * KARMA.POST_CREATED) +
    (commentCount * KARMA.COMMENT_CREATED);

  // Set the value
  await User.update({ karma }, { where: { id: userId } });

  return karma;
}
