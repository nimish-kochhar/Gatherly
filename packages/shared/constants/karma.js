/**
 * Karma point values awarded/deducted per action.
 *
 * Design rationale:
 *  - Upvotes reward significantly more than downvotes punish (5:1 ratio for
 *    posts, 4:1 for comments) so users aren't discouraged from participating.
 *  - Post votes are weighted heavier than comment votes because posts require
 *    more effort.
 *  - Creating content gives a small bonus to reward participation.
 *  - Negative karma is allowed — no floor.
 */
export const KARMA = {
  POST_UPVOTE: 10,
  POST_DOWNVOTE: -2,
  COMMENT_UPVOTE: 4,
  COMMENT_DOWNVOTE: -1,
  POST_CREATED: 2,
  COMMENT_CREATED: 1,
};
