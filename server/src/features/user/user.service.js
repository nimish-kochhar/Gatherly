import User from './user.model.js';
import Post from '../post/post.model.js';
import Comment from '../post/comment.model.js';
import Vote from '../post/vote.model.js';
import { AppError } from '../../utils/AppError.js';
import { KARMA } from '../karma/karma.service.js';

/**
 * Find a user by username and return public profile data.
 *
 * Includes aggregate counts of the user's posts and comments.
 * Throws 404 if the username does not exist.
 *
 * @param {string} username
 * @returns {Promise<Object>} Public user profile
 */
export async function getUserByUsername(username) {
  const user = await User.findOne({
    where: { username },
    attributes: ['id', 'username', 'bio', 'karma', 'createdAt'],
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  const postCount = await Post.count({ where: { userId: user.id } });
  const commentCount = await Comment.count({ where: { userId: user.id } });

  return {
    ...user.toJSON(),
    postCount,
    commentCount,
  };
}

/**
 * Build a detailed karma breakdown for a user.
 *
 * Counts upvotes and downvotes on the user's posts and comments,
 * then applies the KARMA point values to produce subtotals.
 *
 * @param {number} userId
 * @returns {Promise<Object>} Karma breakdown
 */
export async function getKarmaBreakdown(userId) {
  // Get all post IDs belonging to this user
  const userPosts = await Post.findAll({
    where: { userId },
    attributes: ['id'],
    raw: true,
  });
  const postIds = userPosts.map((p) => p.id);

  // Get all comment IDs belonging to this user
  const userComments = await Comment.findAll({
    where: { userId },
    attributes: ['id'],
    raw: true,
  });
  const commentIds = userComments.map((c) => c.id);

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

  // Count votes on user's comments
  let commentUpvotes = 0;
  let commentDownvotes = 0;
  if (commentIds.length > 0) {
    commentUpvotes = await Vote.count({
      where: { votableType: 'comment', votableId: commentIds, value: 'up' },
    });
    commentDownvotes = await Vote.count({
      where: { votableType: 'comment', votableId: commentIds, value: 'down' },
    });
  }

  const postsCreated = postIds.length;
  const commentsCreated = commentIds.length;

  const postKarma =
    (postUpvotes * KARMA.POST_UPVOTE) +
    (postDownvotes * KARMA.POST_DOWNVOTE);

  const commentKarma =
    (commentUpvotes * KARMA.COMMENT_UPVOTE) +
    (commentDownvotes * KARMA.COMMENT_DOWNVOTE);

  const creationKarma =
    (postsCreated * KARMA.POST_CREATED) +
    (commentsCreated * KARMA.COMMENT_CREATED);

  const total = postKarma + commentKarma + creationKarma;

  return {
    postUpvotes,
    postDownvotes,
    commentUpvotes,
    commentDownvotes,
    postsCreated,
    commentsCreated,
    postKarma,
    commentKarma,
    creationKarma,
    total,
  };
}
